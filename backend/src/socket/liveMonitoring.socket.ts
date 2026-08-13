import { Server, Socket } from "socket.io";
import liveMonitoringService from "../modules/live-monitoring/liveMonitoring.service";
import {
    LiveMonitoringCandidateEvents,
    LiveMonitoringObserverEvents,
    LiveMonitoringAdminEvents,
    LiveMonitoringServerEvents,
    getCandidateRoom,
    getExamRoom,
    getObserverRoom,
} from "./liveMonitoring.events";
import {
    CameraStatus,
    MicrophoneStatus,
    BrowserStatus,
    FullscreenStatus,
    ConnectionStatus,
} from "../modules/live-monitoring/liveMonitoring.types";

interface JoinExamPayload {
    monitoringId: string;
    candidateId: string;
    examId: string;
}

interface HeartbeatPayload {
    monitoringId: string;
}

export const initializeLiveMonitoringSocket = (io: Server, socket: Socket) => {
    /*
    |--------------------------------------------------------------------------
    | Helper to broadcast dashboard updates
    |--------------------------------------------------------------------------
    */
    const broadcastDashboardUpdate = async (examId: string, monitoring: any) => {
        if (!monitoring) return;
        io.to(getObserverRoom(examId)).emit(
            LiveMonitoringServerEvents.CANDIDATE_UPDATED,
            monitoring
        );
        // Also emit to dashboard update if you have one specifically
        try {
            const dashboardData = await liveMonitoringService.commandCenterDashboard(examId);
            io.to(getObserverRoom(examId)).emit(
                LiveMonitoringServerEvents.DASHBOARD_UPDATED,
                dashboardData
            );
        } catch (err) {
            // Silently fail if dashboard stats fail to compute
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Candidate Join / Leave
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringCandidateEvents.JOIN_EXAM, async (payload: JoinExamPayload) => {
        try {
            const candidateRoom = getCandidateRoom(payload.candidateId);
            const examRoom = getExamRoom(payload.examId);
            
            socket.join(candidateRoom);
            socket.join(examRoom);

            const monitoring = await liveMonitoringService.getById(payload.monitoringId);
            await broadcastDashboardUpdate(payload.examId, monitoring);
        } catch (error) {
            socket.emit("socket:error", {
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.LEAVE_EXAM, async (payload: JoinExamPayload) => {
        socket.leave(getCandidateRoom(payload.candidateId));
        socket.leave(getExamRoom(payload.examId));
    });

    /*
    |--------------------------------------------------------------------------
    | Observer Join / Leave
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringObserverEvents.JOIN_ROOM, (examId: string) => {
        socket.join(getObserverRoom(examId));
    });

    socket.on(LiveMonitoringObserverEvents.LEAVE_ROOM, (examId: string) => {
        socket.leave(getObserverRoom(examId));
    });

    socket.on(LiveMonitoringObserverEvents.WATCH_CANDIDATE, (candidateId: string) => {
        socket.join(getCandidateRoom(candidateId));
    });

    /*
    |--------------------------------------------------------------------------
    | Heartbeat
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringCandidateEvents.HEARTBEAT, async (payload: HeartbeatPayload) => {
        try {
            const monitoring = await liveMonitoringService.heartbeat(payload.monitoringId);
            if (monitoring) {
                io.to(socket.id).emit(LiveMonitoringServerEvents.HEARTBEAT_UPDATED, monitoring);
            }
        } catch (error) {
            socket.emit("socket:error", {
                message: error instanceof Error ? error.message : "Heartbeat failed",
            });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Hardware / Browser Status Updates
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringCandidateEvents.CAMERA_STATUS, async (payload: { monitoringId: string; cameraStatus: CameraStatus }) => {
        try {
            const monitoring = await liveMonitoringService.updateCameraStatus(payload.monitoringId, payload.cameraStatus);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Update failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.MICROPHONE_STATUS, async (payload: { monitoringId: string; microphoneStatus: MicrophoneStatus }) => {
        try {
            const monitoring = await liveMonitoringService.updateMicrophoneStatus(payload.monitoringId, payload.microphoneStatus);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Update failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.BROWSER_STATUS, async (payload: { monitoringId: string; browserStatus: BrowserStatus }) => {
        try {
            const monitoring = await liveMonitoringService.updateBrowserStatus(payload.monitoringId, payload.browserStatus);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Update failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.FULLSCREEN_STATUS, async (payload: { monitoringId: string; fullscreenStatus: FullscreenStatus }) => {
        try {
            const monitoring = await liveMonitoringService.updateFullscreenStatus(payload.monitoringId, payload.fullscreenStatus);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Update failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.CONNECTION_STATUS, async (payload: { monitoringId: string; connectionStatus: ConnectionStatus }) => {
        try {
            const monitoring = await liveMonitoringService.updateConnectionStatus(payload.monitoringId, payload.connectionStatus);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Update failed." });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Network Disconnected / Reconnected
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringCandidateEvents.NETWORK_DISCONNECTED, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.networkDisconnected(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Disconnect update failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.NETWORK_RECONNECTED, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.networkReconnected(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Reconnect update failed." });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Proctoring Violations
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringCandidateEvents.TAB_SWITCH, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.tabSwitch(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Violation logged failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.COPY_PASTE, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.copyPaste(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Violation logged failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.DEVTOOLS_OPEN, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.devToolsOpened(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Violation logged failed." });
        }
    });

    socket.on(LiveMonitoringCandidateEvents.LOCATION_UPDATE, (payload: { monitoringId: string; location: any }) => {
        // Location update logic could go here if implemented in the service
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Actions
    |--------------------------------------------------------------------------
    */
    socket.on(LiveMonitoringAdminEvents.FORCE_DISCONNECT, async (payload: { monitoringId: string; examId: string; candidateId: string }) => {
        try {
            // Emitting custom event to the candidate's personal room so their client handles the disconnect logic
            io.to(getCandidateRoom(payload.candidateId)).emit("admin:force-disconnect-action");
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Failed to force disconnect." });
        }
    });

    socket.on(LiveMonitoringAdminEvents.PAUSE_MONITORING, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.pauseMonitoring(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Pause failed." });
        }
    });

    socket.on(LiveMonitoringAdminEvents.RESUME_MONITORING, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.resumeMonitoring(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Resume failed." });
        }
    });

    socket.on(LiveMonitoringAdminEvents.TERMINATE_MONITORING, async (monitoringId: string) => {
        try {
            const monitoring = await liveMonitoringService.terminateMonitoring(monitoringId);
            if (monitoring) await broadcastDashboardUpdate(monitoring.examId.toString(), monitoring);
        } catch (error) {
            socket.emit("socket:error", { message: error instanceof Error ? error.message : "Terminate failed." });
        }
    });

    socket.on(LiveMonitoringAdminEvents.RESET_MONITORING, async (monitoringId: string) => {
        // Handle reset logic if needed
    });


};
