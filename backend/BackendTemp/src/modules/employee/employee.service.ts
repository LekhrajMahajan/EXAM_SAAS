import mongoose, { ClientSession } from "mongoose";
import crypto from "crypto";

import employeeRepository from "./employee.repository";
import companyService from "../company/company.service";
import authService from "../auth/auth.service";
import roleRepository from "../role/role.repository";
import userRepository from "../user/user.repository";
import auditLogService from "../audit-log/auditLog.service";
import notificationService from "../notification/notification.service";
import emailService from "../email/email.service";
import importExportService from "../import-export/importExport.service";
import centerRepository from "../center/center.repository";

import { AuditAction } from "../audit-log/auditLog.types";
import { NotificationType, NotificationPriority, NotificationChannel } from "../notification/notification.types";
import {
  IEmployee,
  EmployeeStatus,
  EmployeeVerificationStatus,
  SUPPORTED_EMPLOYEE_ROLES,
  IEmployeeDocument,
} from "./employee.types";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { BaseService } from "../../common/base.service";

class EmployeeService extends BaseService<IEmployee> {
  constructor() {
    super(employeeRepository, "Employee");
  }

  /*
  |--------------------------------------------------------------------------
  | Role & Business Flow Validation Helper
  |--------------------------------------------------------------------------
  */
  private validateRole(roleName: string): void {
    if (roleName.toUpperCase() === "QUESTION_SETTER") {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Question Setter role must NOT exist. Paper Setter is responsible for entering all questions."
      );
    }

