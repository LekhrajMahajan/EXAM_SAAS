import { Request, Response } from "express";

import companyService from "./company.service";
import paymentService from "../payment/payment.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Company
|--------------------------------------------------------------------------
*/

export const createCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;
    payload.status = false;
    payload.paymentStatus = "SUCCESS";
    payload.approvalStatus = "APPROVED";
    payload.approvedAt = new Date();
    
    // Create company in DB
    let company = await companyService.create(payload);

    // Automatically activate the company to trigger user creation and credential email
    company = await companyService.updateStatus((company._id as any).toString(), true);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Company created successfully. Login credentials sent to email.",
      data: {
        company,
      },
    });
  },
);

/*
|--------------------------------------------------------------------------
| Register Company (Public)
|--------------------------------------------------------------------------
*/

export const registerCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;
    payload.status = false;
    payload.paymentStatus = "PENDING";
    payload.approvalStatus = "PENDING";
    
    // Create company in DB
    const company = await companyService.create(payload);

    await companyService.logAudit((company._id as any).toString(), "SUBMITTED", "SYSTEM", "Company registration request submitted by user.");

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Company registered successfully. Awaiting Master Admin approval.",
      data: {
        company,
      },
    });
  },
);

export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, paymentId, signature } = req.body;
    
    const company = await companyService.verifyCompanyPayment(
      req.params.id as string,
      orderId,
      paymentId,
      signature
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Payment verified successfully. Company activated.",
      data: company,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Companies
|--------------------------------------------------------------------------
*/

export const getCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status:
        req.query.status !== undefined
          ? req.query.status === "true"
          : undefined,
      city: req.query.city as string,
      state: req.query.state as string,
      subscriptionPlan: req.query.subscriptionPlan as string,
      approvalStatus: req.query.approvalStatus as string,
      paymentStatus: req.query.paymentStatus as string,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Companies fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Company By Id
|--------------------------------------------------------------------------
*/

export const getCompanyById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Company
|--------------------------------------------------------------------------
*/

export const updateCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Company
|--------------------------------------------------------------------------
*/

export const deleteCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Company
|--------------------------------------------------------------------------
*/

export const restoreCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Company Status
|--------------------------------------------------------------------------
*/

export const updateCompanyStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Company Statistics
|--------------------------------------------------------------------------
*/

export const getCompanyStatistics = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await companyService.statistics();

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Company Approval Statistics
|--------------------------------------------------------------------------
*/

export const getApprovalStatistics = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await companyService.getApprovalStatistics();

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Approval statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Assign Reviewer
|--------------------------------------------------------------------------
*/

export const assignReviewer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.assignReviewer(
      req.params.id as string,
      req.body.reviewerId,
      (req as any).user?.userId || "SYSTEM"
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Reviewer assigned successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Approve Company
|--------------------------------------------------------------------------
*/

export const approveCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.approveCompany(
      req.params.id as string,
      (req as any).user?.userId || "SYSTEM"
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company approved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Reject Company
|--------------------------------------------------------------------------
*/

export const rejectCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.rejectCompany(
      req.params.id as string,
      req.body.reason,
      req.body.remarks,
      (req as any).user?.userId || "SYSTEM"
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Company rejected successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Subscription
|--------------------------------------------------------------------------
*/

export const updateSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if user is a COMPANY_ADMIN trying to modify another company
    if (req.user?.role === "COMPANY_ADMIN" && req.user?.companyId !== req.params.id) {
       return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
         success: false,
         message: "You do not have permission to update subscription for this company.",
         data: null,
       });
    }

    const { subscriptionPlan, subscriptionStartDate, subscriptionEndDate } = req.body;

    const result = await companyService.update(req.params.id as string, {
      ...(subscriptionPlan && { subscriptionPlan }),
      ...(subscriptionStartDate && { subscriptionStartDate: new Date(subscriptionStartDate) }),
      ...(subscriptionEndDate && { subscriptionEndDate: new Date(subscriptionEndDate) }),
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subscription updated successfully.",
      data: result,
    });
  },
);

