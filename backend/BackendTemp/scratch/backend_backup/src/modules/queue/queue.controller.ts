import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import queueService from "./queue.service";

import { QueueType } from "./queue.types";

/*
|--------------------------------------------------------------------------
| Add Job
|--------------------------------------------------------------------------
*/

export const addJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await queueService.addJob(req.body);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Job added successfully.",
    data: job,
  });
});

/*
|--------------------------------------------------------------------------
| Add Email Job
|--------------------------------------------------------------------------
*/

export const addEmailJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await queueService.addEmailJob(req.body, req.body.options);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Email job added successfully.",
    data: job,
  });
});

/*
|--------------------------------------------------------------------------
| Add PDF Job
|--------------------------------------------------------------------------
*/

export const addPdfJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await queueService.addPdfJob(req.body.payload, req.body.options);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "PDF job added successfully.",
    data: job,
  });
});

/*
|--------------------------------------------------------------------------
| Add Report Job
|--------------------------------------------------------------------------
*/

export const addReportJob = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await queueService.addReportJob(
      req.body.payload,
      req.body.options,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Report job added successfully.",
      data: job,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Job
|--------------------------------------------------------------------------
*/

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await queueService.getJob(
    req.query.queue as QueueType,

    req.params.id as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Job fetched successfully.",
    data: job,
  });
});

/*
|--------------------------------------------------------------------------
| Get Jobs
|--------------------------------------------------------------------------
*/

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await queueService.getJobs(req.query.queue as QueueType);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Jobs fetched successfully.",
    data: jobs,
  });
});

/*
|--------------------------------------------------------------------------
| Retry Job
|--------------------------------------------------------------------------
*/

export const retryJob = asyncHandler(async (req: Request, res: Response) => {
  const result = await queueService.retryJob(
    req.query.queue as QueueType,

    req.params.id as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Job retried successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Remove Job
|--------------------------------------------------------------------------
*/

export const removeJob = asyncHandler(async (req: Request, res: Response) => {
  const result = await queueService.removeJob(
    req.query.queue as QueueType,

    req.params.id as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Job removed successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Pause Queue
|--------------------------------------------------------------------------
*/

export const pauseQueue = asyncHandler(async (req: Request, res: Response) => {
  const result = await queueService.pauseQueue(req.query.queue as QueueType);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Queue paused successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Resume Queue
|--------------------------------------------------------------------------
*/

export const resumeQueue = asyncHandler(async (req: Request, res: Response) => {
  const result = await queueService.resumeQueue(req.query.queue as QueueType);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Queue resumed successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Clean Queue
|--------------------------------------------------------------------------
*/

export const cleanQueue = asyncHandler(async (req: Request, res: Response) => {
  const result = await queueService.cleanQueue(req.query.queue as QueueType);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Queue cleaned successfully.",
    data: result,
  });
});
