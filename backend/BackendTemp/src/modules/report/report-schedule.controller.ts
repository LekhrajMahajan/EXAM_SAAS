import { Request, Response } from "express";
import reportScheduleService from "./report-schedule.service";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

export const getSchedules = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportScheduleService.getSchedules(req.query);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedules retrieved successfully",
    data: result,
  });
});

export const getScheduleById = asyncHandler(async (req: Request, res: Response) => {
  const schedule = await reportScheduleService.getScheduleById(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedule retrieved successfully",
    data: schedule,
  });
});

export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const schedule = await reportScheduleService.createSchedule(req.body, req.user._id);
  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Schedule created successfully",
    data: schedule,
  });
});

export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const schedule = await reportScheduleService.updateSchedule(req.params.id as string, req.body);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedule updated successfully",
    data: schedule,
  });
});

export const deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
  await reportScheduleService.deleteSchedule(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedule deleted successfully",
    data: null,
  });
});

export const toggleScheduleStatus = asyncHandler(async (req: Request, res: Response) => {
  const schedule = await reportScheduleService.toggleScheduleStatus(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedule status toggled successfully",
    data: schedule,
  });
});

export const runScheduleNow = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const execution = await reportScheduleService.runScheduleNow(req.params.id as string, req.user._id);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Schedule execution started",
    data: execution,
  });
});

export const getExecutions = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportScheduleService.getExecutions(req.query);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Executions retrieved successfully",
    data: result,
  });
});
