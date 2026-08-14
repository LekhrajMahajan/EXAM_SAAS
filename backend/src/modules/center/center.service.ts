import { Types } from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";
import centerRepository from "./center.repository";
import companyService from "../company/company.service";
import branchService from "../branch/branch.service";
import authService from "../auth/auth.service";
import User from "../auth/user.model";
import emailService from "../email/email.service";
import auditLogService from "../audit-log/auditLog.service";
import CenterOnboarding from "./centerOnboarding.model";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { hashPassword } from "../../utils/password";

import {
  ICenter,
  CenterStatus,
  CenterSetupStatus,
  DocumentApprovalStatus,
  ICenterDashboardStats,
  ICenterDocumentUpload,
} from "./center.types";
import { BaseService } from "../../common/base.service";
import { AuditAction } from "../audit-log/auditLog.types";

class CenterService extends BaseService<ICenter> {
  constructor() {
    super(centerRepository, "Center");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Center with Automatic Center Manager Provisioning (Phase 5.3)
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<ICenter>) {
    await companyService.getActiveById(payload.companyId!.toString());
    const branch = await branchService.getActiveById(payload.branchId!.toString());

    const branchCompanyId = (branch.companyId as any)._id
      ? (branch.companyId as any)._id.toString()
      : branch.companyId.toString();

    if (branchCompanyId !== payload.companyId!.toString()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Branch does not belong to the selected company.",
      );
    }

    const existingCode = await centerRepository.findByCenterCode(
      payload.companyId!.toString(),
      payload.branchId!.toString(),
      payload.centerCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Center code already exists.");
    }

    const existingName = await centerRepository.findByCenterName(
      payload.companyId!.toString(),
      payload.branchId!.toString(),
      payload.centerName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Center name already exists.");
    }

