import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import observerService from "./observer.service";

/*
|--------------------------------------------------------------------------
| Assign Observer
|--------------------------------------------------------------------------
*/

export const assignObserver = asyncHandler(
  async (req: Request, res: Response) => {
    const observer = await observerService.assignObserver({
      ...req.body,

      createdBy: req.user!.userId,
    });

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Observer assigned successfully.",

      data: observer,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Observers
|--------------------------------------------------------------------------
*/

export const getObservers = asyncHandler(
  async (req: Request, res: Response) => {
    const observers = await observerService.getObservers(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Observers fetched successfully.",

      data: observers,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Observer By Id
|--------------------------------------------------------------------------
*/

export const getObserverById = asyncHandler(
  async (req: Request, res: Response) => {
    const observer = await observerService.getObserverById(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Observer fetched successfully.",

      data: observer,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Check In
|--------------------------------------------------------------------------
*/

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const observer = await observerService.checkIn(req.body.observerId);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Observer checked in successfully.",

    data: observer,
  });
});

/*
|--------------------------------------------------------------------------
| Check Out
|--------------------------------------------------------------------------
*/

export const checkOut = asyncHandler(async (req: Request, res: Response) => {
  const observer = await observerService.checkOut(req.body.observerId);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Observer checked out successfully.",

    data: observer,
  });
});

/*
|--------------------------------------------------------------------------
| Create Incident
|--------------------------------------------------------------------------
*/

export const createIncident = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      observerId,

      ...incident
    } = req.body;

    const result = await observerService.createIncident(
      observerId,

      incident,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Incident reported successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Incident
|--------------------------------------------------------------------------
*/

export const updateIncident = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await observerService.updateIncident(
      req.body.observerId,

      req.params.id as string,

      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Incident updated successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Incidents
|--------------------------------------------------------------------------
*/

export const getIncidents = asyncHandler(
  async (req: Request, res: Response) => {
    const incidents = await observerService.getIncidents(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Incidents fetched successfully.",

      data: incidents,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const dashboard = await observerService.getDashboard();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Observer dashboard fetched successfully.",

      data: dashboard,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Live Observers
|--------------------------------------------------------------------------
*/

export const getLiveObservers = asyncHandler(
  async (_req: Request, res: Response) => {
    const observers = await observerService.getLiveObservers();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Live observers fetched successfully.",

      data: observers,
    });
  },
);
