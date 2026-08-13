import mongoose, { ClientSession } from "mongoose";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import liveMonitoringRepository, { LiveMonitoringQuery } from "./liveMonitoring.repository";
import attendanceService from "../attendance/attendance.service";
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

class LiveMonitoringService {

    /*
    |--------------------------------------------------------------------------
    | Validate Attendance
    |--------------------------------------------------------------------------
    */
    private async validateAttendance(attendanceId: string) {
        const attendance = await attendanceService.getById(attendanceId);
        return attendance;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Duplicate Session
    |--------------------------------------------------------------------------
    */
    private async validateDuplicate(attendanceId: string) {
        const monitoring = await liveMonitoringRepository.findByAttendance(attendanceId);
        if (monitoring) {
            throw new ApiError(HTTP_STATUS.CONFLICT, "Live monitoring session already exists.");
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create Monitoring Session
    |--------------------------------------------------------------------------
    */
    async create(payload: Partial<ILiveMonitoring>) {
        if (!payload.attendanceId) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Attendance Id is required.");
        }

        await this.validateAttendance(payload.attendanceId.toString());
        await this.validateDuplicate(payload.attendanceId.toString());

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            const monitoring = await liveMonitoringRepository.create(
                {
                    ...payload,
                    monitoringStatus: LiveMonitoringStatus.ACTIVE,
                    connectionStatus: ConnectionStatus.ONLINE,
                    cameraStatus: CameraStatus.ACTIVE,
                    microphoneStatus: MicrophoneStatus.ACTIVE,
                    browserStatus: BrowserStatus.ACTIVE,
                    fullscreenStatus: FullscreenStatus.ENTERED,
                    riskLevel: RiskLevel.LOW,
                    heartbeatCount: 0,
                    tabSwitchCount: 0,
                    fullscreenExitCount: 0,
                    copyPasteCount: 0,
                    devToolsOpenCount: 0,
                    networkDisconnectCount: 0,
                    lastHeartbeatAt: new Date(),
                    lastSeenAt: new Date(),
                },
                session
            );

            await session.commitTransaction();
            session.endSession();
            return monitoring;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Heartbeat
    |--------------------------------------------------------------------------
    */
    async heartbeat(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.heartbeat(id);
    }

    /*
    |--------------------------------------------------------------------------
    | Camera Status
    |--------------------------------------------------------------------------
    */
    async updateCameraStatus(id: string, status: CameraStatus) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.updateCameraStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Microphone Status
    |--------------------------------------------------------------------------
    */
    async updateMicrophoneStatus(id: string, status: MicrophoneStatus) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.updateMicrophoneStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Browser Status
    |--------------------------------------------------------------------------
    */
    async updateBrowserStatus(id: string, status: BrowserStatus) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.updateBrowserStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Fullscreen Status
    |--------------------------------------------------------------------------
    */
    async updateFullscreenStatus(id: string, status: FullscreenStatus) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.updateFullscreenStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Connection Status
    |--------------------------------------------------------------------------
    */
    async updateConnectionStatus(id: string, status: ConnectionStatus) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.updateConnectionStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Risk Level
    |--------------------------------------------------------------------------
    */
    private calculateRiskLevel(monitoring: ILiveMonitoring): RiskLevel {
        const violations =
            monitoring.tabSwitchCount +
            monitoring.fullscreenExitCount +
            monitoring.copyPasteCount +
            monitoring.devToolsOpenCount +
            monitoring.networkDisconnectCount;

        if (violations >= 15) {
            return RiskLevel.CRITICAL;
        }

        if (violations >= 10) {
            return RiskLevel.HIGH;
        }

        if (violations >= 5) {
            return RiskLevel.MEDIUM;
        }

        return RiskLevel.LOW;
    }

    /*
    |--------------------------------------------------------------------------
    | Refresh Risk Level
    |--------------------------------------------------------------------------
    */
    private async refreshRiskLevel(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        const risk = this.calculateRiskLevel(monitoring);
        return liveMonitoringRepository.updateRiskLevel(id, risk);
    }

    /*
    |--------------------------------------------------------------------------
    | Tab Switch
    |--------------------------------------------------------------------------
    */
    async tabSwitch(id: string) {
        const monitoring = await liveMonitoringRepository.incrementCounter(id, "tabSwitchCount");
        await this.refreshRiskLevel(id);
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Fullscreen Exit
    |--------------------------------------------------------------------------
    */
    async fullscreenExit(id: string) {
        await liveMonitoringRepository.updateFullscreenStatus(id, FullscreenStatus.EXITED);
        const monitoring = await liveMonitoringRepository.incrementCounter(id, "fullscreenExitCount");
        await this.refreshRiskLevel(id);
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Copy Paste
    |--------------------------------------------------------------------------
    */
    async copyPaste(id: string) {
        const monitoring = await liveMonitoringRepository.incrementCounter(id, "copyPasteCount");
        await this.refreshRiskLevel(id);
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | DevTools Open
    |--------------------------------------------------------------------------
    */
    async devToolsOpened(id: string) {
        const monitoring = await liveMonitoringRepository.incrementCounter(id, "devToolsOpenCount");
        await this.refreshRiskLevel(id);
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Network Disconnect
    |--------------------------------------------------------------------------
    */
    async networkDisconnected(id: string) {
        await liveMonitoringRepository.updateConnectionStatus(id, ConnectionStatus.DISCONNECTED);
        const monitoring = await liveMonitoringRepository.incrementCounter(id, "networkDisconnectCount");
        await this.refreshRiskLevel(id);
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Network Reconnect
    |--------------------------------------------------------------------------
    */
    async networkReconnected(id: string) {
        return liveMonitoringRepository.updateConnectionStatus(id, ConnectionStatus.ONLINE);
    }

    /*
    |--------------------------------------------------------------------------
    | Pause Monitoring
    |--------------------------------------------------------------------------
    */
    async pauseMonitoring(id: string) {
        return liveMonitoringRepository.updateMonitoringStatus(id, LiveMonitoringStatus.PAUSED);
    }

    /*
    |--------------------------------------------------------------------------
    | Resume Monitoring
    |--------------------------------------------------------------------------
    */
    async resumeMonitoring(id: string) {
        return liveMonitoringRepository.updateMonitoringStatus(id, LiveMonitoringStatus.ACTIVE);
    }

    /*
    |--------------------------------------------------------------------------
    | Terminate Monitoring
    |--------------------------------------------------------------------------
    */
    async terminateMonitoring(id: string) {
        return liveMonitoringRepository.updateMonitoringStatus(id, LiveMonitoringStatus.TERMINATED);
    }

    /*
    |--------------------------------------------------------------------------
    | Get All Monitoring Sessions
    |--------------------------------------------------------------------------
    */
    async getAll(query: LiveMonitoringQuery) {
        return liveMonitoringRepository.findAll(query);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Monitoring By Id
    |--------------------------------------------------------------------------
    */
    async getById(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Live monitoring session not found.");
        }
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Attendance
    |--------------------------------------------------------------------------
    */
    async getByAttendance(attendanceId: string) {
        const monitoring = await liveMonitoringRepository.findByAttendance(attendanceId);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Live monitoring session not found.");
        }
        return monitoring;
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */
    async getByCandidate(candidateId: string) {
        return liveMonitoringRepository.findByCandidate(candidateId);
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Exam
    |--------------------------------------------------------------------------
    */
    async getByExam(examId: string) {
        return liveMonitoringRepository.findByExam(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Candidate Live Status
    |--------------------------------------------------------------------------
    */
    async candidateStatus(attendanceId: string) {
        const monitoring = await this.getByAttendance(attendanceId);
        return {
            monitoringStatus: monitoring.monitoringStatus,
            connectionStatus: monitoring.connectionStatus,
            cameraStatus: monitoring.cameraStatus,
            microphoneStatus: monitoring.microphoneStatus,
            browserStatus: monitoring.browserStatus,
            fullscreenStatus: monitoring.fullscreenStatus,
            riskLevel: monitoring.riskLevel,
            heartbeatCount: monitoring.heartbeatCount,
            lastHeartbeatAt: monitoring.lastHeartbeatAt,
            lastSeenAt: monitoring.lastSeenAt,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Live Dashboard
    |--------------------------------------------------------------------------
    */
    async dashboard(examId: string) {
        const [total, low, medium, high, critical] = await Promise.all([
            liveMonitoringRepository.count(examId),
            liveMonitoringRepository.countByRisk(RiskLevel.LOW, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.MEDIUM, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.HIGH, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.CRITICAL, examId),
        ]);

        return {
            total,
            lowRisk: low,
            mediumRisk: medium,
            highRisk: high,
            criticalRisk: critical,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Observer Dashboard
    |--------------------------------------------------------------------------
    */
    async observerDashboard(examId: string) {
        const sessions = await liveMonitoringRepository.findByExam(examId);
        return {
            totalCandidates: sessions.length,
            activeCandidates: sessions.filter(
                (item) => item.monitoringStatus === LiveMonitoringStatus.ACTIVE
            ).length,
            pausedCandidates: sessions.filter(
                (item) => item.monitoringStatus === LiveMonitoringStatus.PAUSED
            ).length,
            disconnectedCandidates: sessions.filter(
                (item) => item.connectionStatus === ConnectionStatus.DISCONNECTED
            ).length,
            criticalAlerts: sessions.filter(
                (item) => item.riskLevel === RiskLevel.CRITICAL
            ).length,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Command Center Dashboard
    |--------------------------------------------------------------------------
    */
  async commandCenterDashboard(examId: string) {
    const statistics = await this.statistics(examId);
    const observer = await this.observerDashboard(examId);
    return {
      ...statistics,
      ...observer,
    };
  }

    /*
    |--------------------------------------------------------------------------
    | Active Sessions
    |--------------------------------------------------------------------------
    */
    async activeSessions(examId: string) {
        const sessions = await liveMonitoringRepository.findByExam(examId);
        return sessions.filter((item) => item.monitoringStatus === LiveMonitoringStatus.ACTIVE);
    }

    /*
    |--------------------------------------------------------------------------
    | Critical Sessions
    |--------------------------------------------------------------------------
    */
    async criticalSessions(examId: string) {
        const sessions = await liveMonitoringRepository.findByExam(examId);
        return sessions.filter((item) => item.riskLevel === RiskLevel.CRITICAL);
    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */
    async statistics(examId?: string) {
        const [total, low, medium, high, critical] = await Promise.all([
            liveMonitoringRepository.count(examId),
            liveMonitoringRepository.countByRisk(RiskLevel.LOW, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.MEDIUM, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.HIGH, examId),
            liveMonitoringRepository.countByRisk(RiskLevel.CRITICAL, examId),
        ]);

        return {
            total,
            lowRisk: low,
            mediumRisk: medium,
            highRisk: high,
            criticalRisk: critical,
            riskPercentage: {
                low: total ? Number(((low / total) * 100).toFixed(2)) : 0,
                medium: total ? Number(((medium / total) * 100).toFixed(2)) : 0,
                high: total ? Number(((high / total) * 100).toFixed(2)) : 0,
                critical: total ? Number(((critical / total) * 100).toFixed(2)) : 0,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Center Analytics
    |--------------------------------------------------------------------------
    */
  async centerAnalytics(examId: string) {
    return liveMonitoringRepository.centerAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Device Monitoring List
    |--------------------------------------------------------------------------
    */
    async deviceMonitoring(examId: string, centerId?: string, status?: string) {
        const sessions = await liveMonitoringRepository.deviceMonitoring(examId, centerId, status);

        return sessions.map((session: any) => ({
            candidateId: session.candidateId?._id || session.candidateId,
            candidateName: session.candidateId ? `${session.candidateId.firstName || ""} ${session.candidateId.lastName || ""}`.trim() : "Unknown",
            deviceId: session.deviceId || "Unknown",
            deviceName: session.operatingSystem ? `${session.operatingSystem} Device` : "Unknown",
            browser: session.browserName || "Unknown",
            os: session.operatingSystem || "Unknown",
            ipAddress: session.ipAddress || "Unknown",
            macAddress: "Unknown", 
            screenResolution: "Unknown", 
            battery: 100, 
            network: "Unknown", 
            status: session.connectionStatus,
            lastHeartbeat: session.lastHeartbeatAt,
        }));
    }

    /*
    |--------------------------------------------------------------------------
    | Room Analytics
    |--------------------------------------------------------------------------
    */
  async roomAnalytics(examId: string) {
    return liveMonitoringRepository.roomAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Device Analytics
    |--------------------------------------------------------------------------
    */
  async deviceAnalytics(examId: string) {
    return liveMonitoringRepository.deviceAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Browser Analytics
    |--------------------------------------------------------------------------
    */
  async browserAnalytics(examId: string) {
    return liveMonitoringRepository.browserAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Operating System Analytics
    |--------------------------------------------------------------------------
    */
  async operatingSystemAnalytics(examId: string) {
    return liveMonitoringRepository.operatingSystemAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Heartbeat Analytics
    |--------------------------------------------------------------------------
    */
  async heartbeatAnalytics(examId: string) {
    return liveMonitoringRepository.heartbeatAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Violation Analytics
    |--------------------------------------------------------------------------
    */
  async violationAnalytics(examId: string) {
    return liveMonitoringRepository.violationAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Risk Analytics
    |--------------------------------------------------------------------------
    */
  async riskAnalytics(examId: string) {
    return liveMonitoringRepository.riskAnalytics(examId);
  }

    /*
    |--------------------------------------------------------------------------
    | Enterprise Report
    |--------------------------------------------------------------------------
    */
    async monitoringReport(examId: string) {
        const [
            statistics,
            centers,
            rooms,
            devices,
            browsers,
            operatingSystems,
            heartbeat,
            violations,
            risks,
        ] = await Promise.all([
            this.statistics(examId),
            this.centerAnalytics(examId),
            this.roomAnalytics(examId),
            this.deviceAnalytics(examId),
            this.browserAnalytics(examId),
            this.operatingSystemAnalytics(examId),
            this.heartbeatAnalytics(examId),
            this.violationAnalytics(examId),
            this.riskAnalytics(examId),
        ]);

        return {
            statistics,
            centers,
            rooms,
            devices,
            browsers,
            operatingSystems,
            heartbeat,
            violations,
            risks,
            generatedAt: new Date(),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Update Monitoring Session
    |--------------------------------------------------------------------------
    */
    async update(id: string, payload: Partial<ILiveMonitoring>) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Live monitoring session not found.");
        }
        return liveMonitoringRepository.update(id, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */
    async delete(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Live monitoring session not found.");
        }
        return liveMonitoringRepository.softDelete(id);
    }

    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */
    async restore(id: string) {
        const monitoring = await liveMonitoringRepository.findDeletedById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Deleted monitoring session not found.");
        }
        return liveMonitoringRepository.restore(id);
    }

    /*
    |--------------------------------------------------------------------------
    | Force Disconnect
    |--------------------------------------------------------------------------
    */
    async forceDisconnect(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.update(id, {
            connectionStatus: ConnectionStatus.DISCONNECTED,
            monitoringStatus: LiveMonitoringStatus.TERMINATED,
            lastSeenAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Health Check
    |--------------------------------------------------------------------------
    */
    async healthCheck(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }

        const now = Date.now();
        const heartbeat = monitoring.lastHeartbeatAt ? monitoring.lastHeartbeatAt.getTime() : 0;
        const difference = Math.floor((now - heartbeat) / 1000);

        return {
            healthy: difference <= 30,
            connectionStatus: monitoring.connectionStatus,
            lastHeartbeatAt: monitoring.lastHeartbeatAt,
            secondsSinceHeartbeat: difference,
            monitoringStatus: monitoring.monitoringStatus,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Session Exists
    |--------------------------------------------------------------------------
    */
    async exists(attendanceId: string) {
        return liveMonitoringRepository.findByAttendance(attendanceId);
    }

    /*
    |--------------------------------------------------------------------------
    | Session Active
    |--------------------------------------------------------------------------
    */
    async isActive(attendanceId: string) {
        const monitoring = await liveMonitoringRepository.findByAttendance(attendanceId);
        if (!monitoring) {
            return false;
        }
        return monitoring.monitoringStatus === LiveMonitoringStatus.ACTIVE;
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Monitoring
    |--------------------------------------------------------------------------
    */
    async reset(id: string) {
        const monitoring = await liveMonitoringRepository.findById(id);
        if (!monitoring) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Monitoring session not found.");
        }
        return liveMonitoringRepository.update(id, {
            riskLevel: RiskLevel.LOW,
            tabSwitchCount: 0,
            fullscreenExitCount: 0,
            copyPasteCount: 0,
            devToolsOpenCount: 0,
            networkDisconnectCount: 0,
            heartbeatCount: 0,
            connectionStatus: ConnectionStatus.ONLINE,
            browserStatus: BrowserStatus.ACTIVE,
            fullscreenStatus: FullscreenStatus.ENTERED,
            monitoringStatus: LiveMonitoringStatus.ACTIVE,
            cameraStatus: CameraStatus.ACTIVE,
            microphoneStatus: MicrophoneStatus.ACTIVE,
            lastHeartbeatAt: new Date(),
            lastSeenAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Dashboard
    |--------------------------------------------------------------------------
    */

    async mockDashboard() {
        return {
            exam: {
                _id: "6888abcd1234567890abcdef",
                examTitle: "Java Full Stack Recruitment Exam",
                status: "RUNNING"
            },
            summary: {
                totalCandidates: 250,
                onlineCandidates: 243,
                offlineCandidates: 7,
                activeSessions: 243,
                violationsToday: 18
            },
            liveStatistics: {
                faceVerified: 242,
                webcamActive: 241,
                heartbeatActive: 243,
                fullscreenActive: 239
            },
            recentAlerts: [
                {
                    candidateId: "6887abcd1234567890abc001",
                    candidateName: "Rahul Sharma",
                    alertType: "TAB_SWITCH",
                    severity: "MEDIUM",
                    time: "2026-08-15T09:45:25.000Z"
                },
                {
                    candidateId: "6887abcd1234567890abc002",
                    candidateName: "Amit Patel",
                    alertType: "FACE_NOT_VISIBLE",
                    severity: "HIGH",
                    time: "2026-08-15T09:46:12.000Z"
                }
            ]
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Active Candidates
    |--------------------------------------------------------------------------
    */

    async mockActiveCandidates() {
        return {
            totalCandidates: 243,
            page: 1,
            limit: 20,
            candidates: [
                {
                    _id: "6887abcd1234567890abc001",
                    candidateName: "Rahul Sharma",
                    enrollmentNo: "EX20260001",
                    center: "Ahmedabad Center",
                    room: "Lab-1",
                    seatNumber: "A-15",
                    sessionStatus: "ACTIVE",
                    currentQuestion: 18,
                    remainingTime: 2715,
                    heartbeat: "ACTIVE",
                    webcam: "ACTIVE",
                    faceStatus: "VERIFIED",
                    violationCount: 2,
                    connectionStatus: "ONLINE",
                    lastHeartbeat: "2026-08-15T09:46:10.000Z"
                },
                {
                    _id: "6887abcd1234567890abc002",
                    candidateName: "Amit Patel",
                    enrollmentNo: "EX20260002",
                    center: "Ahmedabad Center",
                    room: "Lab-2",
                    seatNumber: "B-07",
                    sessionStatus: "ACTIVE",
                    currentQuestion: 22,
                    remainingTime: 2598,
                    heartbeat: "ACTIVE",
                    webcam: "ACTIVE",
                    faceStatus: "VERIFIED",
                    violationCount: 0,
                    connectionStatus: "ONLINE",
                    lastHeartbeat: "2026-08-15T09:46:12.000Z"
                }
            ]
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Candidate Status
    |--------------------------------------------------------------------------
    */

    async mockCandidateStatus(candidateId: string) {
        return {
            candidate: {
                _id: candidateId,
                candidateName: "Rahul Sharma",
                enrollmentNo: "EX20260001",
                center: "Ahmedabad Center",
                room: "Lab-1",
                seatNumber: "A-15"
            },
            session: {
                sessionId: "6899abcd1234567890abcdef",
                status: "ACTIVE",
                examStatus: "RUNNING",
                currentQuestion: 18,
                remainingTime: 2715,
                lastHeartbeat: "2026-08-15T09:46:10.000Z"
            },
            monitoring: {
                faceStatus: "VERIFIED",
                webcamStatus: "ACTIVE",
                microphoneStatus: "ACTIVE",
                fullscreenStatus: "ENABLED",
                tabStatus: "ACTIVE",
                internetStatus: "CONNECTED",
                networkLatency: 32
            },
            violations: {
                total: 2,
                latestViolation: "TAB_SWITCH",
                severity: "MEDIUM"
            }
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Candidate Details
    |--------------------------------------------------------------------------
    */

    async mockCandidateDetails(candidateId: string) {
        return {
            candidate: {
                _id: candidateId,
                candidateName: "Rahul Sharma",
                enrollmentNo: "EX20260001",
                email: "rahul.sharma@example.com",
                mobile: "9876543210",
                center: "Ahmedabad Center",
                room: "Lab-1",
                seatNumber: "A-15"
            },
            exam: {
                _id: "6888abcd1234567890abcdef",
                examTitle: "Java Full Stack Recruitment Exam",
                examCode: "EXAM-JAVA-001",
                status: "RUNNING"
            },
            session: {
                sessionId: "6899abcd1234567890abcdef",
                status: "ACTIVE",
                startedAt: "2026-08-15T09:30:00.000Z",
                remainingTime: 2715,
                currentQuestion: 18,
                answeredQuestions: 17,
                notAnsweredQuestions: 1
            },
            device: {
                deviceId: "DEVICE-12A34BC56",
                deviceName: "ASUS TUF F16",
                browser: "Chrome 138",
                operatingSystem: "Windows 11",
                ipAddress: "192.168.10.20"
            },
            location: {
                latitude: 23.022505,
                longitude: 72.571362,
                geoVerified: true
            },
            monitoring: {
                heartbeatStatus: "ACTIVE",
                webcamStatus: "ACTIVE",
                microphoneStatus: "ACTIVE",
                faceStatus: "VERIFIED",
                fullscreenStatus: "ENABLED",
                tabStatus: "ACTIVE",
                networkLatency: 32
            },
            violations: {
                totalViolations: 2,
                highSeverity: 0,
                mediumSeverity: 2,
                lowSeverity: 0
            },
            lastActivity: {
                lastHeartbeat: "2026-08-15T09:46:10.000Z",
                lastAnswerSaved: "2026-08-15T09:45:48.000Z",
                lastFaceDetection: "2026-08-15T09:46:08.000Z"
            }
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Webcam Snapshot
    |--------------------------------------------------------------------------
    */

    async mockWebcamSnapshot(candidateId: string) {
        return {
            candidate: {
                _id: candidateId,
                candidateName: "Rahul Sharma",
                enrollmentNo: "EX20260001"
            },
            sessionId: "6899abcd1234567890abcdef",
            snapshot: {
                imageUrl: "https://cdn.exam-saas.com/webcam/6899abcd1234567890abcdef/latest.jpg",
                capturedAt: "2026-08-15T09:46:18.000Z",
                cameraStatus: "ACTIVE",
                imageQuality: "HIGH",
                faceDetected: true,
                multipleFaces: false,
                faceMatchScore: 99.32,
                livenessPassed: true,
                monitoringStatus: "NORMAL"
            }
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Face Verification Logs
    |--------------------------------------------------------------------------
    */

    async mockFaceVerificationLogs(candidateId: string) {
        return {
            candidate: {
                _id: candidateId,
                candidateName: "Rahul Sharma",
                enrollmentNo: "EX20260001"
            },
            sessionId: "6899abcd1234567890abcdef",
            totalLogs: 5,
            logs: [
                {
                    _id: "6899face001",
                    capturedAt: "2026-08-15T09:35:12.000Z",
                    faceDetected: true,
                    multipleFaces: false,
                    faceMatchScore: 99.42,
                    livenessScore: 98.88,
                    confidenceScore: 99.15,
                    cameraStatus: "ACTIVE",
                    verificationStatus: "VERIFIED",
                    snapshotUrl: "https://cdn.exam-saas.com/face/6899face001.jpg"
                },
                {
                    _id: "6899face002",
                    capturedAt: "2026-08-15T10:02:48.000Z",
                    faceDetected: false,
                    multipleFaces: false,
                    faceMatchScore: 0,
                    livenessScore: 0,
                    confidenceScore: 0,
                    cameraStatus: "ACTIVE",
                    verificationStatus: "FACE_NOT_VISIBLE",
                    snapshotUrl: "https://cdn.exam-saas.com/face/6899face002.jpg"
                },
                {
                    _id: "6899face003",
                    capturedAt: "2026-08-15T10:18:21.000Z",
                    faceDetected: true,
                    multipleFaces: false,
                    faceMatchScore: 99.11,
                    livenessScore: 98.57,
                    confidenceScore: 98.96,
                    cameraStatus: "ACTIVE",
                    verificationStatus: "VERIFIED",
                    snapshotUrl: "https://cdn.exam-saas.com/face/6899face003.jpg"
                }
            ]
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Live Violations
    |--------------------------------------------------------------------------
    */

    async mockLiveViolations() {
        return {
            totalViolations: 18,
            criticalViolations: 2,
            highViolations: 5,
            mediumViolations: 8,
            lowViolations: 3,
            violations: [
                {
                    _id: "6899vio001",
                    candidate: {
                        _id: "6887abcd1234567890abc001",
                        candidateName: "Rahul Sharma",
                        enrollmentNo: "EX20260001"
                    },
                    exam: {
                        _id: "6888abcd1234567890abcdef",
                        examCode: "EXAM-JAVA-001"
                    },
                    violationType: "TAB_SWITCH",
                    severity: "MEDIUM",
                    count: 2,
                    detectedBy: "AI_MONITOR",
                    snapshotUrl: "https://cdn.exam-saas.com/violations/tab-switch-001.jpg",
                    actionTaken: "WARNING_SENT",
                    observerReviewed: false,
                    autoSubmitted: false,
                    detectedAt: "2026-08-15T09:45:25.000Z"
                },
                {
                    _id: "6899vio002",
                    candidate: {
                        _id: "6887abcd1234567890abc008",
                        candidateName: "Neha Patel",
                        enrollmentNo: "EX20260008"
                    },
                    exam: {
                        _id: "6888abcd1234567890abcdef",
                        examCode: "EXAM-JAVA-001"
                    },
                    violationType: "MULTIPLE_FACES",
                    severity: "CRITICAL",
                    count: 1,
                    detectedBy: "FACE_AI",
                    snapshotUrl: "https://cdn.exam-saas.com/violations/multi-face-001.jpg",
                    actionTaken: "PROCTOR_ALERT",
                    observerReviewed: false,
                    autoSubmitted: false,
                    detectedAt: "2026-08-15T09:47:11.000Z"
                }
            ]
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Mock Heartbeat Monitor
    |--------------------------------------------------------------------------
    */

    async mockHeartbeatMonitor() {
        return {
            summary: {
                totalSessions: 243,
                active: 239,
                warning: 2,
                offline: 1,
                disconnected: 1
            },
            heartbeatLogs: [
                {
                    candidate: {
                        _id: "6887abcd1234567890abc001",
                        candidateName: "Rahul Sharma",
                        enrollmentNo: "EX20260001"
                    },
                    sessionId: "6899abcd1234567890abcdef",
                    status: "ACTIVE",
                    lastHeartbeat: "2026-08-15T09:46:10.000Z",
                    nextHeartbeat: "2026-08-15T09:46:30.000Z",
                    latency: 34,
                    connectionQuality: "GOOD",
                    heartbeatDelay: 0,
                    autoSubmitEligible: false
                },
                {
                    candidate: {
                        _id: "6887abcd1234567890abc021",
                        candidateName: "Riya Shah",
                        enrollmentNo: "EX20260021"
                    },
                    sessionId: "6899abcd1234567890abc021",
                    status: "WARNING",
                    lastHeartbeat: "2026-08-15T09:45:02.000Z",
                    nextHeartbeat: "2026-08-15T09:45:22.000Z",
                    latency: 245,
                    connectionQuality: "POOR",
                    heartbeatDelay: 18,
                    autoSubmitEligible: false
                }
            ]
        };
    }
}

export default new LiveMonitoringService();
