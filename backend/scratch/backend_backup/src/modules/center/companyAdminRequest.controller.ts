import { Request, Response } from "express";
import companyAdminRequestService from "./companyAdminRequest.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import Center from "./center.model";
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Create a new Request (called automatically when center already exists)
| POST /api/v1/centers/admin-requests
|--------------------------------------------------------------------------
*/
export const createAdminRequest = asyncHandler(async (req: any, res: Response) => {
  const { centerId, shiftRates, mouFileUrl, mouFileName } = req.body;
  const companyId = req.body.companyId || req.user?.companyId;
  const companyAdminId = req.user?._id || req.user?.id || req.user?.userId;

  if (!centerId || !companyId || !companyAdminId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "centerId, companyId, and companyAdminId are required.",
    });
  }

  const request = await companyAdminRequestService.createRequest({
    companyId,
    companyAdminId,
    centerId,
    shiftRates,
    mouFileUrl,
    mouFileName,
  });

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Request sent to center manager successfully. They will upload the required documents.",
    data: request,
  });
});

/*
|--------------------------------------------------------------------------
| Get all requests for Center Manager's center
| GET /api/v1/centers/admin-requests/incoming
|--------------------------------------------------------------------------
*/
export const getIncomingRequests = asyncHandler(async (req: any, res: Response) => {
  const centerId = req.user?.centerId;

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Center ID not found in your token. Please re-login.",
    });
  }

  // --- Auto-seed creator company connection for backward compatibility ---
  try {
    const center = await Center.findById(centerId);
    if (center && (String(center.status) === "ACTIVE" || String(center.status) === "Active")) {
      const CompanyAdminRequest = require("./companyAdminRequest.model").default;
      const { CompanyAdminRequestStatus } = require("./companyAdminRequest.model");
      
      const existing = await CompanyAdminRequest.findOne({
        centerId: center._id,
        companyId: center.companyId
      });

      if (!existing) {
        const CenterOnboarding = require("./centerOnboarding.model").default;
        const onboardingRecord = await CenterOnboarding.findOne({ centerId: center._id }).lean();
        
        if (onboardingRecord) {
          const shiftRates = (onboardingRecord.commercialAgreement || []).map((ca: any) => ({
            shiftName: ca.shiftName || "Standard Shift",
            pricePerCandidate: ca.pricePerCandidate || 0,
            candidateCapacity: ca.candidateCapacity || 0,
            maximumCapacity: ca.maximumCapacity || 0,
            timings: "",
            specialNotes: ca.specialNotes || ""
          }));

          await CompanyAdminRequest.create({
            companyId: center.companyId,
            companyAdminId: req.user?._id || req.user?.id || req.user?.userId || center.companyId,
            centerId: center._id,
            status: CompanyAdminRequestStatus.APPROVED,
            shiftRates,
            documents: onboardingRecord.documents || [],
            mouFileUrl: (center as any).mouPdfUrl || "",
            mouFileName: (center as any).mouFileName || "",
            approvedAt: new Date()
          });
        }
      }
    }
  } catch (err) {
    console.error("[getIncomingRequests] Auto-seed error:", err);
  }
  // ------------------------------------------------------------------------

  let requests = await companyAdminRequestService.getRequestsForCenter(centerId.toString());

  // One-time auto-fix for old requests that have missing companyAdminId
  let needsRefetch = false;
  for (const req of requests) {
    if (!req.companyAdminId || !req.companyId) {
      let defaultUser = await mongoose.connection.collection('users').findOne({ role: 'COMPANY_ADMIN' });
      if (!defaultUser) {
        defaultUser = await mongoose.connection.collection('users').findOne({});
      }
      const defaultCompany = await mongoose.connection.collection('companies').findOne({});
      if (defaultUser && defaultCompany) {
        await mongoose.connection.collection('companyadminrequests').updateOne(
          { _id: req._id },
          { $set: { 
              companyAdminId: (req.companyAdminId && req.companyAdminId._id ? req.companyAdminId._id : req.companyAdminId) || defaultUser._id,
              companyId: (req.companyId && req.companyId._id ? req.companyId._id : req.companyId) || defaultCompany._id
            } 
          }
        );
        needsRefetch = true;
      }
    }
  }

  if (needsRefetch) {
    requests = await companyAdminRequestService.getRequestsForCenter(centerId.toString());
  }

  console.log("getIncomingRequests response:", JSON.stringify(requests, null, 2));

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Incoming requests fetched successfully.",
    data: requests,
  });
});

