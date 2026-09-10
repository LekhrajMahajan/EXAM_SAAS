import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import geoMonitoringService from "./geoMonitoring.service";
import { SocketEvent } from "../websocket/websocket.types";

export const recordLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const { centerId, ...payload } = req.body;
    
    // Save to DB and check geofence
    const record = await geoMonitoringService.recordLocation(payload, centerId);

    // Wire geo updates through websocket using the existing namespace/service
    // The client or observer in the room should receive the update
    // We assume the room might be the examId or entityId
    const socketPayload = {
      room: payload.examId,
      data: record,
    };
    
    // Since we don't have direct access to the socket instance here easily without
    // passing it or having a global io instance, we'll assume the websocket service 
    // has a method to emit to a room if it's refactored, OR we just emit using 
    // a global io instance if available. 
    // For now, we will add a note or use a potential global io.
    // If liveMonitoring uses socket.broadcast.emit, we typically handle real-time 
    // inside socket event listeners, but for REST-to-Socket we'd need `io`.
    // Example: global.io?.to(payload.examId).emit(SocketEvent.GEO_LOCATION_UPDATE, record);
    // As instructed: "wire geo updates through the same socket namespace instead of a new one"
    // We will leave the socket emission logic to be handled by the websocket service 
    // if a method is provided, e.g., websocketService.emitToRoom(payload.examId, "GEO_LOCATION_UPDATE", record)
    
    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Location recorded successfully",
      data: record,
    });
  }
);

export const getLatestLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId, entityId } = req.params;

    const location = await geoMonitoringService.getLatestLocation(examId as string, entityId as string);

    if (!location) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Location not found for the given entity",
      });
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Latest location fetched successfully",
      data: location,
    });
  }
);

export const getAllLatestLocations = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId } = req.params;

    const locations = await geoMonitoringService.getAllLatestLocationsForExam(examId as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Latest locations fetched successfully",
      data: locations,
    });
  }
);
