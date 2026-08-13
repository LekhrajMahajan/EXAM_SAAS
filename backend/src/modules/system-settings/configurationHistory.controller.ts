import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import configurationHistoryService from "./configurationHistory.service";
import { ConfigurationApprovalStatus } from "./configurationHistory.types";

export const getConfigurationHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, module, category, search, status, approvalStatus } = req.query;

    const filters: any = {};
    if (module) filters.module = module;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (approvalStatus) filters.approvalStatus = approvalStatus;

    const pageNumber = page ? parseInt(page as string) : 1;
    const limitNumber = limit ? parseInt(limit as string) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const result = await configurationHistoryService.getHistory(filters, {
      skip,
      limit: limitNumber,
      search: search as string,
    });

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Configuration history fetched successfully.",
      data: result,
    });
  }
);

export const getConfigurationHistoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const history = await configurationHistoryService.getById(id as string, ["changedBy", "reviewer"]);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Configuration history details fetched.",
      data: history,
    });
  }
);

export const compareConfigurationVersions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id1, id2 } = req.body;
    
    if (!id1 || !id2) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "id1 and id2 are required for comparison.",
        data: null,
      });
    }

    const comparison = await configurationHistoryService.compareVersions(id1, id2);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Configuration versions compared.",
      data: comparison,
    });
  }
);

export const rollbackConfiguration = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    
    // @ts-ignore - Assuming req.user is available via auth middleware
    const userId = req.user?.userId as string;

    const result = await configurationHistoryService.rollback(id as string, userId, reason);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: result.message,
      data: null,
    });
  }
);

export const approveConfiguration = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // @ts-ignore
    const reviewerId = req.user?.userId as string;

    if (!Object.values(ConfigurationApprovalStatus).includes(status)) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Invalid approval status.",
        data: null,
      });
    }

    const result = await configurationHistoryService.approve(id as string, status, reviewerId, notes);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Configuration ${status.toLowerCase()} successfully.`,
      data: result,
    });
  }
);

export const exportConfigurationHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { module, category, status } = req.query;
    
    const filters: any = {};
    if (module) filters.module = module;
    if (category) filters.category = category;
    if (status) filters.status = status;

    const result = await configurationHistoryService.getHistory(filters, { limit: 1000 });
    
    // Assuming JSON export for simplicity. CSV/PDF can be handled in a shared export utility.
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Export data generated.",
      data: result.data,
    });
  }
);