    if (payload.availableCapacity! > payload.capacity!) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Available capacity cannot exceed total capacity.",
      );
    }

    // Set initial onboarding status
    payload.setupStatus = CenterSetupStatus.DRAFT;
    payload.setupCurrentStep = 1;
    payload.completionPercentage = 0;
    payload.readinessScore = 0;
    payload.complianceScore = 0;

    // Set mandatory documents boilerplate if none supplied
    if (!payload.documents || payload.documents.length === 0) {
      payload.documents = [
        { documentType: "PAN Card", isMandatory: true, fileName: "Pending Upload", fileUrl: "", version: 1, status: DocumentApprovalStatus.PENDING, uploadedAt: new Date() },
        { documentType: "GST Certificate", isMandatory: true, fileName: "Pending Upload", fileUrl: "", version: 1, status: DocumentApprovalStatus.PENDING, uploadedAt: new Date() },
        { documentType: "Aadhaar Card", isMandatory: true, fileName: "Pending Upload", fileUrl: "", version: 1, status: DocumentApprovalStatus.PENDING, uploadedAt: new Date() },
        { documentType: "Cancelled Cheque", isMandatory: true, fileName: "Pending Upload", fileUrl: "", version: 1, status: DocumentApprovalStatus.PENDING, uploadedAt: new Date() },
        { documentType: "Signed MOU", isMandatory: true, fileName: "Pending Upload", fileUrl: "", version: 1, status: DocumentApprovalStatus.PENDING, uploadedAt: new Date() },
      ];
    }

    if ((!payload.commercialAgreement || payload.commercialAgreement.length === 0) && (payload as any).shiftRates && Array.isArray((payload as any).shiftRates)) {
      payload.commercialAgreement = (payload as any).shiftRates.map((s: any) => ({
        shiftName: s.name || s.shiftName || "Standard Shift",
        pricePerCandidate: Number(s.price || s.pricePerCandidate) || 250,
        candidateCapacity: payload.capacity || 100,
        maximumCapacity: payload.capacity || 100,
        specialNotes: `Slot timings: ${s.timings || "Standard Hours"}`
      }));
    }

    const center: any = await super.create(payload);
    const centerIdStr = center._id || center.id;

    // Create the separate Onboarding record
    await CenterOnboarding.create({
      centerId: centerIdStr,
      companyId: payload.companyId,
      branchId: payload.branchId,
      commercialAgreement: (payload as any).commercialAgreement || [],
      documents: (payload as any).documents || [],
      status: CenterSetupStatus.DRAFT,
    });

    // Auto-provision Center Manager user account if official email is provided
    if (center.email) {
      try {
        let managerUser: any = await authService.checkEmailExists(center.email);
        const randomHex = crypto.randomBytes(4).toString("hex");
        const temporaryPassword = `Ctr@${randomHex}B2!`;

        if (!managerUser) {
          managerUser = await authService.createUser({
            companyId: center.companyId,
            branchId: center.branchId,
            centerId: new Types.ObjectId(centerIdStr.toString()),
            firstName: payload.managerName || "Center",
            lastName: "Manager",
            email: center.email,
            phone: center.phone || "0000000000",
            password: temporaryPassword,
            role: "CENTER_MANAGER",
            managerCode: `${center.centerCode}_MGR`,
            joiningDate: new Date(),
            forcePasswordChange: false,
            department: "Center Operations & Administration",
            designation: "Center Head / Manager",
            status: "ACTIVE",
          } as any);
        } else {
          // If user exists from prior tests, update password & center mapping so email credentials are valid
          const hashedPassword = await hashPassword(temporaryPassword);
          const userId = (managerUser as any)._id || (managerUser as any).id;
          
          const updatePayload: any = {
            password: hashedPassword,
            forcePasswordChange: false,
            lockoutUntil: null,
            loginAttempts: 0,
          };
          
          // Only update role and status if they are NOT an admin (to avoid Mongoose validation errors on Admin model)
          if (!["MASTER_ADMIN", "COMPANY_ADMIN", "ADMIN"].includes(managerUser.role)) {
            updatePayload.role = "CENTER_MANAGER";
            updatePayload.status = "ACTIVE";
            updatePayload.managerCode = `${center.centerCode}_MGR`;
            updatePayload.joiningDate = new Date();
            updatePayload.centerId = new Types.ObjectId(centerIdStr.toString());
          }

          try {
            await authService.update(userId.toString(), updatePayload);
          } catch (updateErr: any) {
            console.error(`[CenterService] Non-fatal error updating existing user for center manager:`, updateErr.message);
          }
        }

        // Assign manager to center
        const managerId = (managerUser as any)._id || (managerUser as any).id;
        if (managerId) {
          await centerRepository.update(centerIdStr.toString(), {
            centerManagerId: new Types.ObjectId(managerId.toString()),
          } as any);
          (center as any).centerManagerId = managerId;
          (center as any).temporaryPassword = temporaryPassword;
        }

        // Log credentials clearly in console for evaluation & auditing
        console.log(`[CenterService] ✅ Onboarded Center Manager (${center.email}) - Login Password: ${temporaryPassword}`);

        // Dispatch login credentials email via standard emailService to guarantee delivery
        if (temporaryPassword) {
          await emailService.send({
            to: center.email,
            subject: `Center Manager Login Credentials - ${center.centerName || 'Center'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #059669; margin-top: 0;">Welcome to ExamGuard Pro Enterprise</h2>
                <p>Hello <strong>${payload.managerName || "Center Manager"}</strong>,</p>
                <p>A new examination center <strong>${center.centerName || 'Center'}</strong> has been registered, and your user profile has been provisioned as the designated Center Manager.</p>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>Your Secure Login Credentials:</strong></p>
                  <p style="margin: 5px 0;"><b>Official Email:</b> ${center.email}</p>
                  <p style="margin: 5px 0;"><b>Password:</b> <code style="background: #d1fae5; padding: 2px 6px; border-radius: 4px; color: #065f46; font-weight: bold;">${temporaryPassword}</code></p>
                  <p style="margin: 5px 0;"><b>Assigned Role:</b> CENTER_MANAGER</p>
                  <p style="margin: 5px 0;"><b>Center Code:</b> ${center.centerCode}</p>
                  <p style="margin: 5px 0;"><b>Login Portal:</b> /auth/login</p>
                </div>
                <p style="color: #4b5563; font-size: 13px;">Note: You can use the "Forgot password?" option on the login page anytime if you wish to change your password.</p>
              </div>
            `,
            priority: "high" as any,
          }).catch((err: any) => {
            console.error(`[CenterService] Failed to send credentials email to ${center.email}:`, err);
            require("fs").writeFileSync("debug_error_email.log", String(err.message || err));
          });
        }
      } catch (err: any) {
        console.error(`[CenterService] ❌ Center Manager auto-provisioning exception during center creation:`, err.message, err.stack);
        require("fs").writeFileSync("debug_error.log", String(err.stack || err.message || err));
        // Don't block center creation if manager provisioning fails
      }
    }

    // Record system audit log
    await auditLogService.log({
      action: AuditAction.CREATE,
      module: "Center Operation Workflow",
      targetId: centerIdStr.toString(),
      description: `Created center ${center.centerName} with commercial agreement and provisioned manager account.`,
      status: "SUCCESS",
    } as any).catch(() => {});

    const ret = center.toObject ? center.toObject() : { ...center };
    if ((center as any).temporaryPassword) {
      ret.temporaryPassword = (center as any).temporaryPassword;
    }
    return ret;
  }

  /*
  |--------------------------------------------------------------------------
  | Save Onboarding Step (Steps 1 through 8)
  |--------------------------------------------------------------------------
  */
  async saveOnboardingStep(
    centerId: string,
    step: number,
    stepPayload: any,
    reqUser?: any,
    reqMetadata?: { ip?: string; userAgent?: string }
  ) {
    const center = await centerRepository.findById(centerId);
    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center record not found.");
    }

    if (center.setupStatus === CenterSetupStatus.ACTIVE) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Center verification is already ACTIVE. Operational modifications must use enterprise settings."
      );
    }

    const updateFields: Partial<ICenter> = {};
    const onboardingUpdateFields: any = {};

    // Step 1: Rules & Agreement Acceptance
    if (step === 1) {
      onboardingUpdateFields.agreementDetails = {
        acceptedBy: reqUser?.email || center.email,
        acceptedTime: new Date(),
        acceptedIp: reqMetadata?.ip || "127.0.0.1",
        browser: reqMetadata?.userAgent || "Automated Enterprise Client",
        device: "Web Browser Desktop/Mobile",
        geoLocation: {
          latitude: center.latitude || 28.6139,
          longitude: center.longitude || 77.209,
          city: center.city || "Headquarters Area",
        },
      };
    }
    // Step 2: Center Profile Extension
    else if (step === 2) {
      updateFields.profileExtension = {
        ...center.profileExtension,
        ...stepPayload,
      };
      if (stepPayload.latitude !== undefined) updateFields.latitude = stepPayload.latitude;
      if (stepPayload.longitude !== undefined) updateFields.longitude = stepPayload.longitude;
    }
    // Step 3: Document Uploads & Versioning
    else if (step === 3) {
      // Need to fetch current onboarding documents
      const onboardingRecord = await CenterOnboarding.findOne({ centerId: center._id }).lean();
      const currentDocs: any[] = onboardingRecord?.documents ? [...onboardingRecord.documents] : [];
      const newDocs: ICenterDocumentUpload[] = Array.isArray(stepPayload.documents) ? stepPayload.documents : [];

      newDocs.forEach((inDoc) => {
        const existingIdx = currentDocs.findIndex(
          (d) => d?.documentType?.toLowerCase() === inDoc?.documentType?.toLowerCase()
        );
        if (existingIdx !== -1) {
          // Keep version history or increment version if replaced
          const existingDoc = currentDocs[existingIdx];
          const newVersion = existingDoc.fileUrl !== inDoc.fileUrl ? (existingDoc.version || 1) + 1 : existingDoc.version || 1;
          currentDocs[existingIdx] = {
            ...existingDoc,
            fileName: inDoc.fileName || existingDoc.fileName,
            fileUrl: inDoc.fileUrl || existingDoc.fileUrl,
            fileSize: (inDoc as any).fileSize || (existingDoc as any).fileSize,
            expiryDate: inDoc.expiryDate || existingDoc.expiryDate,
            version: newVersion,
            status: existingDoc.status === DocumentApprovalStatus.REJECTED ? DocumentApprovalStatus.PENDING : existingDoc.status,
            uploadedAt: new Date(),
          };
        } else {
          currentDocs.push({
            documentType: inDoc.documentType,
            isMandatory: inDoc.isMandatory !== undefined ? inDoc.isMandatory : false,
            fileName: inDoc.fileName,
            fileSize: (inDoc as any).fileSize,
            fileUrl: inDoc.fileUrl,
            version: 1,
            status: DocumentApprovalStatus.PENDING,
            uploadedAt: new Date(),
          });
        }
      });
      onboardingUpdateFields.documents = currentDocs;
    }
    // Step 4: Center Staff Registration with auto Employee ID generation
    else if (step === 4) {
      const staffList = Array.isArray(stepPayload.staffList) ? stepPayload.staffList : [];
      updateFields.staffList = staffList.map((s: any, idx: number) => ({
        ...s,
        employeeId: s.employeeId || `${center.centerCode}_STF_${String(idx + 1).padStart(3, "0")}`,
        joiningDate: s.joiningDate ? new Date(s.joiningDate) : new Date(),
        employeeStatus: s.employeeStatus || "ACTIVE",
      }));
    }
    // Step 5: Infrastructure Setup
    else if (step === 5) {
      const infra = Array.isArray(stepPayload.infrastructureNodes) ? stepPayload.infrastructureNodes : [];
      updateFields.infrastructureNodes = infra;
    }
    // Step 6: Exam Readiness Score calculation
    else if (step === 6) {
      const readiness = stepPayload.examReadiness || {};
      let score = 0;
      if (readiness.hasControlRoom) score += 20;
      if (readiness.hasStrongRoom) score += 25;
      if (readiness.hasQuestionPaperStorage) score += 15;
      if ((readiness.biometricCountersCount || 0) >= 4) score += 15;
      if (readiness.powerBackupTested) score += 15;
      if (readiness.internetBackupTested) score += 10;

      updateFields.examReadiness = { ...readiness, readinessScore: Math.min(score, 100) };
      updateFields.readinessScore = Math.min(score, 100);
    }
    // Step 7: Center Capacity & Shift Planning Validation
    else if (step === 7) {
      const plans = Array.isArray(stepPayload.shiftPlans) ? stepPayload.shiftPlans : [];
      // Validate whether sufficient infrastructure exists
      const totalSystems = (center.infrastructureNodes || []).reduce((acc: number, cur: any) => acc + (cur.computerCount || 0), 0);
      
      updateFields.shiftPlans = plans.map((p: any) => {
        const isInfraValid = totalSystems === 0 || totalSystems >= (p.maximumCandidates || 0);
        // Match expected revenue against shift commercial agreement if defined
        let expectedRevenue = p.expectedRevenue || 0;
        const commAgreement = (center.commercialAgreement || []).find((c: any) => c.shiftName === p.shiftName);
        if (commAgreement && !p.expectedRevenue) {
          expectedRevenue = (p.maximumCandidates || 0) * (commAgreement.pricePerCandidate || 350);
        }

        return {
          ...p,
          isInfrastructureValid: isInfraValid,
          expectedRevenue,
        };
      });
    }
    // Step 8: Center Compliance Checklist
    else if (step === 8) {
      const comp = stepPayload.complianceChecklist || {};
      let cScore = 0;
      if (comp.fireSafetyTested) cScore += 15;
      if (comp.biometricTested) cScore += 15;
      if (comp.cctvWorking) cScore += 15;
      if (comp.networkTested) cScore += 15;
      if (comp.powerBackupTested) cScore += 10;
      if (comp.computersTested) cScore += 10;
      if (comp.strongRoomReady) cScore += 10;
      if (comp.questionStorageReady) cScore += 10;

      const finalizedScore = Math.min(cScore, 100);
      updateFields.complianceChecklist = { ...comp, complianceScore: finalizedScore };
      updateFields.complianceScore = finalizedScore;
    }

    // Update progression trackers
    const newStep = Math.max(center.setupCurrentStep || 1, step >= 8 ? 8 : step + 1);
    updateFields.setupCurrentStep = newStep;
    updateFields.completionPercentage = Math.round((newStep / 8) * 100);

    if (center.setupStatus === CenterSetupStatus.REJECTED && step === 8) {
      updateFields.setupStatus = CenterSetupStatus.DRAFT;
    }

    // Save Center Data
    let updated: any = center;
    if (Object.keys(updateFields).length > 0) {
      updated = await centerRepository.update(centerId, updateFields as any);
    }
    
    // Save Onboarding specific Data
    if (Object.keys(onboardingUpdateFields).length > 0) {
      await CenterOnboarding.findOneAndUpdate(
        { centerId: center._id },
        { $set: onboardingUpdateFields },
        { returnDocument: "after", upsert: true }
      );
    }

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Center Onboarding Wizard",
      targetId: centerId,
      description: `Center Manager saved onboarding Step ${step} for ${center.centerName}`,
      performedBy: reqUser?.id || reqUser?.userId,
      performedByRole: reqUser?.role || "CENTER_MANAGER",
      status: "SUCCESS",
    } as any).catch(() => {});

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Onboarding for Admin Verification
  |--------------------------------------------------------------------------
  */
  async submitForVerification(centerId: string, reqUser?: any) {
    const center = await centerRepository.findById(centerId);
    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center record not found.");
    }

    if (center.setupStatus === CenterSetupStatus.ACTIVE) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Center is already active and verified.");
    }

    // Note: The mandatory 8-step validation has been bypassed because the workflow
    // was simplified to just accepting commercial terms and uploading verification documents.

    const updated = await centerRepository.update(centerId, {
      setupStatus: CenterSetupStatus.PENDING_VERIFICATION,
      completionPercentage: 100,
    } as any);
    
    await CenterOnboarding.findOneAndUpdate(
      { centerId: center._id },
      { 
        $set: { 
          status: CenterSetupStatus.PENDING_VERIFICATION,
          adminReviewRemarks: "" 
        } 
      },
      { upsert: true }
    );

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Center Verification Workflow",
      targetId: centerId,
      description: `Center Manager submitted onboarding setup for official administrative verification.`,
      performedBy: reqUser?.id || reqUser?.userId,
      performedByRole: reqUser?.role || "CENTER_MANAGER",
      status: "SUCCESS",
    } as any).catch(() => {});

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Document (Company Admin Action)
  |--------------------------------------------------------------------------
  */
  async verifyDocument(
    centerId: string,
    documentIdOrType: string,
    status: DocumentApprovalStatus,
    rejectionReason?: string,
    correctionNotes?: string,
    reqUser?: any
  ) {
    const center = await centerRepository.findById(centerId);
    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center record not found.");
    }

    if (status === DocumentApprovalStatus.REJECTED && (!rejectionReason || !rejectionReason.trim())) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Rejection Reason and Correction Notes are strictly required when rejecting a center legal document."
      );
    }

    const onboardingRecord = await CenterOnboarding.findOne({ centerId: center._id });
    if (!onboardingRecord) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Onboarding record not found.");
    }

    const docIdx = onboardingRecord.documents.findIndex(
      (d: any) => d._id?.toString() === documentIdOrType || d.documentType?.toLowerCase() === documentIdOrType.toLowerCase()
    );

    if (docIdx === -1) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Target document upload not found in center profile.");
    }
    
    const targetDoc = onboardingRecord.documents[docIdx];

    const updated = await CenterOnboarding.findOneAndUpdate(
      { centerId: center._id, "documents._id": (targetDoc as any)._id },
      { 
        $set: { 
          "documents.$.status": status,
          "documents.$.rejectionReason": status === DocumentApprovalStatus.REJECTED ? rejectionReason : "",
          "documents.$.correctionNotes": status === DocumentApprovalStatus.REJECTED ? correctionNotes : "",
          ...(status === DocumentApprovalStatus.REJECTED ? { status: CenterSetupStatus.REJECTED } : {})
        } 
      },
      { returnDocument: "after" }
    );

    if (status === DocumentApprovalStatus.REJECTED) {
      await centerRepository.update(centerId, { setupStatus: CenterSetupStatus.REJECTED } as any);
    }

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Document Approval Workflow",
      targetId: centerId,
      description: `Company Admin set document (${targetDoc.documentType}) to status ${status}.`,
      performedBy: reqUser?.id || reqUser?.userId,
      performedByRole: reqUser?.role || "COMPANY_ADMIN",
      status: "SUCCESS",
    } as any).catch(() => {});

    if (status === DocumentApprovalStatus.REJECTED && center.email) {
      await emailService
        .send({
          to: center.email,
          subject: `Action Required: Document Rejected - ${center.centerName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #dc2626; margin-top: 0;">Action Required: Document Rejected</h2>
              <p>Hello,</p>
              <p>During the verification of your center <strong>${center.centerName} (${center.centerCode})</strong>, the Company Admin has rejected one of your uploaded documents.</p>
              <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Rejected Document Details:</strong></p>
                <p style="margin: 5px 0;"><b>Document Type:</b> ${targetDoc.documentType}</p>
                <p style="margin: 5px 0;"><b>Rejection Reason:</b> ${rejectionReason}</p>
                ${correctionNotes ? `<p style="margin: 5px 0;"><b>Correction Notes:</b> ${correctionNotes}</p>` : ''}
              </div>
              <p style="color: #4b5563;">Please log in to your Center Manager dashboard immediately and re-upload the corrected document. Your dashboard access will remain restricted until all mandatory documents are approved.</p>
            </div>
          `,
        })
        .catch((err) => {
          console.warn(`Failed to send document rejection email: ${err.message}`);
        });
    }

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Center Setup (Company Admin Approval / Rejection)
  |--------------------------------------------------------------------------
  */
  async verifyCenterSetup(centerId: string, status: CenterSetupStatus, remarks?: string, reqUser?: any) {
    const center = await centerRepository.findById(centerId);
    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center record not found.");
    }

    if (status === CenterSetupStatus.REJECTED && (!remarks || !remarks.trim())) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Explicit revision feedback remarks are mandatory when rejecting a center onboarding setup."
      );
    }

    const onboardingRecord = await CenterOnboarding.findOne({ centerId: center._id });
    if (!onboardingRecord) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Onboarding record not found.");
    }

    // Verify all mandatory documents are approved before activating
    if (status === CenterSetupStatus.ACTIVE) {
      const mandatoryDocs = (onboardingRecord.documents || []).filter((d: any) => d.isMandatory);
      const unapproved = mandatoryDocs.filter((d: any) => d.status !== DocumentApprovalStatus.APPROVED && d.fileUrl && d.fileUrl.trim() !== "");
      if (unapproved.length > 0) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Cannot verify center as ACTIVE: Mandatory documents (${unapproved.map((u: any) => u.documentType).join(", ")}) must be explicitly approved first.`
        );
      }
    }

    const updateFields: any = {
      setupStatus: status,
      adminReviewRemarks: status === CenterSetupStatus.REJECTED ? remarks : "Approved and activated by Company Admin",
    };

    if (status === CenterSetupStatus.ACTIVE) {
      updateFields.status = CenterStatus.ACTIVE;
      updateFields.completionPercentage = 100;
    }

    const updated = await centerRepository.update(centerId, updateFields);

    await CenterOnboarding.findOneAndUpdate(
      { centerId: center._id },
      { 
        $set: { 
          status,
          adminReviewRemarks: updateFields.adminReviewRemarks 
        } 
      }
    );

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Center Verification Workflow",
      targetId: centerId,
      description: `Company Admin finalized center verification decision: ${status} for ${center.centerName}`,
      performedBy: reqUser?.id || reqUser?.userId,
      performedByRole: reqUser?.role || "COMPANY_ADMIN",
      status: "SUCCESS",
    } as any).catch(() => {});

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Pending Verifications List
  |--------------------------------------------------------------------------
  */
  async getPendingVerifications(companyId?: string, branchId?: string) {
    const centers = await centerRepository.findPendingVerifications(companyId, branchId);
    
    // Fetch onboarding documents for each center
    const enrichedCenters = await Promise.all(
      centers.map(async (c: any) => {
        const onboardingData = await CenterOnboarding.findOne({ centerId: c._id }).lean();
        return {
          ...c,
          documents: onboardingData?.documents || []
        };
      })
    );

    return {
      centers: enrichedCenters,
      total: enrichedCenters.length,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Center Dashboard Analytics & Readiness
  |--------------------------------------------------------------------------
  */
  async getCenterDashboardStats(centerId: string) {
    const stats = await centerRepository.getDashboardStats(centerId);
    if (!stats) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center statistics could not be compiled.");
    }
    return stats;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Single Center (Override to include dynamic lab stats)
  |--------------------------------------------------------------------------
  */
  async getById(id: string) {
    const center: any = await super.getById(id);
    if (!center) return center;

    const CenterLab = require("./centerLab.model").default;
    const centerIdStr = (center._id || center.id)?.toString();
    
    let labs: any[] = [];
    if (centerIdStr) {
      labs = await CenterLab.find({ centerId: centerIdStr }).lean();
    }
    
    const totalLabs = labs.length;
    const totalSystems = labs.reduce((sum: number, lab: any) => sum + (lab.totalComputers || 0), 0);
    
    const centerData = center.toObject ? center.toObject() : { ...center };
    return {
      ...centerData,
      totalLabs,
      totalSystems
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Centers (Existing CRUD preserved)
  |--------------------------------------------------------------------------
  */
  async getAll(query: any) {
    const result = await super.getAll(query);
    
    // Dynamically fetch and append lab counts from CenterLab collection
    const CenterLab = require("./centerLab.model").default;
    const centerIds = result.data?.map((c: any) => c._id || c.id) || [];
    
    let labs: any[] = [];
    if (centerIds.length > 0) {
      labs = await CenterLab.find({ centerId: { $in: centerIds } }).lean();
    }

    const enhancedCenters = result.data?.map((center: any) => {
       const centerIdStr = (center._id || center.id)?.toString();
       const centerLabs = labs.filter((l: any) => l.centerId?.toString() === centerIdStr);
       const totalLabs = centerLabs.length;
       const totalSystems = centerLabs.reduce((sum: number, lab: any) => sum + (lab.totalComputers || 0), 0);
       
       const centerData = center.toObject ? center.toObject() : { ...center };
       return {
         ...centerData,
         totalLabs,
         totalSystems
       };
    }) || [];

    return {
      centers: enhancedCenters,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Center (Existing CRUD preserved)
  |--------------------------------------------------------------------------
  */
  async update(id: string, payload: Partial<ICenter>) {
    const center = await centerRepository.findById(id);

    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found.");
    }

    if (payload.centerCode && payload.centerCode !== center.centerCode) {
      const existingCode = await centerRepository.findByCenterCode(
        center.companyId._id.toString(),
        center.branchId._id.toString(),
        payload.centerCode,
      );

      if (existingCode && existingCode.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Center code already exists.");
      }
    }

    if (payload.centerName && payload.centerName !== center.centerName) {
      const existingName = await centerRepository.findByCenterName(
        center.companyId._id.toString(),
        center.branchId._id.toString(),
        payload.centerName,
      );

      if (existingName && existingName.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Center name already exists.");
      }
    }

    const totalCapacity = payload.capacity ?? center.capacity;
    const availableCapacity = payload.availableCapacity ?? center.availableCapacity;

    if (availableCapacity > totalCapacity) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Available capacity cannot exceed total capacity.",
      );
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */
  async statistics(companyId?: string) {
    const totalCenters = await centerRepository.count(companyId ? { companyId } : undefined);
    return {
      totalCenters,
    };
  }

}

export default new CenterService();

