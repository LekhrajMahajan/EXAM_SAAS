import { Types } from "mongoose";
import CompanyAdminRequest, {
  CompanyAdminRequestStatus,
  ICompanyAdminRequest,
} from "./companyAdminRequest.model";
import Center from "./center.model";
import Admin from "../admin/admin.model";
import Company from "../company/company.model";
import emailService from "../email/email.service";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { DocumentApprovalStatus } from "./center.types";

class CompanyAdminRequestService {
  /*
  |--------------------------------------------------------------------------
  | Create a new request (triggered when a Company Admin tries to create a
  | center that already exists by email or name in the global DB)
  |--------------------------------------------------------------------------
  */
  async createRequest(payload: {
    companyId: string;
    companyAdminId: string;
    centerId: string;
    shiftRates?: any[];
    mouFileUrl?: string;
    mouFileName?: string;
  }) {
    const {
      companyId,
      companyAdminId,
      centerId,
      shiftRates,
      mouFileUrl,
      mouFileName,
    } = payload;

    // Check for existing active request
    const existingRequest = await CompanyAdminRequest.findOne({
      companyId: new Types.ObjectId(companyId),
      centerId: new Types.ObjectId(centerId),
      status: {
        $nin: [
          CompanyAdminRequestStatus.APPROVED,
          CompanyAdminRequestStatus.REJECTED,
        ],
      },
    });

    if (existingRequest) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A pending request already exists for this center from your company.",
      );
    }

    // Build required document checklist (same as onboarding docs)
    const requiredDocuments = [
      {
        documentType: "Signed MOU",
        isMandatory: true,
        fileName: "Pending Upload",
        fileUrl: "",
        version: 1,
        status: "PENDING" as const,
      },
      {
        documentType: "PAN Card",
        isMandatory: true,
        fileName: "Pending Upload",
        fileUrl: "",
        version: 1,
        status: "PENDING" as const,
      },
      {
        documentType: "GST Certificate",
        isMandatory: true,
        fileName: "Pending Upload",
        fileUrl: "",
        version: 1,
        status: "PENDING" as const,
      },
      {
        documentType: "Aadhaar Card",
        isMandatory: true,
        fileName: "Pending Upload",
        fileUrl: "",
        version: 1,
        status: "PENDING" as const,
      },
      {
        documentType: "Cancelled Cheque",
        isMandatory: true,
        fileName: "Pending Upload",
        fileUrl: "",
        version: 1,
        status: "PENDING" as const,
      },
    ];

    const request = await CompanyAdminRequest.create({
      companyId: new Types.ObjectId(companyId),
      companyAdminId: new Types.ObjectId(companyAdminId),
      centerId: new Types.ObjectId(centerId),
      shiftRates: shiftRates || [],
      mouFileUrl: mouFileUrl || "",
      mouFileName: mouFileName || "",
      documents: requiredDocuments,
      status: CompanyAdminRequestStatus.PENDING,
    });

    // Notify Center Manager via email
    const center: any = await Center.findById(centerId).lean();
    const adminUser: any = await Admin.findById(companyAdminId).lean();
    const company: any = await Company.findById(companyId).lean();

    if (center?.email) {
      await emailService
        .send({
          to: center.email,
          subject: `New Company Admin Connection Request - ${company?.companyName || "A Company"}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #059669; margin-top: 0;">New Connection Request</h2>
            <p>Hello <strong>${center.managerName || "Center Manager"}</strong>,</p>
            <p>A Company Admin from <strong>${company?.companyName || "a Company"}</strong> wants to assign your center for their examination.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Request Details:</strong></p>
              <p style="margin: 4px 0;"><b>Company Admin Name:</b> ${adminUser?.firstName || ""} ${adminUser?.lastName || ""}</p>
              <p style="margin: 4px 0;"><b>Company Admin Email:</b> ${adminUser?.email || ""}</p>
              <p style="margin: 4px 0;"><b>Company:</b> ${company?.companyName || "N/A"}</p>
            </div>
            <p>Please log in to your dashboard, go to <b>"Company Admin Request"</b> in the sidebar, and upload the required documents.</p>
            <p style="color: #6b7280; font-size: 12px;">ExamGuard Pro | Automated Notification</p>
          </div>
        `,
        })
        .catch((err: any) =>
          console.error(
            "[CompanyAdminRequestService] Email notification failed:",
            err,
          ),
        );
    }

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Get all incoming requests for a Center Manager
  |--------------------------------------------------------------------------
  */
  async getRequestsForCenter(centerId: string) {
    const requests = await CompanyAdminRequest.find({
      centerId: new Types.ObjectId(centerId),
    })
      .populate("companyId", "companyName email phone logo")
      .populate("companyAdminId", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .lean();

    return requests;
  }

  /*
  |--------------------------------------------------------------------------
  | Get all requests sent by a Company Admin
  |--------------------------------------------------------------------------
  */
  async getRequestsByCompany(companyId: string) {
    const requests = await CompanyAdminRequest.find({
      companyId: new Types.ObjectId(companyId),
    })
      .populate(
        "centerId",
        "centerName email phone city state managerName centerCode centerManagerId",
      )
      .populate("companyAdminId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    return requests;
  }

  /*
  |--------------------------------------------------------------------------
  | Get a single request by ID (with full details)
  |--------------------------------------------------------------------------
  */
  async getRequestById(requestId: string) {
    const request = await CompanyAdminRequest.findById(requestId)
      .populate("companyId", "companyName email phone logo")
      .populate("companyAdminId", "firstName lastName email phone")
      .populate(
        "centerId",
        "centerName email phone city state managerName centerCode",
      )
      .lean();

    if (!request) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Request not found.");
    }

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Center Manager uploads documents for a request
  |--------------------------------------------------------------------------
  */
  async uploadDocuments(
    requestId: string,
    centerId: string,
    documents: {
      documentType: string;
      fileName: string;
      fileUrl: string;
      fileSize?: string;
    }[],
  ) {
    const request = await CompanyAdminRequest.findOne({
      _id: new Types.ObjectId(requestId),
      centerId: new Types.ObjectId(centerId),
    });

    if (!request) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Request not found or does not belong to your center.",
      );
    }

    if (
      request.status !== CompanyAdminRequestStatus.PENDING &&
      request.status !== CompanyAdminRequestStatus.PENDING_DOCUMENTS
    ) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Cannot upload documents. Current status is: ${request.status}`,
      );
    }

    // Update documents array — upsert by documentType
    const currentDocs: any[] = request.documents ? [...request.documents] : [];

    documents.forEach((inDoc) => {
      const idx = currentDocs.findIndex(
        (d: any) =>
          d.documentType?.toLowerCase() === inDoc.documentType?.toLowerCase(),
      );
      if (idx !== -1) {
        const existing = currentDocs[idx];
        currentDocs[idx] = {
          ...existing,
          fileName: inDoc.fileName,
          fileUrl: inDoc.fileUrl,
          fileSize: inDoc.fileSize || existing.fileSize,
          version: (existing.version || 1) + 1,
          status: "PENDING",
          uploadedAt: new Date(),
          rejectionReason: undefined,
        };
      } else {
        currentDocs.push({
          documentType: inDoc.documentType,
          isMandatory: true,
          fileName: inDoc.fileName,
          fileUrl: inDoc.fileUrl,
          fileSize: inDoc.fileSize,
          version: 1,
          status: "PENDING",
          uploadedAt: new Date(),
        });
      }
    });

    request.documents = currentDocs as any;
    request.status = CompanyAdminRequestStatus.UNDER_REVIEW;
    request.lastDocumentUploadAt = new Date();
    await request.save();

    // Notify Company Admin
    const company: any = await Company.findById(request.companyId).lean();
    const adminUser: any = await Admin.findById(request.companyAdminId).lean();
    const center: any = await Center.findById(request.centerId).lean();

    if (adminUser?.email) {
      await emailService
        .send({
          to: adminUser.email,
          subject: `Center ${center?.centerName || ""} has uploaded documents for review`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #059669; margin-top: 0;">Documents Uploaded for Review</h2>
            <p>Hello <strong>${adminUser.firstName || "Admin"}</strong>,</p>
            <p>Center <strong>${center?.centerName || "N/A"}</strong> has uploaded the required documents for your review.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 4px 0;"><b>Center Name:</b> ${center?.centerName || "N/A"}</p>
              <p style="margin: 4px 0;"><b>Documents Uploaded:</b> ${documents.length}</p>
              <p style="margin: 4px 0;"><b>Status:</b> Under Review</p>
            </div>
            <p>Please log in to your dashboard and review the uploaded documents under <b>"Center Requests"</b>.</p>
            <p style="color: #6b7280; font-size: 12px;">ExamGuard Pro | Automated Notification</p>
          </div>
        `,
        })
        .catch((err: any) =>
          console.error(
            "[CompanyAdminRequestService] Email to admin failed:",
            err,
          ),
        );
    }

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Company Admin approves a document
  |--------------------------------------------------------------------------
  */
  async approveDocument(
    requestId: string,
    companyId: string,
    documentId: string,
  ) {
    const request = await CompanyAdminRequest.findOneAndUpdate(
      {
        _id: new Types.ObjectId(requestId),
        companyId: new Types.ObjectId(companyId),
        "documents._id": new Types.ObjectId(documentId),
      },
      {
        $set: {
          "documents.$.status": DocumentApprovalStatus.APPROVED,
          "documents.$.verifiedAt": new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!request) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Request or Document not found.");
    }

    // If all mandatory docs are approved, auto-approve the request
    const allApproved = (request.documents as any[]).every(
      (d: any) =>
        !d.isMandatory || d.status === DocumentApprovalStatus.APPROVED,
    );
    if (allApproved && request.status !== CompanyAdminRequestStatus.APPROVED) {
      await this._finalApprove(request);
    }

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Company Admin rejects a document (triggers PENDING_DOCUMENTS status)
  |--------------------------------------------------------------------------
  */
  async rejectDocument(
    requestId: string,
    companyId: string,
    documentId: string,
    rejectionReason: string,
    adminRejectRemarks?: string,
  ) {
    const request = await CompanyAdminRequest.findOne({
      _id: new Types.ObjectId(requestId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!request) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Request not found.");
    }

    const doc = (request.documents as any[]).find(
      (d: any) => d._id?.toString() === documentId,
    );
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found.");

    doc.status = DocumentApprovalStatus.REJECTED;
    doc.rejectionReason = rejectionReason;

    request.status = CompanyAdminRequestStatus.PENDING_DOCUMENTS;
    if (adminRejectRemarks) request.adminRejectRemarks = adminRejectRemarks;

    await request.save();

    const CenterOnboarding = require("./centerOnboarding.model").default;
    await CenterOnboarding.findOneAndUpdate(
      { centerId: request.centerId, "documents.documentType": doc.documentType },
      { 
        $set: { 
          "documents.$.status": "REJECTED",
          "documents.$.rejectionReason": rejectionReason,
          status: "REJECTED",
          adminReviewRemarks: adminRejectRemarks || rejectionReason
        }
      }
    );

    // Notify Center Manager
    const center: any = await Center.findById(request.centerId).lean();
    if (center?.email) {
      await emailService
        .send({
          to: center.email,
          subject: "Action Required: Document Rejected — Please Re-Upload",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fef2f2; border-radius: 8px;">
            <h2 style="color: #dc2626; margin-top: 0;">Document Rejected — Action Required</h2>
            <p>Hello <strong>${center.managerName || "Center Manager"}</strong>,</p>
            <p>The Company Admin has rejected a document from your submission. Please re-upload the required document.</p>
            <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <p style="margin: 4px 0;"><b>Rejected Document:</b> ${doc.documentType}</p>
              <p style="margin: 4px 0;"><b>Reason:</b> ${rejectionReason}</p>
              ${adminRejectRemarks ? `<p style="margin: 4px 0;"><b>Admin Remarks:</b> ${adminRejectRemarks}</p>` : ""}
            </div>
            <p>Please go to <b>"Company Admin Request"</b> in your dashboard and click <b>"Reupload"</b> to fix this.</p>
          </div>
        `,
        })
        .catch((err: any) =>
          console.error(
            "[CompanyAdminRequestService] Rejection email failed:",
            err,
          ),
        );
    }

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Company Admin fully approves the request (all docs verified)
  |--------------------------------------------------------------------------
  */
  async approveRequest(requestId: string, companyId: string) {
    const request = await CompanyAdminRequest.findOne({
      _id: new Types.ObjectId(requestId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!request)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Request not found.");

    await this._finalApprove(request);

    return request;
  }

  /*
  |--------------------------------------------------------------------------
  | Internal: Final Approval — update status and send success email to center
  |--------------------------------------------------------------------------
  */
  private async _finalApprove(request: any) {
    request.status = CompanyAdminRequestStatus.APPROVED;
    request.approvedAt = new Date();
    await request.save();

    // ── Link the company to the center and mark center as active ──────────────
    await Center.findByIdAndUpdate(
      request.centerId,
      { 
        $addToSet: { accessibleByCompanies: request.companyId },
        $set: { setupStatus: "ACTIVE", completionPercentage: 100 }
      },
    );

    const CenterOnboarding = require("./centerOnboarding.model").default;
    await CenterOnboarding.findOneAndUpdate(
      { centerId: request.centerId },
      { $set: { status: "ACTIVE", "documents.$[].status": "APPROVED" } }
    );

    const center: any = await Center.findById(request.centerId).lean();
    const company: any = await Company.findById(request.companyId).lean();
    const adminUser: any = await Admin.findById(request.companyAdminId).lean();

    if (center?.email) {
      await emailService
        .send({
          to: center.email,
          subject: `🎉 Successfully Connected with ${company?.companyName || "Company"}!`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1fae5; border-radius: 8px;">
            <h2 style="color: #059669; margin-top: 0;">✅ Connection Approved!</h2>
            <p>Hello <strong>${center.managerName || "Center Manager"}</strong>,</p>
            <p>Congratulations! Your center <strong>${center.centerName}</strong> has been successfully verified and connected with <strong>${company?.companyName || "the Company"}</strong>.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 4px 0;"><b>Company:</b> ${company?.companyName || "N/A"}</p>
              <p style="margin: 4px 0;"><b>Company Admin:</b> ${adminUser?.firstName || ""} ${adminUser?.lastName || ""} (${adminUser?.email || ""})</p>
              <p style="margin: 4px 0;"><b>Status:</b> ✅ APPROVED</p>
              <p style="margin: 4px 0;"><b>Effective Date:</b> ${new Date().toLocaleDateString("en-IN")}</p>
            </div>
            <p>You can now see exam assignments from this company on your Center Dashboard. Your existing login credentials remain the same.</p>
            <p style="color: #6b7280; font-size: 12px;">ExamGuard Pro | Automated Notification</p>
          </div>
        `,
        })
        .catch((err: any) =>
          console.error(
            "[CompanyAdminRequestService] Approval email failed:",
            err,
          ),
        );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Company Admin permanently rejects the entire request
  |--------------------------------------------------------------------------
  */
  async rejectRequest(requestId: string, companyId: string, remarks: string) {
    const request = await CompanyAdminRequest.findOne({
      _id: new Types.ObjectId(requestId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!request)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Request not found.");

    request.status = CompanyAdminRequestStatus.REJECTED;
    request.adminRejectRemarks = remarks;
    await request.save();

    // Notify center
    const center: any = await Center.findById(request.centerId).lean();
    const company: any = await Company.findById(request.companyId).lean();

    if (center?.email) {
      await emailService
        .send({
          to: center.email,
          subject: `Connection Request Declined — ${company?.companyName || "Company"}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fef2f2; border-radius: 8px;">
            <h2 style="color: #dc2626; margin-top: 0;">Connection Request Declined</h2>
            <p>Hello <strong>${center.managerName || "Center Manager"}</strong>,</p>
            <p>Unfortunately, your connection request with <strong>${company?.companyName || "the Company"}</strong> has been declined.</p>
            <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <p style="margin: 4px 0;"><b>Reason:</b> ${remarks || "Not specified by admin."}</p>
            </div>
            <p>Please contact the company admin for more information.</p>
          </div>
        `,
        })
        .catch((err: any) =>
          console.error(
            "[CompanyAdminRequestService] Rejection email failed:",
            err,
          ),
        );
    }

    return request;
  }
}

export default new CompanyAdminRequestService();
