import { Request, Response } from "express";

import planService from "./plan.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { PlanStatus } from "./plan.types";

export const createPlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const plan = await planService.createPlan(req.body, userId);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  }
);

export const updatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const plan = await planService.updatePlan(id as string, req.body, userId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  }
);

export const clonePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const plan = await planService.clonePlan(id as string, userId);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Plan cloned successfully",
      data: plan,
    });
  }
);

export const togglePlanStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const { status } = req.body; // Expect ACTIVE or INACTIVE

    const plan = await planService.toggleStatus(id as string, status as PlanStatus, userId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Plan marked as ${status}`,
      data: plan,
    });
  }
);

export const archivePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const plan = await planService.archivePlan(id as string, userId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Plan archived successfully",
      data: plan,
    });
  }
);

export const getPlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await planService.getById(id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Plan retrieved successfully",
      data: plan,
    });
  }
);

export const getAllPlans = asyncHandler(
  async (req: Request, res: Response) => {
    // Pagination & Search
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    const query: any = { isDeleted: false };
    if (search) {
      query.$or = [
        { planName: { $regex: search, $options: "i" } },
        { planCode: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const result = await planService.getAll({
      page,
      limit,
      search,
      extraQuery: query,
      sortBy,
      sortOrder
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Plans retrieved successfully",
      data: result,
    });
  }
);

export const deletePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await planService.delete(id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Plan deleted successfully",
    });
  }
);
