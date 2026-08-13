/*
|--------------------------------------------------------------------------
| Candidate Events
|--------------------------------------------------------------------------
*/

export const LiveMonitoringCandidateEvents = {
  JOIN_EXAM: "live:join-exam",

  LEAVE_EXAM: "live:leave-exam",

  HEARTBEAT: "live:heartbeat",

  CAMERA_STATUS: "live:camera-status",

  MICROPHONE_STATUS: "live:microphone-status",

  CONNECTION_STATUS: "live:connection-status",

  BROWSER_STATUS: "live:browser-status",

  FULLSCREEN_STATUS: "live:fullscreen-status",

  TAB_SWITCH: "live:tab-switch",

  COPY_PASTE: "live:copy-paste",

  DEVTOOLS_OPEN: "live:devtools-open",

  NETWORK_DISCONNECTED: "live:network-disconnected",

  NETWORK_RECONNECTED: "live:network-reconnected",

  LOCATION_UPDATE: "live:location-update",
} as const;

/*
|--------------------------------------------------------------------------
| Observer Events
|--------------------------------------------------------------------------
*/

export const LiveMonitoringObserverEvents = {
  JOIN_ROOM: "observer:join-room",

  LEAVE_ROOM: "observer:leave-room",

  WATCH_CANDIDATE: "observer:watch-candidate",
} as const;

/*
|--------------------------------------------------------------------------
| Admin Events
|--------------------------------------------------------------------------
*/

export const LiveMonitoringAdminEvents = {
  FORCE_DISCONNECT: "admin:force-disconnect",

  PAUSE_MONITORING: "admin:pause-monitoring",

  RESUME_MONITORING: "admin:resume-monitoring",

  TERMINATE_MONITORING: "admin:terminate-monitoring",

  RESET_MONITORING: "admin:reset-monitoring",
} as const;

/*
|--------------------------------------------------------------------------
| Server Broadcast Events
|--------------------------------------------------------------------------
*/

export const LiveMonitoringServerEvents = {
  DASHBOARD_UPDATED: "server:dashboard-updated",

  HEARTBEAT_UPDATED: "server:heartbeat-updated",

  CANDIDATE_UPDATED: "server:candidate-updated",

  ROOM_UPDATED: "server:room-updated",

  CENTER_UPDATED: "server:center-updated",

  EXAM_UPDATED: "server:exam-updated",

  RISK_UPDATED: "server:risk-updated",

  VIOLATION_CREATED: "server:violation-created",

  SYSTEM_ALERT: "server:system-alert",
} as const;

/*
|--------------------------------------------------------------------------
| Socket Rooms
|--------------------------------------------------------------------------
*/

export const SocketRooms = {
  EXAM: "exam",

  CENTER: "center",

  ROOM: "room",

  CANDIDATE: "candidate",

  OBSERVER: "observer",

  ADMIN: "admin",

} as const;

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

export const getExamRoom = (examId: string) => `${SocketRooms.EXAM}:${examId}`;

export const getCenterRoom = (centerId: string) =>
  `${SocketRooms.CENTER}:${centerId}`;

export const getRoomRoom = (roomId: string) => `${SocketRooms.ROOM}:${roomId}`;

export const getCandidateRoom = (candidateId: string) =>
  `${SocketRooms.CANDIDATE}:${candidateId}`;

export const getObserverRoom = (examId: string) =>
  `${SocketRooms.OBSERVER}:${examId}`;

export const getAdminRoom = () => SocketRooms.ADMIN;

