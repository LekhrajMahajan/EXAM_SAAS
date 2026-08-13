import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { websocketService } from "./websocket.service";

import { SocketEvent, ISocketPayload } from "./websocket.types";

/*
|--------------------------------------------------------------------------
| Join Room
|--------------------------------------------------------------------------
*/

export const joinRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await websocketService.joinRoom(
    req.app.get("io"),

    req.body as ISocketPayload,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Joined room successfully.",

    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Leave Room
|--------------------------------------------------------------------------
*/

export const leaveRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await websocketService.leaveRoom(
    req.app.get("io"),

    req.body as ISocketPayload,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Left room successfully.",

    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Broadcast Event
|--------------------------------------------------------------------------
*/

export const broadcastEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body as ISocketPayload;

    await req.app.get("io").emit(
      payload.event,

      payload.data,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Event broadcasted successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Notification
|--------------------------------------------------------------------------
*/

export const sendNotification = asyncHandler(
  async (req: Request, res: Response) => {
    await websocketService.notification(
      req.app.get("io"),

      req.body as ISocketPayload,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification sent successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Live Monitoring Event
|--------------------------------------------------------------------------
*/

export const sendLiveMonitoring = asyncHandler(
  async (req: Request, res: Response) => {
    await websocketService.liveMonitoring(
      req.app.get("io"),

      req.body as ISocketPayload,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Live monitoring event sent successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send System Alert
|--------------------------------------------------------------------------
*/

export const sendSystemAlert = asyncHandler(
  async (req: Request, res: Response) => {
    await req.app.get("io").emit(
      SocketEvent.SYSTEM_ALERT,

      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System alert sent successfully.",

      data: null,
    });
  },
);
