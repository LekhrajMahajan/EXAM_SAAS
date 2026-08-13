import { Request, Response } from "express";
import sidebarService from "./sidebar.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const getMyNavigation = asyncHandler(async (req: Request, res: Response) => {
  const keyword = (req.query.search || req.query.keyword || "") as string;
  const user = (req as any).user;
  const result = await sidebarService.getUserNavigation(user, keyword);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "User navigation generated successfully.",
    data: result,
  });
});

export const getSidebarTree = asyncHandler(async (req: Request, res: Response) => {
  const keyword = (req.query.search || req.query.keyword || "") as string;
  const user = (req as any).user;
  const result = await sidebarService.getUserNavigation(user, keyword);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar hierarchy tree retrieved successfully.",
    data: result.tree || result.menu || result,
  });
});

export const getSidebarItems = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const companyId = req.query.companyId || user?.companyId;
  const result = await sidebarService.getAll(companyId ? companyId.toString() : undefined);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar items fetched successfully.",
    data: result,
  });
});

export const createSidebarItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await sidebarService.create({ ...req.body, createdBy: user?._id || user?.id });

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Sidebar item created successfully.",
    data: result,
  });
});

export const updateSidebarItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await sidebarService.update(req.params.id as string, req.body, user);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar item updated successfully.",
    data: result,
  });
});

export const deleteSidebarItem = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await sidebarService.delete(req.params.id as string, user);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar item deleted successfully.",
    data: result,
  });
});

export const reorderSidebarItems = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const items = req.body.items || req.body.orderUpdates || [];
  const result = await sidebarService.reorder(items, user);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar items reordered successfully.",
    data: result,
  });
});

export const toggleFavorite = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = (user?._id || user?.id || "").toString();
  const targetKey = req.body.itemId || req.body.route || req.body.targetKey;
  const result = await sidebarService.toggleFavorite(userId, targetKey, user?.companyId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Favorite menu toggled successfully.",
    data: result,
  });
});

export const addRecent = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = (user?._id || user?.id || "").toString();
  const targetKey = req.body.itemId || req.body.route || req.body.targetKey;
  const title = req.body.title;
  const result = await sidebarService.addRecent(userId, targetKey, title, user?.companyId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Recent menu tracked successfully.",
    data: result,
  });
});

export const updateCollapse = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = (user?._id || user?.id || "").toString();
  const mode = req.body.collapsedMode || req.body.mode;
  const result = await sidebarService.updateCollapse(userId, mode, user?.companyId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar collapse state updated successfully.",
    data: result,
  });
});

export const customizeMenu = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const targetId = req.body.id || req.body._id || req.params.id;
  const result = await sidebarService.customizeMenu(targetId || req.body, req.body, user);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Menu customization applied successfully.",
    data: result,
  });
});

export const getSidebarAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const companyId = req.query.companyId || user?.companyId;
  const result = await sidebarService.getAnalytics(companyId ? companyId.toString() : undefined);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Sidebar usage analytics retrieved successfully.",
    data: result,
  });
});