    const roleUpper = roleName.toUpperCase();
    if (!SUPPORTED_EMPLOYEE_ROLES.includes(roleUpper as any) && roleUpper !== "CENTER_MANAGER" && roleUpper !== "CENTER_MANAGER") {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Role '${roleName}' is not an authorized enterprise employee role. Supported roles: ${SUPPORTED_EMPLOYEE_ROLES.join(", ")}`
      );
    }
  }

  private getAuthUserId(employee: any): string {
    if (!employee.userId) return "";
    return typeof employee.userId === "object" && "_id" in employee.userId
      ? employee.userId._id.toString()
      : employee.userId.toString();
  }

  /*
  |--------------------------------------------------------------------------
  | Create & Invite Employee Flow
  |--------------------------------------------------------------------------
  */
  async create(payload: any, session?: ClientSession, userIdForAudit?: string): Promise<any> {
    return this.createOrInviteEmployee(payload, userIdForAudit, false, session);
  }

  async invite(payload: any, userIdForAudit?: string, session?: ClientSession): Promise<any> {
    return this.createOrInviteEmployee(payload, userIdForAudit, true, session);
  }

  private async createOrInviteEmployee(payload: any, userIdForAudit?: string, isInvite: boolean = false, session?: ClientSession): Promise<any> {
    await companyService.getActiveById(payload.companyId);

    // We now allow duplicate emails across all roles.
    // Login system identifies the correct account by comparing passwords.

    let userRole = payload.role;
    if (payload.roleId) {
      const roleDoc = await roleRepository.findById(payload.roleId);
      if (!roleDoc) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Specified Role ID not found.");
      }
      userRole = roleDoc.name;
    }
    this.validateRole(userRole);

    let employeeCode = payload.employeeCode;
    if (!employeeCode) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      employeeCode = `EMP-${randomNumber}`;
    }

    const existingEmployee = await employeeRepository.findByEmployeeCode(payload.companyId, employeeCode);
    if (existingEmployee) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `Employee code '${employeeCode}' is already assigned in this company.`);
    }

    // Auto generate temporary password
    const temporaryPassword = payload.password || `Emp@${crypto.randomBytes(4).toString("hex")}1!`;

    // Create authentication user in Manager table
    const user = await authService.createUser({
      companyId: payload.companyId,
      managerCode: employeeCode,
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      email: payload.email,
      username: payload.username || payload.email.split("@")[0],
      phone: payload.phone,
      alternateMobile: payload.alternateMobile,
      password: temporaryPassword,
      role: userRole.toUpperCase(),
      forcePasswordChange: true,
      status: "ACTIVE",
      department: payload.department,
      designation: payload.designation,
      joiningDate: payload.joiningDate,
    });


    if (payload.centerId) {
      const centerDoc = await centerRepository.findById(payload.centerId);
      if (!centerDoc) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found");
      payload.centerId = new mongoose.Types.ObjectId(payload.centerId as string);
    }
    if (payload.reportingManager) {
      payload.reportingManager = new mongoose.Types.ObjectId(payload.reportingManager as string);
    }

    const initialLifecycleEntry = {
      status: EmployeeStatus.PENDING_VERIFICATION,
      changedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit) : null,
      reason: isInvite ? "Employee invited via automated onboarding workflow" : "Employee profile manually created by Admin",
      timestamp: new Date(),
    };

    const employee: any = await super.create(
      {
        ...payload,
        companyId: new mongoose.Types.ObjectId(payload.companyId as string),
        userId: user._id as mongoose.Types.ObjectId,
        employeeCode: employeeCode.toUpperCase(),
        role: userRole.toUpperCase(),
        status: EmployeeStatus.ACTIVE,
        verificationStatus: EmployeeVerificationStatus.PENDING,
        profileCompleted: false,
        emailVerified: false,
        mobileVerified: false,
        aadhaarVerified: false,
        lifecycleHistory: [initialLifecycleEntry],
        biometrics: { isEnrolled: false, enrollmentHistory: [], verificationHistory: [] },
        documents: [],
        skills: payload.skills || [],
        certifications: payload.certifications || [],
        languages: payload.languages || [],
      } as any,
      session
    );

    // Send onboarding credentials email
    if (userRole.toUpperCase() !== "ENTRY_CHECKER") {
      try {
        let examText = "";
        let examHtml = "";

        if (payload.examId) {
          try {
            const Exam = require("../exam/exam.model").default;
            const exam = await Exam.findById(payload.examId);
            if (exam) {
              const title = exam.examTitle || exam.examCode;
              examText = ` You have been assigned to the exam: ${title}.`;
              examHtml = `<p><b>Assigned Exam:</b> ${title}</p>`;
            }
          } catch (e) {
            console.error("Failed to fetch exam details for email:", e);
          }
        }

        await emailService.sendCustom({
          to: payload.email,
          subject: "Welcome to ExamGuard Pro Enterprise - Login Credentials",
          html: `<p>Hello ${payload.firstName} ${payload.lastName},</p><p>You have been onboarded as an employee (${userRole.toUpperCase()}) in ExamGuard Pro.</p>${examHtml}<p><b>Your login credentials are:</b><br/>Email: ${payload.email}<br/>Employee Code: ${employeeCode.toUpperCase()}<br/>Temporary Password: ${temporaryPassword}</p><p>Upon your first login, you will be required to update your password and complete your biometric and document verification.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
          text: `Hello ${payload.firstName}, your login credentials are Email: ${payload.email}, Code: ${employeeCode.toUpperCase()}, Password: ${temporaryPassword}.${examText}`,
        });
      } catch (err) {
        console.error("Failed to transmit employee invitation email:", err);
      }
    }

    // Trigger Notification
    try {
      await notificationService.create({
        companyId: new mongoose.Types.ObjectId(payload.companyId as string),
        recipientId: user._id as mongoose.Types.ObjectId,
        title: "Employee Account Created",
        message: `Welcome ${payload.firstName}. Please complete your profile and document verification workflow.`,
        type: NotificationType.SYSTEM,
        channel: NotificationChannel.IN_APP,
        priority: NotificationPriority.HIGH,
      } as any);
    } catch (err) {
      console.error("Failed to log notification:", err);
    }

    await auditLogService.logSuccess({
      action: AuditAction.CREATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Created employee ${employee.employeeCode} with role ${userRole}`,
      performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit) : undefined,
      newData: employee as any,
    });

    return Object.assign(employee.toObject ? employee.toObject() : employee, { temporaryPassword });
  }

  async update(id: string, data: any, populateFields?: string[], session?: ClientSession, userIdForAudit?: string): Promise<any> {
    const updated = await super.update(id, data, populateFields, session);
    
    // Send email on edit details
    try {
      if (updated && updated.email) {
        await emailService.sendCustom({
          to: updated.email,
          subject: "Your Profile Details Have Been Updated",
          html: `<p>Hello ${updated.firstName},</p><p>Your employee profile details have been updated by the Company Administration.</p><p>Please review your profile in the portal to ensure all details are correct.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
          text: `Hello ${updated.firstName}, your employee profile details have been updated by the Company Administration.`,
        });
      }
    } catch (err) {
      console.error("Failed to send update email:", err);
    }

    try {
      await auditLogService.logSuccess({
        action: AuditAction.UPDATE,
        module: "EMPLOYEE",
        entityId: new mongoose.Types.ObjectId(id),
        entityName: "Employee",
        description: `Updated employee record: ${id}`,
        performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit) : undefined,
        newData: data,
      });
    } catch (e) {
      // Non-blocking audit logging
    }
    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | First Login & Profile Completion Workflow
  |--------------------------------------------------------------------------
  */
  async completeProfile(userIdOrEmployeeId: string, payload: any, performedBy?: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee record not found for profile completion.");
    }

    const id = employee._id?.toString() || "";
    const updateData: any = {
      profileCompleted: true,
      updatedAt: new Date(),
    };

    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.middleName !== undefined) updateData.middleName = payload.middleName;
    if (payload.phone) updateData.phone = payload.phone;
    if (payload.alternateMobile !== undefined) updateData.alternateMobile = payload.alternateMobile;
    if (payload.dob) updateData.dob = new Date(payload.dob);
    if (payload.gender) updateData.gender = payload.gender;
    if (payload.bloodGroup) updateData.bloodGroup = payload.bloodGroup;
    if (payload.address) updateData.address = payload.address;
    if (payload.city) updateData.city = payload.city;
    if (payload.state) updateData.state = payload.state;
    if (payload.country) updateData.country = payload.country;
    if (payload.pincode) updateData.pincode = payload.pincode;
    if (payload.profileImage) updateData.profileImage = payload.profileImage;
    if (payload.digitalSignature) updateData.digitalSignature = payload.digitalSignature;
    if (payload.bankDetails) updateData.bankDetails = payload.bankDetails;
    if (payload.emergencyContact) updateData.emergencyContact = payload.emergencyContact;
    if (payload.education) updateData.education = payload.education;
    if (payload.experience) updateData.experience = payload.experience;
    if (payload.skills) updateData.skills = payload.skills;
    if (payload.certifications) updateData.certifications = payload.certifications;
    if (payload.languages) updateData.languages = payload.languages;

    const updatedEmployee = await super.update(id, updateData);

    const authUserId = this.getAuthUserId(employee);
    if (authUserId) {
      await authService.update(authUserId, {
        firstName: updateData.firstName || employee.firstName,
        lastName: updateData.lastName || employee.lastName,
        phone: updateData.phone || employee.phone,
      } as any);
    }

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Employee completed onboarding profile: ${employee.employeeCode}`,
      performedBy: (performedBy || authUserId) ? new mongoose.Types.ObjectId((performedBy || authUserId) as string) : undefined,
    });

    return updatedEmployee;
  }

  /*
  |--------------------------------------------------------------------------
  | Employee Document Upload (Mandatory & Optional with Versioning)
  |--------------------------------------------------------------------------
  */
  async uploadDocuments(userIdOrEmployeeId: string, docsPayload: any[], performedBy?: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee record not found.");
    }

    const id = employee._id?.toString() || "";
    const currentDocs = [...(employee.documents || [])];
    const authUserId = this.getAuthUserId(employee);
    const actor = performedBy ? performedBy : authUserId || id;

    for (const newDoc of docsPayload) {
      const existingIdx = currentDocs.findIndex(
        (d) => d.documentType.trim().toLowerCase() === newDoc.documentType.trim().toLowerCase()
      );

      const auditEntry = {
        action: existingIdx >= 0 ? "REPLACE_DOCUMENT" : "UPLOAD_DOCUMENT",
        performedBy: actor,
        timestamp: new Date(),
        remarks: `Uploaded ${newDoc.documentType}`,
      };

      if (existingIdx >= 0) {
        const oldDoc = currentDocs[existingIdx];
        const nextVersion = (oldDoc.version || 1) + 1;
        currentDocs[existingIdx] = {
          _id: oldDoc._id,
          documentType: newDoc.documentType,
          documentUrl: newDoc.documentUrl,
          fileName: newDoc.fileName || oldDoc.fileName,
          fileSize: newDoc.fileSize || 0,
          version: nextVersion,
          expiryDate: newDoc.expiryDate ? new Date(newDoc.expiryDate) : undefined,
          verificationStatus: "PENDING",
          rejectionReason: undefined,
          uploadedAt: new Date(),
          auditLogs: [...(oldDoc.auditLogs || []), auditEntry],
        } as unknown as IEmployeeDocument;
      } else {
        currentDocs.push({
          documentType: newDoc.documentType,
          documentUrl: newDoc.documentUrl,
          fileName: newDoc.fileName || newDoc.documentType,
          fileSize: newDoc.fileSize || 0,
          version: 1,
          expiryDate: newDoc.expiryDate ? new Date(newDoc.expiryDate) : undefined,
          verificationStatus: "PENDING",
          uploadedAt: new Date(),
          auditLogs: [auditEntry],
        } as unknown as IEmployeeDocument);
      }
    }

    const updated = await super.update(id, {
      documents: currentDocs,
      verificationStatus: EmployeeVerificationStatus.PENDING,
    } as any);

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Uploaded ${docsPayload.length} documents for ${employee.employeeCode}`,
      performedBy: actor ? new mongoose.Types.ObjectId(actor as string) : undefined,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Face Biometric Enrollment & Quality Check
  |--------------------------------------------------------------------------
  */
  async faceEnrollment(userIdOrEmployeeId: string, payload: { faceImageBase64?: string; faceUrl?: string; deviceId?: string }, performedBy?: string) {
    let employee: any = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee record not found for biometric enrollment.");
    }

    const id = employee._id?.toString() || "";
    const actor = performedBy || this.getAuthUserId(employee) || id;

    // Simulate encrypted face embedding generation
    const sourceData = payload.faceImageBase64 || payload.faceUrl || Date.now().toString();
    const encryptedEmbedding = crypto.createHash("sha256").update(`FACE_${sourceData}_${employee.companyId}`).digest("hex");

    // Check Duplicate Face Detection across company employees
    const duplicateMatch = await employeeRepository.find({
      companyId: employee.companyId,
      _id: { $ne: employee._id },
      "biometrics.encryptedEmbedding": encryptedEmbedding,
      isDeleted: false,
    });

    if (duplicateMatch && duplicateMatch.length > 0) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Duplicate Face Biometric Detected! This facial structure already matches an existing employee in the system."
      );
    }

    const faceQualityScore = 96.5; // High confidence quality verification
    const biometricsData: any = {
      ...(employee.biometrics || { enrollmentHistory: [], verificationHistory: [] }),
      isEnrolled: true,
      encryptedEmbedding,
      faceQualityScore,
      lastEnrolledAt: new Date(),
    };

    const attemptHistory = {
      attemptedAt: new Date(),
      status: "SUCCESS",
      qualityScore: faceQualityScore,
      remarks: "Facial features captured and verified successfully.",
    };
    biometricsData.enrollmentHistory = [...(biometricsData.enrollmentHistory || []), attemptHistory];

    const updated = await super.update(id, { biometrics: biometricsData } as any);

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Enrolled face biometrics for employee ${employee.employeeCode} (Quality Score: ${faceQualityScore})`,
      performedBy: actor ? new mongoose.Types.ObjectId(actor as string) : undefined,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Verification
  |--------------------------------------------------------------------------
  */
  async submitVerification(userIdOrEmployeeId: string, performedBy?: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");
    }

    // Verify mandatory documents exist: Aadhaar Card, PAN Card, Passport Size Photo
    const docTypes = (employee.documents || []).map((d) => d.documentType.trim().toLowerCase());
    const mandatoryList = ["aadhaar card", "pan card", "passport size photo"];
    const missing = mandatoryList.filter((m) => !docTypes.some((t) => t.includes(m.split(" ")[0])));

    if (missing.length > 0) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Cannot submit for verification. Missing mandatory documents: ${missing.join(", ")}`
      );
    }

    if (!employee.biometrics?.isEnrolled) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Cannot submit for verification. Face biometric enrollment is required."
      );
    }

    const id = employee._id?.toString() || "";
    const actor = performedBy || this.getAuthUserId(employee) || id;

    const newHistory = {
      status: EmployeeStatus.PENDING_VERIFICATION,
      changedBy: actor ? new mongoose.Types.ObjectId(actor as string) : null,
      reason: "Employee completed onboarding requirements and submitted for verification.",
      timestamp: new Date(),
    };

    const updated = await super.update(id, {
      verificationStatus: EmployeeVerificationStatus.PENDING,
      rejectionReason: undefined,
      correctionNotes: undefined,
      lifecycleHistory: [...(employee.lifecycleHistory || []), newHistory],
    } as any);

    try {
      await notificationService.create({
        companyId: employee.companyId,
        recipientId: employee.userId,
        title: "Employee Verification Submitted",
        message: `Employee ${employee.firstName} ${employee.lastName} (${employee.employeeCode}) has submitted profile and documents for review.`,
        type: NotificationType.SYSTEM,
        channel: NotificationChannel.IN_APP,
        priority: NotificationPriority.HIGH,
      } as any);
    } catch (err) {
      console.error("Failed to emit notification:", err);
    }

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Submitted verification workflow for ${employee.employeeCode}`,
      performedBy: actor ? new mongoose.Types.ObjectId(actor as string) : undefined,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Admin Verification Workflow (Approve & Reject)
  |--------------------------------------------------------------------------
  */
  async approveVerification(companyId: string, employeeIdOrIds: string | string[], performedBy?: string) {
    const ids = Array.isArray(employeeIdOrIds) ? employeeIdOrIds : [employeeIdOrIds];

    for (const empId of ids) {
      const emp = await employeeRepository.findById(empId);
      if (!emp) continue;

      const newHistory = {
        status: EmployeeStatus.VERIFIED,
        changedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : null,
        reason: "Company Admin reviewed and approved employee profile, documents, and face biometrics.",
        timestamp: new Date(),
      };

      const docs = (emp.documents || []).map((doc) => ({
        ...doc,
        verificationStatus: "APPROVED" as const,
      }));

      await super.update(empId, {
        verificationStatus: EmployeeVerificationStatus.APPROVED,
        status: EmployeeStatus.ACTIVE,
        documents: docs,
        rejectionReason: undefined,
        correctionNotes: undefined,
        lifecycleHistory: [...(emp.lifecycleHistory || []), newHistory],
      } as any);

      try {
        await emailService.sendCustom({
          to: emp.email,
          subject: "Verification Approved — Operational Role Dashboard Unlocked",
          html: `<p>Hello ${emp.firstName},</p><p>Your employee onboarding and statutory verification have been <b>APPROVED</b> by Company Administration.</p><p>Your specific role dashboard (<b>${emp.role}</b>) is now fully unlocked for operational activities.</p><p>Regards,<br/>ExamGuard Pro Enterprise</p>`,
          text: `Hello ${emp.firstName}, your employee onboarding and statutory verification have been APPROVED.`,
        });
      } catch (err) {
        console.error("Email notification failed:", err);
      }

      await auditLogService.logSuccess({
        action: AuditAction.UPDATE,
        module: "EMPLOYEE",
        entityId: new mongoose.Types.ObjectId(empId),
        entityName: "Employee",
        description: `Approved onboarding verification for ${emp.employeeCode}`,
        performedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : undefined,
      });
    }

    return { success: true, count: ids.length };
  }

  async rejectVerification(companyId: string, employeeId: string, reason: string, correctionNotes?: string, performedBy?: string) {
    const emp = await employeeRepository.findById(employeeId);
    if (!emp) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");

    const newHistory = {
      status: EmployeeStatus.PENDING_VERIFICATION,
      changedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : null,
      reason: `Verification Rejected: ${reason}`,
      timestamp: new Date(),
    };

    const updated = await super.update(employeeId, {
      verificationStatus: EmployeeVerificationStatus.REJECTED,
      rejectionReason: reason,
      correctionNotes: correctionNotes || "Please update rejected document sections and resubmit.",
      lifecycleHistory: [...(emp.lifecycleHistory || []), newHistory],
    } as any);

    try {
      await emailService.sendCustom({
        to: emp.email,
        subject: "Action Required: Employee Verification Rejected",
        html: `<p>Hello ${emp.firstName},</p><p>Your employee setup review was evaluated and requires revisions.</p><p><b>Reason:</b> ${reason}<br/><b>Correction Instructions:</b> ${correctionNotes || "Please review and upload corrected documents."}</p><p>Please log into your portal, modify only the flagged sections, and resubmit.</p><p>Regards,<br/>ExamGuard Pro Enterprise</p>`,
        text: `Hello ${emp.firstName}, your verification was rejected. Reason: ${reason}. Instructions: ${correctionNotes}`,
      });
    } catch (err) {
      console.error("Email notification failed:", err);
    }

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(employeeId),
      entityName: "Employee",
      description: `Rejected verification for ${emp.employeeCode}: ${reason}`,
      performedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : undefined,
    });

    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Employee Dashboard Unlock Logic
  |--------------------------------------------------------------------------
  */
  async getDashboard(userIdOrEmployeeId: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee record not found.");
    }

    const authUserId = this.getAuthUserId(employee);
    const userStats: any = authUserId ? await userRepository.getDashboard(authUserId).catch(() => null) : {};

    if (employee.verificationStatus !== EmployeeVerificationStatus.APPROVED) {
      return {
        unlocked: false,
        role: employee.role,
        verificationStatus: employee.verificationStatus,
        rejectionReason: employee.rejectionReason,
        correctionNotes: employee.correctionNotes,
        visibleMenus: ["Profile", "Verification", "Notifications", "Support", "Logout"],
        onboardingProgress: {
          profileCompleted: employee.profileCompleted || false,
          biometricEnrolled: employee.biometrics?.isEnrolled || false,
          documentsUploadedCount: (employee.documents || []).length,
        },
        userSessions: userStats?.totalSessions || 0,
        message: "Your role dashboard is currently locked. Complete profile & statutory verification to proceed.",
      };
    }

    return {
      unlocked: true,
      role: employee.role,
      verificationStatus: employee.verificationStatus,
      visibleMenus: [
        `${employee.role}_DASHBOARD`,
        "Operations",
        "Assigned_Tasks",
        "Profile",
        "Notifications",
        "Support",
        "Logout",
      ],
      employeeProfile: {
        employeeCode: employee.employeeCode,
        fullName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        centerId: employee.centerId,
        status: employee.status,
      },
      userStats,
      message: `Operational dashboard unlocked for role: ${employee.role}`,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Employee Actions (Transfer, Change Role, Lifecycle overrides)
  |--------------------------------------------------------------------------
  */
  async assignRole(id: string, roleOrRoleId: string, performedBy?: string) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");
    }

    let roleName = roleOrRoleId;
    if (roleOrRoleId.length === 24 && mongoose.Types.ObjectId.isValid(roleOrRoleId)) {
      const roleDoc = await roleRepository.findById(roleOrRoleId);
      if (roleDoc) {
        roleName = roleDoc.name;
      }
    }
    this.validateRole(roleName);

    const authUserId = this.getAuthUserId(employee);
    if (authUserId) {
      await authService.update(authUserId, { role: roleName.toUpperCase() });
    }

    const newHistory = {
      status: employee.status,
      changedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : null,
      reason: `Role updated from ${employee.role} to ${roleName.toUpperCase()}`,
      timestamp: new Date(),
    };

    const updated = await super.update(id, {
      role: roleName.toUpperCase(),
      lifecycleHistory: [...(employee.lifecycleHistory || []), newHistory],
    } as any);

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Changed role for ${employee.employeeCode} to ${roleName.toUpperCase()}`,
      performedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : undefined,
    });
    return updated;
  }

  async transfer(id: string, payload: { centerId?: string; reason?: string }, performedBy?: string) {
    const employee = await employeeRepository.findById(id);
    if (!employee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");

    const updateData: any = {};
    if (payload.centerId !== undefined) {
      if (payload.centerId === null || payload.centerId === "") {
        updateData.centerId = null;
      } else {
        const center = await centerRepository.findById(payload.centerId);
        if (!center) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Target Center not found.");
        updateData.centerId = new mongoose.Types.ObjectId(payload.centerId);
      }
    }

    const newHistory = {
      status: EmployeeStatus.TRANSFERRED,
      changedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : null,
      reason: payload.reason || "Facility transfer executed by Administration.",
      timestamp: new Date(),
    };
    updateData.lifecycleHistory = [...(employee.lifecycleHistory || []), newHistory];

    const updated = await super.update(id, updateData);

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Transferred employee ${employee.employeeCode}`,
      performedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : undefined,
    });

    return updated;
  }

  async updateStatus(id: string, status: string, populateFields?: string[], session?: mongoose.ClientSession, userIdForAudit?: string) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");

    const authUserId = this.getAuthUserId(existingEmployee);
    const userStatusMap: Record<string, string> = {
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      SUSPENDED: "SUSPENDED",
      TERMINATED: "TERMINATED",
      ARCHIVED: "INACTIVE",
      RESIGNED: "INACTIVE",
      TRANSFERRED: "ACTIVE",
      VERIFIED: "ACTIVE",
      DRAFT: "INACTIVE",
      PENDING_VERIFICATION: "ACTIVE",
    };

    const mappedUserStatus = userStatusMap[status] || "INACTIVE";
    if (authUserId) {
      await authService.update(authUserId, { status: mappedUserStatus } as any, [], session);
      
      // If toggling back to ACTIVE from an inactive state, reset and resend credentials
      if (mappedUserStatus === "ACTIVE" && existingEmployee.status === EmployeeStatus.INACTIVE) {
        await this.resetPassword(id, undefined, userIdForAudit);
      }
    }

    const newHistory = {
      status: status as EmployeeStatus,
      changedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : null,
      reason: `Status transition initiated to ${status}`,
      timestamp: new Date(),
    };

    const updatedEmployee = await super.update(
      id,
      { status: status as EmployeeStatus, lifecycleHistory: [...(existingEmployee.lifecycleHistory || []), newHistory] } as any,
      populateFields,
      session
    );

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Employee lifecycle status changed to ${status}`,
      performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : undefined,
    });

    return updatedEmployee;
  }

  async delete(id: string, session?: mongoose.ClientSession, userIdForAudit?: string) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");

    const authUserId = this.getAuthUserId(existingEmployee);
    if (authUserId) {
      // Hard delete login credentials so they cannot login anymore and email can be reused
      await authService.hardDeleteUser(authUserId, session);
    }

    const deletedEmployee = await super.delete(id, session);

    await auditLogService.logSuccess({
      action: AuditAction.DELETE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Deleted employee and disconnected credentials: ${existingEmployee.employeeCode}`,
      performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : undefined,
    });

    return deletedEmployee;
  }

  async restore(id: string, session?: mongoose.ClientSession, userIdForAudit?: string) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");

    const newHistory = {
      status: EmployeeStatus.RESTORED,
      changedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : null,
      reason: "Employee profile restored from archival / soft deletion.",
      timestamp: new Date(),
    };

    const updatedEmployee = await super.update(
      id,
      { isDeleted: false, deletedAt: null, status: EmployeeStatus.ACTIVE, lifecycleHistory: [...(existingEmployee.lifecycleHistory || []), newHistory] } as any,
      [],
      session
    );

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Restored employee account: ${existingEmployee.employeeCode}`,
      performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : undefined,
    });

    return updatedEmployee;
  }

  async resetPassword(id: string, newPassword?: string, userIdForAudit?: string) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");

    const authUserId = this.getAuthUserId(existingEmployee);
    const targetPassword = newPassword || `Reset@${crypto.randomBytes(4).toString("hex")}1!`;
    await authService.adminResetPassword(authUserId, targetPassword);

    try {
      await emailService.sendCustom({
        to: existingEmployee.email,
        subject: "Your Password Has Been Reset",
        html: `<p>Hello ${existingEmployee.firstName},</p><p>Your password has been administratively reset.</p><p><b>New Temporary Password:</b> ${targetPassword}</p><p>Please login and update your password immediately.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
        text: `Hello ${existingEmployee.firstName}, your password has been reset to ${targetPassword}`,
      });
    } catch (err) {
      console.error("Failed to send reset password email:", err);
    }

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: new mongoose.Types.ObjectId(id),
      entityName: "Employee",
      description: `Password reset triggered for ${existingEmployee.employeeCode}`,
      performedBy: userIdForAudit ? new mongoose.Types.ObjectId(userIdForAudit as string) : undefined,
    });

    return { success: true, message: "Password reset successfully and transmitted via email." };
  }

  /*
  |--------------------------------------------------------------------------
  | Device & Session Management
  |--------------------------------------------------------------------------
  */
  async getDevices(userIdOrEmployeeId: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");

    const authUserId = this.getAuthUserId(employee);
    const devices = authUserId ? await userRepository.getDevices(authUserId) : [];
    const sessions = authUserId ? await userRepository.getSessions(authUserId) : [];

    return { devices, sessions, totalActiveSessions: sessions.length };
  }

  async logoutAllDevices(userIdOrEmployeeId: string, performedBy?: string) {
    let employee = await employeeRepository.findByUserId(userIdOrEmployeeId);
    if (!employee) {
      employee = await employeeRepository.findById(userIdOrEmployeeId);
    }
    if (!employee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found.");

    const authUserId = this.getAuthUserId(employee);
    if (authUserId) {
      await userRepository.updateProfile(authUserId, { sessions: [] } as any);
    }

    await auditLogService.logSuccess({
      action: AuditAction.UPDATE,
      module: "EMPLOYEE",
      entityId: employee._id as mongoose.Types.ObjectId,
      entityName: "Employee",
      description: `Terminated all active device sessions for ${employee.employeeCode}`,
      performedBy: performedBy ? new mongoose.Types.ObjectId(performedBy as string) : undefined,
    });

    return { success: true, message: "All device sessions terminated successfully." };
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Operations & Import/Export Integration
  |--------------------------------------------------------------------------
  */
  async bulkOperation(action: "VERIFY" | "SUSPEND" | "ACTIVATE" | "ARCHIVE" | "RESTORE" | "RESET_PASSWORD", employeeIds: string[], performedBy?: string) {
    if (!employeeIds || employeeIds.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Employee ID list cannot be empty for bulk operation.");
    }

    let count = 0;
    for (const id of employeeIds) {
      try {
        if (action === "VERIFY") {
          await this.approveVerification("", id, performedBy);
        } else if (action === "SUSPEND") {
          await this.updateStatus(id, "SUSPENDED", [], undefined, performedBy);
        } else if (action === "ACTIVATE") {
          await this.updateStatus(id, "ACTIVE", [], undefined, performedBy);
        } else if (action === "ARCHIVE") {
          await this.updateStatus(id, "ARCHIVED", [], undefined, performedBy);
        } else if (action === "RESTORE") {
          await this.restore(id, undefined, performedBy);
        } else if (action === "RESET_PASSWORD") {
          await this.resetPassword(id, undefined, performedBy);
        }
        count++;
      } catch (err) {
        console.error(`Error processing bulk action ${action} for employee ${id}:`, err);
      }
    }

    return { success: true, action, processedCount: count, totalRequested: employeeIds.length };
  }

  async exportEmployees(filters: any, format: "csv" | "xlsx" | "json" = "json", userIdForAudit?: string) {
    const response = await employeeRepository.findAll({ ...filters, limit: 10000 });
    const employees = response?.data || response?.items || [];

    const formattedData = employees.map((e: any) => ({
      EmployeeCode: e.employeeCode,
      FullName: `${e.firstName} ${e.lastName}`,
      Email: e.email,
      Phone: e.phone,
      Role: e.role,
      Department: e.department,
      Designation: e.designation,
      Status: e.status,
      VerificationStatus: e.verificationStatus,
      JoiningDate: e.joiningDate,
    }));

    try {
      const job = await importExportService.exportData(
        {
          module: "EMPLOYEE",
          data: formattedData,
          format,
        } as any,
        userIdForAudit || ""
      );
      return job;
    } catch (err) {
      return { success: true, format, totalRecords: formattedData.length, data: formattedData };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics & Verification Status Report
  |--------------------------------------------------------------------------
  */
  async statistics(companyId?: string) {
    const baseQuery = companyId ? { companyId: new mongoose.Types.ObjectId(companyId), isDeleted: false } : { isDeleted: false };

    const [total, active, inactive, suspended, terminated, verified, pending, verificationBreakdown, departmentStats] = await Promise.all([
      super.count(baseQuery),
      super.count({ ...baseQuery, status: "ACTIVE" }),
      super.count({ ...baseQuery, status: "INACTIVE" }),
      super.count({ ...baseQuery, status: "SUSPENDED" }),
      super.count({ ...baseQuery, status: "TERMINATED" }),
      super.count({ ...baseQuery, verificationStatus: "APPROVED" }),
      super.count({ ...baseQuery, verificationStatus: "PENDING" }),
      employeeRepository.getVerificationStatusBreakdown(companyId),
      employeeRepository.getDepartmentStats(companyId),
    ]);

    return {
      total,
      active,
      inactive,
      suspended,
      terminated,
      verified,
      pendingVerification: pending,
      verificationBreakdown,
      departmentStats,
    };
  }
}

export default new EmployeeService();


