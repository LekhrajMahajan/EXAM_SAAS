import mongoose, { ClientSession } from "mongoose";

import LiveMonitoring from "./liveMonitoring.model";

import {
  BrowserStatus,
  CameraStatus,
  ConnectionStatus,
  FullscreenStatus,
  ILiveMonitoring,
  LiveMonitoringStatus,
  MicrophoneStatus,
  RiskLevel,
} from "./liveMonitoring.types";

export interface LiveMonitoringQuery {
  page?: number;

  limit?: number;

  examId?: string;

  candidateId?: string;

  examCenterId?: string;

  examRoomId?: string;

  monitoringStatus?: LiveMonitoringStatus;

  riskLevel?: RiskLevel;
}

class LiveMonitoringRepository {
  /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

  async create(payload: Partial<ILiveMonitoring>, session?: ClientSession) {
    const [document] = await LiveMonitoring.create([payload], { session });

    return document;
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Id
    |--------------------------------------------------------------------------
    */

  async findById(id: string) {
    return LiveMonitoring.findOne({
      _id: id,

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return LiveMonitoring.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Socket
    |--------------------------------------------------------------------------
    */

  async findBySocketId(socketId: string) {
    return LiveMonitoring.findOne({
      socketId,

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Attendance
    |--------------------------------------------------------------------------
    */

  async findByAttendance(attendanceId: string) {
    return LiveMonitoring.findOne({
      attendanceId,

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return LiveMonitoring.find({
      candidateId,

      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */

  async findByExam(examId: string) {
    return LiveMonitoring.find({
      examId,

      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */

  async findAll(query: LiveMonitoringQuery) {
    const {
      page = 1,

      limit = 20,

      ...filters
    } = query;

    const mongoQuery: Record<string, any> = {
      isDeleted: false,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        mongoQuery[key] = value;
      }
    });

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      LiveMonitoring.find(mongoQuery)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      LiveMonitoring.countDocuments(mongoQuery),
    ]);

    return {
      data,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Generic Update
    |--------------------------------------------------------------------------
    */

  async update(
    id: string,
    payload: mongoose.UpdateQuery<ILiveMonitoring>,
    session?: ClientSession,
  ) {
    return LiveMonitoring.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,

        session,

        runValidators: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Heartbeat
    |--------------------------------------------------------------------------
    */

  async heartbeat(id: string, session?: ClientSession) {
    return this.update(
      id,

      {
        $inc: {
          heartbeatCount: 1,
        },

        lastHeartbeatAt: new Date(),

        lastSeenAt: new Date(),

        connectionStatus: ConnectionStatus.ONLINE,
      },

      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Camera
    |--------------------------------------------------------------------------
    */

  async updateCameraStatus(
    id: string,
    status: CameraStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        cameraStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Microphone
    |--------------------------------------------------------------------------
    */

  async updateMicrophoneStatus(
    id: string,
    status: MicrophoneStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        microphoneStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Browser
    |--------------------------------------------------------------------------
    */

  async updateBrowserStatus(
    id: string,
    status: BrowserStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        browserStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Fullscreen
    |--------------------------------------------------------------------------
    */

  async updateFullscreenStatus(
    id: string,
    status: FullscreenStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        fullscreenStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    */

  async updateConnectionStatus(
    id: string,
    status: ConnectionStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        connectionStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Risk
    |--------------------------------------------------------------------------
    */

  async updateRiskLevel(id: string, risk: RiskLevel, session?: ClientSession) {
    return this.update(
      id,
      {
        riskLevel: risk,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Monitoring Status
    |--------------------------------------------------------------------------
    */

  async updateMonitoringStatus(
    id: string,
    status: LiveMonitoringStatus,
    session?: ClientSession,
  ) {
    return this.update(
      id,
      {
        monitoringStatus: status,
      },
      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Increment Counter
    |--------------------------------------------------------------------------
    */

  async incrementCounter(
    id: string,
    field:
      | "tabSwitchCount"
      | "fullscreenExitCount"
      | "copyPasteCount"
      | "devToolsOpenCount"
      | "networkDisconnectCount",
    session?: ClientSession,
  ) {
    return this.update(
      id,

      {
        $inc: {
          [field]: 1,
        },
      },

      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */

  async softDelete(id: string, session?: ClientSession) {
    return this.update(
      id,

      {
        isDeleted: true,

        deletedAt: new Date(),
      },

      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

  async restore(id: string, session?: ClientSession) {
    return this.update(
      id,

      {
        isDeleted: false,

        deletedAt: null,
      },

      session,
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

  async count(examId?: string) {
    const query: Record<string, any> = {
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return LiveMonitoring.countDocuments(query);
  }

  async countByRisk(riskLevel: RiskLevel, examId?: string) {
    const query: Record<string, any> = {
      riskLevel,

      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return LiveMonitoring.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Center Analytics
  |--------------------------------------------------------------------------
  */

  async centerAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$examCenterId",
                  totalCandidates: {
                      $sum: 1,
                  },
                  activeCandidates: {
                      $sum: {
                          $cond: [
                              {
                                  $eq: [
                                      "$monitoringStatus",
                                      LiveMonitoringStatus.ACTIVE,
                                  ],
                              },
                              1,
                              0,
                          ],
                      },
                  },
                  criticalCandidates: {
                      $sum: {
                          $cond: [
                              {
                                  $eq: [
                                      "$riskLevel",
                                      RiskLevel.CRITICAL,
                                  ],
                              },
                              1,
                              0,
                          ],
                      },
                  },
              },
          },
          {
              $sort: {
                  totalCandidates: -1,
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Room Analytics
  |--------------------------------------------------------------------------
  */

  async roomAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$examRoomId",
                  candidates: {
                      $sum: 1,
                  },
                  heartbeat: {
                      $avg: "$heartbeatCount",
                  },
              },
          },
          {
              $sort: {
                  candidates: -1,
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Device Analytics
  |--------------------------------------------------------------------------
  */

  async deviceAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$deviceId",
                  total: {
                      $sum: 1,
                  },
              },
          },
          {
              $sort: {
                  total: -1,
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Operating System Analytics
  |--------------------------------------------------------------------------
  */

  async operatingSystemAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$operatingSystem",
                  total: {
                      $sum: 1,
                  },
              },
          },
          {
              $sort: {
                  total: -1,
              },
          },
      ]);

  }


  /*
  |--------------------------------------------------------------------------
  | Heartbeat Analytics
  |--------------------------------------------------------------------------
  */

  async heartbeatAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: null,
                  averageHeartbeat: {
                      $avg: "$heartbeatCount",
                  },
                  maximumHeartbeat: {
                      $max: "$heartbeatCount",
                  },
                  minimumHeartbeat: {
                      $min: "$heartbeatCount",
                  },
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Violation Analytics
  |--------------------------------------------------------------------------
  */

  async violationAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: null,

                  tabSwitches: {
                      $sum: "$tabSwitchCount",
                  },

                  fullscreenExits: {
                      $sum: "$fullscreenExitCount",
                  },

                  copyPaste: {
                      $sum: "$copyPasteCount",
                  },

                  devTools: {
                      $sum: "$devToolsOpenCount",
                  },

                  networkDisconnects: {
                      $sum: "$networkDisconnectCount",
                  },
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Browser Analytics
  |--------------------------------------------------------------------------
  */

  async browserAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$browserName",
                  total: {
                      $sum: 1,
                  },
              },
          },
          {
              $sort: {
                  total: -1,
              },
          },
      ]);

  }

  /*
  |--------------------------------------------------------------------------
  | Risk Analytics
  |--------------------------------------------------------------------------
  */

  async riskAnalytics(
      examId: string
  ) {

      return LiveMonitoring.aggregate([
          {
              $match: {
                  examId: new mongoose.Types.ObjectId(examId),
                  isDeleted: false,
              },
          },
          {
              $group: {
                  _id: "$riskLevel",
                  total: {
                      $sum: 1,
                  },
              },
          },
          {
              $sort: {
                  total: -1,
              },
          },
      ]);

  }
  /*
  |--------------------------------------------------------------------------
  | Device Monitoring
  |--------------------------------------------------------------------------
  */

  async deviceMonitoring(examId: string, examCenterId?: string, connectionStatus?: string) {
    const filter: any = { examId, isDeleted: false };
    if (examCenterId) filter.examCenterId = examCenterId;
    if (connectionStatus) filter.connectionStatus = connectionStatus;

    return LiveMonitoring.find(filter).populate("candidateId", "firstName lastName");
  }
}

export default new LiveMonitoringRepository();
