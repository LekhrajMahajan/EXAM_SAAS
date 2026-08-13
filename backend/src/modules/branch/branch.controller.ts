import { Request, Response } from "express";

import branchService from "./branch.service";
import Branch from "./branch.model";
import Center from "../center/center.model";
import { BranchStatus } from "./branch.types";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Branch
|--------------------------------------------------------------------------
*/

export const createBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const companyId = req.body.companyId || (req as any).user?.companyId;

    const result = await branchService.create({
      ...req.body,
      companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Branch created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Branches (Advanced Search, Filtering & Sorting)
|--------------------------------------------------------------------------
*/

export const getBranches = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);

  // Clean out previously auto-seeded dummy branches (HQ-001 / Head Office) and centers (MAIN-01) from database so users can create dynamically
  try {
    await Branch.deleteMany({ branchCode: "HQ-001" });
    await Center.deleteMany({ centerCode: "MAIN-01" });
  } catch (error) {
    // Ignore cleanup error
  }

  const result = await branchService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId,
    branchType: req.query.branchType as string,
    city: req.query.city as string,
    state: req.query.state as string,
    country: req.query.country as string,
    status: req.query.status as string,
    createdBy: req.query.createdBy as string,
    createdDate: req.query.createdDate as string,
    updatedDate: req.query.updatedDate as string,
    sort: req.query.sort as string,
    order: req.query.order as "asc" | "desc",
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branches fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Branch Dashboard
|--------------------------------------------------------------------------
*/

export const getBranchDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const result = await branchService.dashboard(companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch dashboard metrics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Branch Analytics
|--------------------------------------------------------------------------
*/

export const getBranchAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const result = await branchService.analytics(req.params.branchId as string, companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch analytics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Branch Capacity
|--------------------------------------------------------------------------
*/

export const getBranchCapacity = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const result = await branchService.capacity(req.params.id as string, companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch capacity fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Branch Audit History
|--------------------------------------------------------------------------
*/

export const getBranchAuditHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await branchService.auditHistory(req.params.id as string, {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 15,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch audit history fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Branch By Id
|--------------------------------------------------------------------------
*/

export const getBranchById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await branchService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Branch
|--------------------------------------------------------------------------
*/

export const updateBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const result = await branchService.update(
      req.params.id as string,
      {
        ...req.body,
        updatedBy: userId,
      },
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Branch Status
|--------------------------------------------------------------------------
*/

export const updateBranchStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.updateBranchStatusWithAudit(
      req.params.id as string,
      req.body.status,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Activate Branch
|--------------------------------------------------------------------------
*/

export const activateBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.updateBranchStatusWithAudit(
      req.params.id as string,
      BranchStatus.ACTIVE,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch activated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Deactivate Branch
|--------------------------------------------------------------------------
*/

export const deactivateBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.updateBranchStatusWithAudit(
      req.params.id as string,
      BranchStatus.INACTIVE,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch deactivated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Archive Branch
|--------------------------------------------------------------------------
*/

export const archiveBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.updateBranchStatusWithAudit(
      req.params.id as string,
      BranchStatus.ARCHIVED,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch archived successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Branch
|--------------------------------------------------------------------------
*/

export const deleteBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.deleteBranchWithAudit(
      req.params.id as string,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Branch
|--------------------------------------------------------------------------
*/

export const restoreBranch = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined;
    const result = await branchService.restoreBranchWithAudit(
      req.params.id as string,
      userId.toString(),
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Archive Branches
|--------------------------------------------------------------------------
*/

export const bulkArchiveBranches = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : req.body.companyId;
    const result = await branchService.bulkOperation(
      "ARCHIVE",
      req.body.ids,
      userId.toString(),
      undefined,
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Bulk archive processed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Delete Branches
|--------------------------------------------------------------------------
*/

export const bulkDeleteBranches = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : req.body.companyId;
    const result = await branchService.bulkOperation(
      "DELETE",
      req.body.ids,
      userId.toString(),
      undefined,
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Bulk delete processed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Restore Branches
|--------------------------------------------------------------------------
*/

export const bulkRestoreBranches = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : req.body.companyId;
    const result = await branchService.bulkOperation(
      "RESTORE",
      req.body.ids,
      userId.toString(),
      undefined,
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Bulk restore processed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Status Update Branches
|--------------------------------------------------------------------------
*/

export const bulkStatusBranches = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = (req as any).user?.companyId ? (req as any).user.companyId.toString() : req.body.companyId;
    const result = await branchService.bulkOperation(
      "STATUS",
      req.body.ids,
      userId.toString(),
      req.body.status,
      companyId
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Bulk status update processed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Branch Statistics
|--------------------------------------------------------------------------
*/

export const getBranchStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const result = await branchService.statistics(companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Export Branches
|--------------------------------------------------------------------------
*/

export const exportBranches = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || "SYSTEM";
    const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const result = await branchService.exportBranches(req.query, userId.toString(), companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branches exported successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Validate Branch Import
|--------------------------------------------------------------------------
*/

export const validateBranchImport = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.body.companyId || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
    const rows = req.body.rows || [];
    const result = await branchService.validateImportRows(rows, companyId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Branch import validation completed.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| PHASE 5.2: BRANCH MANAGER ONBOARDING & SETUP WORKFLOW CONTROLLERS
|--------------------------------------------------------------------------
*/

/**
 * Helper to get active Branch or Manager identifier from request parameters or token
 */
const getBranchOrManagerIdentifier = (req: Request): { identifier: string; email?: string } => {
  if (req.params && req.params.branchId && req.params.branchId !== "undefined" && req.params.branchId !== "null") {
    return { identifier: String(req.params.branchId), email: (req as any).user?.email };
  }
  const user = (req as any).user || {};
  const identifier = user.branchId ? user.branchId.toString() : (user._id || user.id ? (user._id || user.id).toString() : "");
  return { identifier, email: user.email };
};

export const getMyBranch = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email } = getBranchOrManagerIdentifier(req);
  const result = await branchService.resolveBranch(identifier, email);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Current branch profile details fetched successfully.",
    data: result,
  });
});

export const getOnboardingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email } = getBranchOrManagerIdentifier(req);
  const result = await branchService.getOnboardingStatus(identifier, email);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch onboarding setup status fetched successfully.",
    data: result,
  });
});

export const updateProfileStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const result = await branchService.updateProfileStep(identifier, req.body, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 1: Branch profile and operating timing updated successfully.",
    data: result,
  });
});

export const updateLegalDocumentsStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const documents = Array.isArray(req.body) ? req.body : req.body.documents || [];
  const result = await branchService.updateLegalDocumentsStep(identifier, documents, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 2: Legal documents uploaded and verified successfully.",
    data: result,
  });
});

export const updateVerificationStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const result = await branchService.updateVerificationStep(identifier, req.body, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 3: Verification identifiers saved successfully.",
    data: result,
  });
});

export const registerStaffStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const staffList = Array.isArray(req.body) ? req.body : req.body.staff || [];
  const result = await branchService.registerStaffStep(identifier, staffList, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 4: Operational branch staff registered and synchronized successfully.",
    data: result,
  });
});

