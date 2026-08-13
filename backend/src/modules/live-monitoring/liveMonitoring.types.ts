import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Connection Status
|--------------------------------------------------------------------------
*/

export enum ConnectionStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  DISCONNECTED = "DISCONNECTED",
}

/*
|--------------------------------------------------------------------------
| Camera Status
|--------------------------------------------------------------------------
*/

export enum CameraStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

/*
|--------------------------------------------------------------------------
| Microphone Status
|--------------------------------------------------------------------------
*/

export enum MicrophoneStatus {
  ACTIVE = "ACTIVE",
  MUTED = "MUTED",
  BLOCKED = "BLOCKED",
}

/*
|--------------------------------------------------------------------------
| Fullscreen Status
|--------------------------------------------------------------------------
*/

export enum FullscreenStatus {
  ENTERED = "ENTERED",
  EXITED = "EXITED",
}

/*
|--------------------------------------------------------------------------
| Browser Status
|--------------------------------------------------------------------------
*/

export enum BrowserStatus {
  ACTIVE = "ACTIVE",
  HIDDEN = "HIDDEN",
  CLOSED = "CLOSED",
}

/*
|--------------------------------------------------------------------------
| AI Risk Level
|--------------------------------------------------------------------------
*/

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

/*
|--------------------------------------------------------------------------
| Live Monitoring Status
|--------------------------------------------------------------------------
*/

export enum LiveMonitoringStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  TERMINATED = "TERMINATED",
}

/*
|--------------------------------------------------------------------------
| Interface
|--------------------------------------------------------------------------
*/

export interface ILiveMonitoring {
  attendanceId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  socketId: string;

  sessionId: string;

  connectionStatus: ConnectionStatus;

  cameraStatus: CameraStatus;

  microphoneStatus: MicrophoneStatus;

  fullscreenStatus: FullscreenStatus;

  browserStatus: BrowserStatus;

  tabSwitchCount: number;

  fullscreenExitCount: number;

  copyPasteCount: number;

  devToolsOpenCount: number;

  networkDisconnectCount: number;

  heartbeatCount: number;

  lastHeartbeatAt?: Date;

  lastSeenAt?: Date;

  latitude?: number;

  longitude?: number;

  ipAddress: string;

  userAgent: string;

  deviceId: string;

  browserName: string;

  operatingSystem: string;

  riskLevel: RiskLevel;

  monitoringStatus: LiveMonitoringStatus;

  remarks?: string;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Document
|--------------------------------------------------------------------------
*/

export type LiveMonitoringDocument = HydratedDocument<ILiveMonitoring>;