/*
|--------------------------------------------------------------------------
| Get all requests sent by this Company (Company Admin view)
| GET /api/v1/centers/admin-requests/outgoing
|--------------------------------------------------------------------------
*/
export const getOutgoingRequests = asyncHandler(async (req: any, res: Response) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Company ID not found in your token. Please re-login.",
    });
  }

  const requests = await companyAdminRequestService.getRequestsByCompany(companyId.toString());

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Outgoing requests fetched successfully.",
    data: requests,
  });
});

/*
|--------------------------------------------------------------------------
| Get a single request by ID (full detail for modal/view)
| GET /api/v1/centers/admin-requests/:id
|--------------------------------------------------------------------------
*/
export const getRequestById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const request = await companyAdminRequestService.getRequestById(id);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Request fetched successfully.",
    data: request,
  });
});

/*
|--------------------------------------------------------------------------
| Center Manager uploads documents for a request
| PUT /api/v1/centers/admin-requests/:id/upload-documents
|--------------------------------------------------------------------------
*/
export const uploadRequestDocuments = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const centerId = req.user?.centerId;
  const { documents } = req.body;

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Center ID not found in your token.",
    });
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Please provide at least one document to upload.",
    });
  }

  const updated = await companyAdminRequestService.uploadDocuments(
    id,
    centerId.toString(),
    documents
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Documents uploaded successfully. Company admin will review them shortly.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Company Admin approves a single document
| PATCH /api/v1/centers/admin-requests/:id/documents/:docId/approve
|--------------------------------------------------------------------------
*/
export const approveRequestDocument = asyncHandler(async (req: any, res: Response) => {
  const { id, docId } = req.params;
  const companyId = req.user?.companyId;

  const updated = await companyAdminRequestService.approveDocument(id, companyId.toString(), docId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Document approved successfully.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Company Admin rejects a single document
| PATCH /api/v1/centers/admin-requests/:id/documents/:docId/reject
|--------------------------------------------------------------------------
*/
export const rejectRequestDocument = asyncHandler(async (req: any, res: Response) => {
  const { id, docId } = req.params;
  const companyId = req.user?.companyId;
  const { rejectionReason, adminRejectRemarks } = req.body;

  if (!rejectionReason) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Rejection reason is required.",
    });
  }

  const updated = await companyAdminRequestService.rejectDocument(
    id,
    companyId.toString(),
    docId,
    rejectionReason,
    adminRejectRemarks
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Document rejected. Center manager has been notified to re-upload.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Company Admin fully approves the entire request
| PATCH /api/v1/centers/admin-requests/:id/approve
|--------------------------------------------------------------------------
*/
export const approveFullRequest = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const companyId = req.user?.companyId;

  const updated = await companyAdminRequestService.approveRequest(id, companyId.toString());

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Request approved! Center is now connected with your company. Email sent to center manager.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Company Admin permanently rejects the entire request
| PATCH /api/v1/centers/admin-requests/:id/reject
|--------------------------------------------------------------------------
*/
export const rejectFullRequest = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const companyId = req.user?.companyId;
  const { remarks } = req.body;

  const updated = await companyAdminRequestService.rejectRequest(
    id,
    companyId.toString(),
    remarks || "Request declined."
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Request rejected. Center manager has been notified.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Find existing center by email or name (for Company Admin detection check)
| GET /api/v1/centers/admin-requests/find-existing?email=x&centerName=y
|--------------------------------------------------------------------------
*/
export const findExistingCenter = asyncHandler(async (req: any, res: Response) => {
  const { email, centerName } = req.query;

  if (!email && !centerName) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Provide email or centerName to search.",
    });
  }

  const query: any = { isDeleted: { $ne: true } };
  if (email) query.email = email;
  else if (centerName) query.centerName = { $regex: new RegExp(`^${centerName}$`, "i") };


  const center = await Center.findOne(query)
    .select("_id centerName email phone city state managerName centerCode")
    .lean();

  if (!center) {
    return sendResponse(res, HTTP_STATUS.OK, {
      success: false,
      message: "No existing center found. You can create a new one.",
      data: null,
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Existing center found. A request will be sent to this center.",
    data: center,
  });
});