export const setupInfrastructureStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const infraList = Array.isArray(req.body) ? req.body : req.body.infrastructure || req.body.rooms || [];
  const result = await branchService.setupInfrastructureStep(identifier, infraList, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 5: Exam infrastructure and rooms configured successfully.",
    data: result,
  });
});

export const updateExamReadinessStep = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const readiness = req.body.examReadiness || req.body.readiness || req.body;
  const compliance = req.body.complianceChecklist || req.body.compliance || req.body;
  const result = await branchService.updateExamReadinessStep(identifier, readiness, compliance, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Step 6 & 7: Exam readiness and compliance checklist evaluated successfully.",
    data: result,
  });
});

export const submitOnboarding = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = getBranchOrManagerIdentifier(req);
  const userId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const result = await branchService.submitOnboarding(identifier, userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch setup wizard submitted for official Company Admin review and verification.",
    data: result,
  });
});

export const reviewOnboarding = asyncHandler(async (req: Request, res: Response) => {
  const branchId = String(req.params.branchId);
  const action = req.body.action as "APPROVE" | "REJECT";
  const remarks = req.body.remarks as string;
  const reviewerId = (req as any).user?._id ? (req as any).user._id.toString() : "";
  const result = await branchService.reviewOnboarding(branchId, action, remarks, reviewerId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: `Branch onboarding successfully reviewed (${action}).`,
    data: result,
  });
});

export const getPendingVerifications = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.query.companyId as string || ((req as any).user?.companyId ? (req as any).user.companyId.toString() : undefined);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await branchService.getPendingVerifications(companyId || "", page, limit);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Pending verification branches fetched successfully.",
    data: result,
  });
});

export const getManagerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email } = getBranchOrManagerIdentifier(req);
  const result = await branchService.getManagerDashboard(identifier, email);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch Manager enterprise dashboard metrics fetched successfully.",
    data: result,
  });
});
