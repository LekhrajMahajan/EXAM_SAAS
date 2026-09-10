import { Request, Response } from "express";
import nodemailer from "nodemailer";

import centerService from "./center.service";
import centerRepository from "./center.repository";
import CenterOnboarding from "./centerOnboarding.model";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import ApiError from "../../utils/ApiError";
import Company from "../company/company.model";
import Center from "./center.model";
import fileStorageService from "../file-storage/fileStorage.service";

export const getCenterMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;
  if (!user.centerId) {
    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "No center assigned to this user",
      data: null,
    });
  }

  const center = await Center.findById(user.centerId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center fetched successfully",
    data: center,
  });
});

export const updateUpiId = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { upiId } = req.body;
  
  if (!user.centerId) {
    return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
      success: false,
      message: "Only Center Managers can update their UPI ID",
    });
  }

  const center = await Center.findById(user.centerId);
  if (!center) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Center not found",
    });
  }

  center.upiId = upiId;
  await center.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "UPI ID updated successfully",
    data: { upiId: center.upiId },
  });
});
import { FileType } from "../file-storage/fileStorage.types";
import path from "path";
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Test SMTP Email Endpoint
| GET /centers/test-email?to=xyz@gmail.com
|--------------------------------------------------------------------------
*/
export const testSmtpEmail = asyncHandler(async (req: Request, res: Response) => {
  const toEmail = (req.query.to as string) || process.env.SMTP_USER || "";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  const config = {
    host: smtpHost || "NOT SET",
    port: smtpPort,
    user: smtpUser || "NOT SET",
    passLength: smtpPass ? smtpPass.length : 0,
    passHasSpaces: smtpPass ? smtpPass.includes(" ") : false,
    toEmail,
  };

  console.log("[TestSMTP] Config:", config);

  if (!smtpHost || !smtpUser || !smtpPass) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "SMTP not configured in .env",
      data: config,
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.verify();
    console.log("[TestSMTP] ✅ SMTP connection verified");
  } catch (verifyErr: any) {
    console.error("[TestSMTP] ❌ SMTP verify failed:", verifyErr.message);
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      success: false,
      message: "SMTP connection failed: " + verifyErr.message,
      data: config,
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `"ExamGuard Pro" <${smtpUser}>`,
      to: toEmail,
      subject: "TEST: Center Manager Credentials - ExamGuard Pro",
      html: `<div style="font-family:Arial;padding:20px;border:1px solid #d1fae5;border-radius:8px"><h2 style="color:#059669">ExamGuard Pro SMTP Test</h2><p>✅ SMTP is working correctly!</p><p><b>Email:</b> ${toEmail}</p><p><b>Sample Password:</b> <code style="background:#d1fae5;padding:4px 8px;border-radius:4px">Ctr@ab12cd34B2!</code></p><p><b>Role:</b> CENTER_MANAGER</p><p style="color:#6b7280;font-size:11px">Sent: ${new Date().toISOString()}</p></div>`,
      priority: "high",
    });
    console.log("[TestSMTP] ✅ Test email sent to:", toEmail, "MessageId:", info.messageId);
    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Test email successfully sent to ${toEmail}`,
      data: { messageId: info.messageId, config },
    });
  } catch (sendErr: any) {
    console.error("[TestSMTP] ❌ Send failed:", sendErr.message);
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      success: false,
      message: "Email send failed: " + sendErr.message,
      data: config,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Test DB Endpoint (Debug Center Creation)
| GET /centers/test-db
|--------------------------------------------------------------------------
*/
export const testDb = asyncHandler(async (req: Request, res: Response) => {
  const Center = require("./center.model").default;
  const User = require("../auth/user.model").default;
  
  const latestCenter = await Center.findOne().sort({ createdAt: -1 });
  let manager = null;

  if (latestCenter && latestCenter.centerManagerId) {
    manager = await User.findById(latestCenter.centerManagerId);
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Latest center fetched.",
    data: {
      latestCenter: latestCenter ? {
        id: latestCenter._id,
        name: latestCenter.centerName,
        email: latestCenter.email,
        managerId: latestCenter.centerManagerId,
        createdAt: latestCenter.createdAt
      } : null,
      managerUser: manager ? {
        id: manager._id,
        email: manager.email,
        role: manager.role
      } : null
    }
  });
});

/*
|--------------------------------------------------------------------------
| Test Validation Endpoint
| GET /centers/test-validation
|--------------------------------------------------------------------------
*/
export const testValidation = asyncHandler(async (req: Request, res: Response) => {
  const { createCenterSchema } = require("./center.validation");
  
  const mockFrontendData = {
    centerName: "Test Email Center 999",
    centerCode: "TEC-999",
    branch: "65a000000000000000000001",
    centerType: "Standard Center",
    state: "Delhi",
    city: "Delhi",
    address: "123 Test Street",
    pincode: "110001",
    headName: "Test Manager",
    headEmail: "lekhrajmahajan84@gmail.com",
    headMobile: "9876543210",
    maxCandidates: 100,
    maxRooms: 5,
    maxSystems: 100,
    status: "Active"
  };

  const payload = {
    ...mockFrontendData,
    capacity: Number(mockFrontendData.maxCandidates) || 100,
    availableCapacity: Number(mockFrontendData.maxCandidates) || 100,
    managerName: mockFrontendData.headName,
    email: mockFrontendData.headEmail,
    phone: mockFrontendData.headMobile,
    country: "India",
    centerType: "PRIVATE",
    centerCategory: mockFrontendData.centerType,
    displayCenterType: mockFrontendData.centerType,
    status: mockFrontendData.status === "Inactive" ? "INACTIVE" : "ACTIVE",
    totalLabs: Number(mockFrontendData.maxRooms) || 5,
    totalSystems: Number(mockFrontendData.maxSystems) || 100,
    shifts: [],
    shiftRates: [],
    facilities: [],
    companyId: "65a000000000000000000000" // mock
  };

  try {
    const result = createCenterSchema.parse({ body: payload });
    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Validation SUCCESS",
      data: result
    });
  } catch (err: any) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Validation FAILED",
      data: err.issues
    });
  }
});

/*
|--------------------------------------------------------------------------
| Test Create Mock Endpoint
| GET /centers/test-create-mock
|--------------------------------------------------------------------------
*/
export const testCreateMock = asyncHandler(async (req: any, res: Response) => {
  const payload = {
    centerName: "Test Email Center 999",
    centerCode: "TEC-999",
    capacity: 100,
    availableCapacity: 100,
    managerName: "Test Manager",
    email: "lekhrajmahajan84@gmail.com",
    phone: "9876543210",
    country: "India",
    centerType: "PRIVATE",
    centerCategory: "Standard Center",
    displayCenterType: "Standard Center",
    status: "ACTIVE",
    totalLabs: 5,
    totalSystems: 100,
    shifts: [],
    shiftRates: [],
    facilities: [],
    // Usually companyId is injected by req.user.companyId
    companyId: req.user?.companyId || "65a000000000000000000000"
  };

  try {
    const result = await centerService.create(payload as any);
    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Center created successfully via mock test.",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Center creation failed in service layer",
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Create Center
|--------------------------------------------------------------------------
*/

export const createCenter = asyncHandler(
  async (req: any, res: Response) => {
    // 1. Ensure companyId
    if (!req.body.companyId) {
      if (req.user?.companyId) {
        req.body.companyId = req.user.companyId;
      } else {
        const firstCompany = await Company.findOne({ status: true });
        if (firstCompany) req.body.companyId = firstCompany._id.toString();
      }
    }

    // 2. ── GLOBAL DUPLICATE DETECTION ──────────────────────────────────────────
    // Check if a center with same email OR centerName already exists in the ENTIRE
    // system (across all companies). If yes → send a CompanyAdminRequest instead
    // of creating a new center.
    const headEmail = req.body.email || req.body.headEmail;
    const centerName = req.body.centerName;

    if (headEmail || centerName) {
      const globalDuplicateQuery: any = { isDeleted: { $ne: true } };
      if (headEmail) globalDuplicateQuery.email = headEmail;

      let existingCenter = await Center.findOne(globalDuplicateQuery).lean();

      // If not found by email, try by center name (case-insensitive)
      if (!existingCenter && centerName) {
        existingCenter = await Center.findOne({
          centerName: { $regex: new RegExp(`^${centerName.trim()}$`, "i") },
          isDeleted: { $ne: true },
        }).lean() as any;
      }

      if (existingCenter) {
        // ── Existing center found → create a CompanyAdminRequest ──────────────
        console.log(`[createCenter] 🔄 Center already exists globally (id: ${(existingCenter as any)._id}). Creating CompanyAdminRequest.`);

        const companyAdminRequestService = require("./companyAdminRequest.service").default;
        const companyId = req.body.companyId;
        const companyAdminId = req.user?._id || req.user?.id;

        // Build shiftRates from the wizard data
        let rawShiftRates = req.body.shiftRates || req.body.shifts || [];
        const shiftRates = rawShiftRates.map((s: any) => {
          if (typeof s === 'string') {
            return { shiftName: s, pricePerCandidate: 250, candidateCapacity: 100, maximumCapacity: 100 };
          }
          return {
            shiftName: s.shiftName || s.name || "Standard Shift",
            pricePerCandidate: Number(s.pricePerCandidate || s.price) || 250,
            candidateCapacity: Number(s.candidateCapacity) || Number(req.body.capacity) || Number(req.body.maxCandidates) || 100,
            maximumCapacity: Number(s.maximumCapacity) || Number(req.body.capacity) || Number(req.body.maxCandidates) || 100,
            timings: s.timings || "",
            specialNotes: s.specialNotes || "",
          };
        });
        const mouFileUrl = req.body.mouFileUrl || "";
        const mouFileName = req.body.mouFileName || "";

        try {
          const adminRequest = await companyAdminRequestService.createRequest({
            companyId,
            companyAdminId,
            centerId: (existingCenter as any)._id.toString(),
            shiftRates,
            mouFileUrl,
            mouFileName,
          });

          return sendResponse(res, 202, {
            success: true,
            message: `Center "${(existingCenter as any).centerName}" already exists in the system. A connection request has been sent to the center manager. They will upload the required documents for your review.`,
            data: {
              existingCenter: true,
              requestId: adminRequest._id,
              centerId: (existingCenter as any)._id,
              centerName: (existingCenter as any).centerName,
              status: adminRequest.status,
            },
          });
        } catch (reqErr: any) {
          // If request already exists, still return a helpful message
          if (reqErr.statusCode === 409) {
            return sendResponse(res, HTTP_STATUS.CONFLICT, {
              success: false,
              message: "You already have a pending request for this center. Please check your Center Requests section.",
              data: {
                existingCenter: true,
                centerId: (existingCenter as any)._id,
                centerName: (existingCenter as any).centerName,
              },
            });
          }
          throw reqErr;
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // 3. Ensure unique centerCode within company to prevent E11000 errors
    let codeExists = await Center.findOne({ 
      companyId: req.body.companyId, 
      centerCode: req.body.centerCode 
    });
    if (codeExists) {
      req.body.centerCode = `${req.body.centerCode}-${Math.floor(Math.random() * 1000)}`;
    }

    // DEBUG: Log exactly what fields are being received
    console.log("==========================================");
    console.log("CENTER CREATE PAYLOAD RECEIVED:", JSON.stringify(req.body, null, 2));
    console.log("==========================================");

    const result = await centerService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Center created successfully.",
      data: { existingCenter: false, ...result },
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Credentials Email (Dynamic)
|--------------------------------------------------------------------------
*/
export const sendCredentialsEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, temporaryPassword, centerName, managerName } = req.body;
  const emailService = require("../email/email.service").default;
  
  if (email && temporaryPassword) {
    await emailService.send({
      to: email,
      subject: `Center Manager Login Credentials - ${centerName || 'Center'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #059669; margin-top: 0;">Welcome to ExamGuard Pro Enterprise</h2>
          <p>Hello <strong>${managerName || "Center Manager"}</strong>,</p>
          <p>A new examination center <strong>${centerName || 'Center'}</strong> has been registered, and your user profile has been provisioned as the designated Center Manager.</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Your Secure Login Credentials:</strong></p>
            <p style="margin: 5px 0;"><b>Official Email:</b> ${email}</p>
            <p style="margin: 5px 0;"><b>Temporary Password:</b> <code style="background: #d1fae5; padding: 2px 6px; border-radius: 4px; color: #065f46; font-weight: bold;">${temporaryPassword}</code></p>
            <p style="margin: 5px 0;"><b>Assigned Role:</b> CENTER_MANAGER</p>
            <p style="margin: 5px 0;"><b>Login Portal:</b> /auth/login</p>
          </div>
          <p style="color: #dc2626; font-weight: bold;">⚠️ Mandatory Security Compliance:</p>
          <p style="color: #4b5563;">Upon initial authentication, you must complete a forced password rotation. Furthermore, operational dashboard access is strictly locked until you complete all 8 stages of the <b>Center Setup & Verification Wizard</b> and obtain Company Admin verification.</p>
        </div>
      `,
    }).catch((e: any) => console.log("Failed to send credentials dynamically", e));
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Credentials emailed successfully.",
    data: null,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Centers
|--------------------------------------------------------------------------
*/

export const getCenters = asyncHandler(async (req: Request, res: Response) => {
  const queryCompanyId = req.user?.companyId ? (req.user.companyId as string) : (req.query.companyId as string);
  const result = await centerService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: queryCompanyId,
    city: req.query.city as string,
    state: req.query.state as string,
    centerType: req.query.centerType as string,
    status: req.query.status as string,
  });


  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Centers fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Center By Id
|--------------------------------------------------------------------------
*/

export const getCenterById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await centerService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Center
|--------------------------------------------------------------------------
*/

export const updateCenter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await centerService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Center Status
|--------------------------------------------------------------------------
*/

export const updateCenterStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await centerService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Center
|--------------------------------------------------------------------------
*/

export const deleteCenter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await centerService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Center
|--------------------------------------------------------------------------
*/

export const restoreCenter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await centerService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Center Statistics
|--------------------------------------------------------------------------
*/

export const getCenterStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.user?.companyId ? (req.user.companyId as string) : (req.query.companyId as string);
    const result = await centerService.statistics(companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.3: Center Onboarding & Verification Handlers
|--------------------------------------------------------------------------
*/

const resolveCenterId = async (req: any): Promise<string> => {
  if (req.query.centerId && typeof req.query.centerId === "string") {
    return req.query.centerId;
  }
  if (req.params.centerId && typeof req.params.centerId === "string") {
    return req.params.centerId;
  }
  if (req.user?.centerId) {
    return req.user.centerId.toString();
  }
  // Fallback: find center by manager email directly from DB (handles old tokens without centerId)
  if (req.user?.email) {
    const CenterModel = require("./center.model").default;
    const center = await CenterModel.findOne({ email: req.user.email }).select("_id").lean();
    if (center) {
      return center._id.toString();
    }
  }
  return req.params.id as string;
};

export const startOnboarding = asyncHandler(async (req: Request, res: Response) => {
  const centerId = await resolveCenterId(req);
  const center = await centerService.getById(centerId);
  const onboardingData: any = await CenterOnboarding.findOne({ centerId: center?._id }).lean() || {};
  const centerData = center && typeof (center as any).toObject === "function" ? (center as any).toObject() : (center || {});

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center onboarding setup started.",
    data: {
      ...centerData,
      documents: onboardingData.documents || [],
      commercialAgreement: onboardingData.commercialAgreement || [],
      agreementDetails: onboardingData.agreementDetails || {},
    },
  });
});

export const saveOnboardingAgreement = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Enterprise Client";
  const result = await centerService.saveOnboardingStep(centerId, 1, req.body, req.user, { ip: String(ip), userAgent });
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Onboarding agreement signed successfully.",
    data: result,
  });
});

export const saveOnboardingProfile = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 2, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center profile information saved successfully.",
    data: result,
  });
});

export const saveOnboardingDocuments = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 3, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center documents uploaded successfully.",
    data: result,
  });
});

export const saveOnboardingStaff = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 4, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center staff registered successfully.",
    data: result,
  });
});

export const saveOnboardingInfrastructure = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 5, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center infrastructure configured successfully.",
    data: result,
  });
});

export const saveOnboardingShiftPlanning = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 7, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shift planning and capacity allocations saved successfully.",
    data: result,
  });
});

export const saveOnboardingCompliance = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.saveOnboardingStep(centerId, 8, req.body, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center compliance testing recorded successfully.",
    data: result,
  });
});

export const submitOnboarding = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.submitForVerification(centerId, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center onboarding setup submitted for Company Admin verification.",
    data: result,
  });
});

export const getOnboardingStatus = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  if (!centerId) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found for this account.");
  }
  const center = await centerService.getById(centerId);
  if (!center) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found.");
  }
  const centerData = center && typeof center.toObject === "function" ? center.toObject() : (center || {});
  
  // Base onboarding data from CenterOnboarding (for the creator company)
  let onboardingData: any = await CenterOnboarding.findOne({ centerId: center._id }).lean() || {};
  
  // Data Privacy Filter:
  // If a Company Admin from a DIFFERENT company (via connection request) is viewing this,
  // we must return THEIR specific documents, not the original onboarding documents.
  if (req.user?.companyId && center.companyId && req.user.companyId.toString() !== center.companyId.toString()) {
    const CompanyAdminRequest = require("./companyAdminRequest.model").default;
    const adminRequest = await CompanyAdminRequest.findOne({
      companyId: req.user.companyId,
      centerId: center._id,
      status: "APPROVED" // Ensure they only see it if it's connected
    }).lean();

    if (adminRequest) {
      onboardingData.documents = adminRequest.documents || [];
      // Also override commercial agreements if they are company specific
      onboardingData.commercialAgreement = adminRequest.shiftRates || [];
      onboardingData.mouFileUrl = adminRequest.mouFileUrl || null;
    } else {
      // If no approved connection request, they shouldn't see any documents
      onboardingData.documents = [];
      onboardingData.commercialAgreement = [];
    }
  }
  // Calculate dynamic stats for this specific company + center
  let totalExamsAssigned = 0;
  let totalCandidatesScheduled = 0;
  
  if (req.user?.companyId && center._id) {
    try {
      const Exam = require("../exam/exam.model").default;
      const Candidate = require("../candidate/candidate.model").default;
      
      totalExamsAssigned = await Exam.countDocuments({ 
        companyId: req.user.companyId, 
        centerId: center._id 
      });
      
      totalCandidatesScheduled = await Candidate.countDocuments({ 
        companyId: req.user.companyId, 
        centerId: center._id 
      });
    } catch (err) {
      console.error("[getOnboardingStatus] Error calculating company stats:", err);
    }
  }
  
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center onboarding status fetched.",
    data: {
      ...centerData,
      setupStatus: center?.setupStatus || "DRAFT",
      setupCurrentStep: center?.setupCurrentStep || 1,
      completionPercentage: center?.completionPercentage || 0,
      readinessScore: center?.readinessScore || 0,
      complianceScore: center?.complianceScore || 0,
      adminReviewRemarks: onboardingData.adminReviewRemarks || center?.adminReviewRemarks || "",
      documents: onboardingData?.documents?.length ? onboardingData.documents : (center?.documents || []),
      commercialAgreement: onboardingData?.commercialAgreement?.length ? onboardingData.commercialAgreement : (center?.commercialAgreement || []),
      agreementDetails: onboardingData.agreementDetails || {},
      mouFileUrl: onboardingData.mouFileUrl || center?.mouFileUrl || null,
      companyStats: {
        totalExamsAssigned,
        totalCandidatesScheduled
      }
    },
  });
});

export const getCenterDashboard = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const result = await centerService.getCenterDashboardStats(centerId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center dashboard metrics generated successfully.",
    data: result,
  });
});

export const getCenterReadiness = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const center: any = await centerService.getById(centerId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center readiness checklist fetched.",
    data: {
      readinessScore: center.readinessScore || 0,
      examReadiness: center.examReadiness || {},
      infrastructureCount: (center.infrastructureNodes || []).length,
    },
  });
});

export const getCenterCompliance = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const center: any = await centerService.getById(centerId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center compliance details fetched.",
    data: {
      complianceScore: center.complianceScore || 0,
      complianceChecklist: center.complianceChecklist || {},
      verificationStatus: center.setupStatus || "DRAFT",
    },
  });
});

export const getCommercialAgreement = asyncHandler(async (req: any, res: Response) => {
  const centerId = await resolveCenterId(req);
  const center: any = await centerService.getById(centerId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shift-wise commercial agreement fetched.",
    data: {
      mouPdfUrl: center.mouPdfUrl || "",
      commercialAgreement: center.commercialAgreement || [],
      agreementDetails: center.agreementDetails || null,
    },
  });
});

export const getPendingVerifications = asyncHandler(async (req: any, res: Response) => {
  const result = await centerService.getPendingVerifications(req.query.companyId as string);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Pending center verifications fetched successfully.",
    data: result,
  });
});

export const approveDocument = asyncHandler(async (req: any, res: Response) => {
  const centerId = req.query.centerId ? String(req.query.centerId) : await resolveCenterId(req);
  const result = await centerService.verifyDocument(centerId, req.params.id, "APPROVED" as any, undefined, undefined, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Document approved successfully.",
    data: result,
  });
});

export const rejectDocument = asyncHandler(async (req: any, res: Response) => {
  const centerId = req.query.centerId ? String(req.query.centerId) : await resolveCenterId(req);
  const { rejectionReason, correctionNotes } = req.body;
  const result = await centerService.verifyDocument(centerId, req.params.id, "REJECTED" as any, rejectionReason, correctionNotes, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Document rejected with feedback notes.",
    data: result,
  });
});

export const uploadMou = asyncHandler(async (req: any, res: Response) => {
  const file = req.file;

  if (!file) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "No file uploaded.",
    });
  }

  const ext = file.originalname ? path.extname(file.originalname).replace(".", "").toLowerCase() : "";

  const uploadedFile = await fileStorageService.upload({
    fileName: `mou_${Date.now()}_${file.originalname}`,
    originalName: file.originalname,
    extension: ext,
    mimeType: file.mimetype,
    fileType: FileType.DOCUMENT,
    uploadedBy: new mongoose.Types.ObjectId(req.user!.userId) as any,
  }, file);
  
  let fileUrl = (uploadedFile as any).url;
  if (fileUrl.startsWith('/')) {
    fileUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "MOU uploaded successfully.",
    data: { url: fileUrl },
  });
});


export const verifyCenterSetup = asyncHandler(async (req: any, res: Response) => {
  const centerId = req.params.id || req.body.centerId || await resolveCenterId(req);
  const { status, remarks } = req.body;
  const result = await centerService.verifyCenterSetup(centerId, status, remarks, req.user);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: `Center verification completed: ${status}`,
    data: result,
  });
});


export const updatePaymentDetails = asyncHandler(async (req: any, res: Response) => {
  const centerId = req.params.id || await resolveCenterId(req);
  const { paymentDetails } = req.body;

  if (!paymentDetails || !paymentDetails.mode) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Valid paymentDetails object with a 'mode' is required.",
    });
  }

  const updatedCenter = await centerService.update(centerId, { paymentDetails });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Payment details updated successfully.",
    data: updatedCenter,
  });
});
