import { Schema, model } from "mongoose";

import {
  ILiveMonitoring,
  ConnectionStatus,
  CameraStatus,
  MicrophoneStatus,
  FullscreenStatus,
  BrowserStatus,
  RiskLevel,
  LiveMonitoringStatus,
} from "./liveMonitoring.types";

const LiveMonitoringSchema = new Schema<ILiveMonitoring>(
  {
    /*
            |--------------------------------------------------------------------------
            | References
            |--------------------------------------------------------------------------
            */

    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "CandidateAssignment",
      required: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      required: true,
    },

    examRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      required: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Socket
            |--------------------------------------------------------------------------
            */

    socketId: {
      type: String,
      required: true,
      trim: true,
    },

    sessionId: {
      type: String,
      required: true,
      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

    connectionStatus: {
      type: String,
      enum: Object.values(ConnectionStatus),
      default: ConnectionStatus.ONLINE,
    },

    cameraStatus: {
      type: String,
      enum: Object.values(CameraStatus),
      default: CameraStatus.ACTIVE,
    },

    microphoneStatus: {
      type: String,
      enum: Object.values(MicrophoneStatus),
      default: MicrophoneStatus.ACTIVE,
    },

    fullscreenStatus: {
      type: String,
      enum: Object.values(FullscreenStatus),
      default: FullscreenStatus.ENTERED,
    },

    browserStatus: {
      type: String,
      enum: Object.values(BrowserStatus),
      default: BrowserStatus.ACTIVE,
    },

    monitoringStatus: {
      type: String,
      enum: Object.values(LiveMonitoringStatus),
      default: LiveMonitoringStatus.ACTIVE,
    },

    riskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
      default: RiskLevel.LOW,
    },

    /*
            |--------------------------------------------------------------------------
            | Counters
            |--------------------------------------------------------------------------
            */

    tabSwitchCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    fullscreenExitCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    copyPasteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    devToolsOpenCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    networkDisconnectCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    heartbeatCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    faceNotDetectedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    multipleFacesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    unregisteredFaceCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    referenceFaceDescriptor: {
      type: String,
    },

    /*
            |--------------------------------------------------------------------------
            | Activity
            |--------------------------------------------------------------------------
            */

    lastHeartbeatAt: Date,

    lastSeenAt: Date,

    /*
            |--------------------------------------------------------------------------
            | Device
            |--------------------------------------------------------------------------
            */

    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },

    userAgent: {
      type: String,
      required: true,
      trim: true,
    },

    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    browserName: {
      type: String,
      required: true,
      trim: true,
    },

    operatingSystem: {
      type: String,
      required: true,
      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Geo
            |--------------------------------------------------------------------------
            */

    latitude: Number,

    longitude: Number,

    /*
            |--------------------------------------------------------------------------
            | Remarks
            |--------------------------------------------------------------------------
            */

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    /*
            |--------------------------------------------------------------------------
            | Soft Delete
            |--------------------------------------------------------------------------
            */

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index(
  {
    attendanceId: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  examId: 1,
  monitoringStatus: 1,
});

LiveMonitoringSchema.index({
  examCenterId: 1,
  monitoringStatus: 1,
});

LiveMonitoringSchema.index({
  examRoomId: 1,
  monitoringStatus: 1,
});

/*
|--------------------------------------------------------------------------
| Candidate Lookup
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  candidateId: 1,
});

LiveMonitoringSchema.index({
  candidateAssignmentId: 1,
});

/*
|--------------------------------------------------------------------------
| Socket
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  socketId: 1,
});

LiveMonitoringSchema.index({
  sessionId: 1,
});

/*
|--------------------------------------------------------------------------
| Risk
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  riskLevel: 1,
});

LiveMonitoringSchema.index({
  riskLevel: 1,
  monitoringStatus: 1,
});

/*
|--------------------------------------------------------------------------
| Heartbeat
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  lastHeartbeatAt: -1,
});

LiveMonitoringSchema.index({
  connectionStatus: 1,
});

/*
|--------------------------------------------------------------------------
| Device
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  deviceId: 1,
});

LiveMonitoringSchema.index({
  browserName: 1,
});

LiveMonitoringSchema.index({
  operatingSystem: 1,
});

/*
|--------------------------------------------------------------------------
| Geo
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  latitude: 1,
  longitude: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

LiveMonitoringSchema.index({
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const LiveMonitoring = model<ILiveMonitoring>(
  "LiveMonitoring",
  LiveMonitoringSchema,
);

export default LiveMonitoring;
