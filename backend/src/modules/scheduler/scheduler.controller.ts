import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import schedulerService from "./scheduler.service";

import { SchedulerJob } from "./scheduler.types";

/*
|--------------------------------------------------------------------------
| Get Scheduler Jobs
|--------------------------------------------------------------------------
*/

export const getSchedulerJobs = asyncHandler(
  async (_req: Request, res: Response) => {
    const jobs = await schedulerService.getJobs();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler jobs fetched successfully.",

      data: jobs,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Scheduler Job
|--------------------------------------------------------------------------
*/

export const getSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await schedulerService.getJob(req.params.name as SchedulerJob);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job fetched successfully.",

      data: job,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Create Scheduler Job
|--------------------------------------------------------------------------
*/

export const createSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await schedulerService.createJob(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Scheduler job created successfully.",

      data: job,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Scheduler Job
|--------------------------------------------------------------------------
*/

export const updateSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await schedulerService.updateJob({
      ...req.body,

      name: req.params.name as SchedulerJob,
    });

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job updated successfully.",

      data: job,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Run Scheduler Job
|--------------------------------------------------------------------------
*/

export const runSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await schedulerService.runJob(
      req.params.name as SchedulerJob,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job executed successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Pause Scheduler Job
|--------------------------------------------------------------------------
*/

export const pauseSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await schedulerService.pauseJob(
      req.params.name as SchedulerJob,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job paused successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Resume Scheduler Job
|--------------------------------------------------------------------------
*/

export const resumeSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await schedulerService.resumeJob(
      req.params.name as SchedulerJob,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job resumed successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Scheduler Job
|--------------------------------------------------------------------------
*/

export const deleteSchedulerJob = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await schedulerService.deleteJob(
      req.params.name as SchedulerJob,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Scheduler job deleted successfully.",

      data: result,
    });
  },
);
