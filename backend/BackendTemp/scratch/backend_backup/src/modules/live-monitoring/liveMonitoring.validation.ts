import { z } from "zod";

import {
  BrowserStatus,
  CameraStatus,
  ConnectionStatus,
  FullscreenStatus,
  LiveMonitoringStatus,
  MicrophoneStatus,
  RiskLevel,
} from "./liveMonitoring.types";

/*
|--------------------------------------------------------------------------
| Common Validators
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const latitude = z.number().min(-90).max(90);

const longitude = z.number().min(-180).max(180);

const ipv4 = z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IPv4 address");

/*
|--------------------------------------------------------------------------
| Create Monitoring Session
|--------------------------------------------------------------------------
*/

export const createLiveMonitoringSchema = z.object({
  body: z.object({
    attendanceId: objectId,
    candidateAssignmentId: objectId,
    candidateId: objectId,
    examId: objectId,
    examCenterId: objectId,
    examRoomId: objectId,
    socketId: z.string().min(1).max(200),
    sessionId: z.string().min(1).max(200),
    deviceId: z.string().min(1).max(200),
    browserName: z.string().min(1).max(100),
    operatingSystem: z.string().min(1).max(100),
    userAgent: z.string().min(1),
    ipAddress: ipv4,
    latitude: latitude.optional(),
    longitude: longitude.optional(),
  })
});

export const heartbeatSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    socketId: z.string().min(1),
  })
});

export const updateCameraSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    cameraStatus: z.nativeEnum(CameraStatus),
  })
});

export const updateMicrophoneSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    microphoneStatus: z.nativeEnum(MicrophoneStatus),
  })
});

export const updateBrowserSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    browserStatus: z.nativeEnum(BrowserStatus),
  })
});

export const updateConnectionSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    connectionStatus: z.nativeEnum(ConnectionStatus),
  })
});

export const updateFullscreenSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    fullscreenStatus: z.nativeEnum(FullscreenStatus),
  })
});

export const updateRiskSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    riskLevel: z.nativeEnum(RiskLevel),
  })
});

export const updateMonitoringStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    monitoringStatus: z.nativeEnum(LiveMonitoringStatus),
  })
});

export const incrementCounterSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    type: z.enum([
      "TAB_SWITCH",
      "COPY_PASTE",
      "FULLSCREEN_EXIT",
      "DEVTOOLS",
      "NETWORK_DISCONNECT",
    ]),
  })
});

export const updateLocationSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    latitude,
    longitude,
  })
});

export const updateLiveMonitoringSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    cameraStatus: z.nativeEnum(CameraStatus).optional(),
    microphoneStatus: z.nativeEnum(MicrophoneStatus).optional(),
    browserStatus: z.nativeEnum(BrowserStatus).optional(),
    fullscreenStatus: z.nativeEnum(FullscreenStatus).optional(),
    connectionStatus: z.nativeEnum(ConnectionStatus).optional(),
    monitoringStatus: z.nativeEnum(LiveMonitoringStatus).optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    remarks: z.string().max(500).optional(),
  })
});

export const liveMonitoringIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

export const liveMonitoringQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    examId: objectId.optional(),
    candidateId: objectId.optional(),
    examCenterId: objectId.optional(),
    examRoomId: objectId.optional(),
    monitoringStatus: z.nativeEnum(LiveMonitoringStatus).optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
  })
});

export const liveMonitoringStatisticsSchema = z.object({
  query: z.object({
    examId: objectId.optional(),
    examCenterId: objectId.optional(),
  })
});

export const liveMonitoringDashboardSchema = z.object({
  params: z.object({
    examId: objectId,
  })
});

export const recordEventSchema = z.object({
  body: z.object({
    examId: objectId.optional(),
    shiftId: objectId.optional(),
    candidateId: objectId.optional(),
    eventType: z.string().optional(),
    eventSeverity: z.string().optional(),
    eventTime: z.string().optional(),
    deviceId: z.string().optional(),
    browser: z.string().optional(),
    operatingSystem: z.string().optional(),
    ipAddress: z.string().optional(),
    location: z.any().optional(),
    metadata: z.any().optional(),
  })
});
