/*
|--------------------------------------------------------------------------
| Socket Room
|--------------------------------------------------------------------------
*/

export enum SocketRoom {
  GLOBAL = "GLOBAL",

  COMPANY = "COMPANY",

  BRANCH = "BRANCH",

  CENTER = "CENTER",

  EXAM = "EXAM",

  CANDIDATE = "CANDIDATE",

  ADMIN = "ADMIN",

  OBSERVER = "OBSERVER",
}

/*
|--------------------------------------------------------------------------
| Socket Event
|--------------------------------------------------------------------------
*/

export enum SocketEvent {
  CONNECT = "CONNECT",

  DISCONNECT = "DISCONNECT",

  HEARTBEAT = "HEARTBEAT",

  JOIN_ROOM = "JOIN_ROOM",

  LEAVE_ROOM = "LEAVE_ROOM",

  LIVE_MONITORING = "LIVE_MONITORING",

  EXAM_STARTED = "EXAM_STARTED",

  EXAM_ENDED = "EXAM_ENDED",

  EXAM_SUBMITTED = "EXAM_SUBMITTED",

  ANSWER_SAVED = "ANSWER_SAVED",

  TIMER_SYNC = "TIMER_SYNC",

  TAB_SWITCH = "TAB_SWITCH",

  FULLSCREEN_EXIT = "FULLSCREEN_EXIT",

  FACE_DETECTED = "FACE_DETECTED",

  FACE_NOT_FOUND = "FACE_NOT_FOUND",

  MULTIPLE_FACE = "MULTIPLE_FACE",

  NETWORK_OFFLINE = "NETWORK_OFFLINE",

  NETWORK_ONLINE = "NETWORK_ONLINE",

  SCREEN_RECORDING = "SCREEN_RECORDING",

  COPY_PASTE = "COPY_PASTE",

  AUTO_SUBMIT = "AUTO_SUBMIT",

  CHAT = "CHAT",

  CHAT_MESSAGE = "CHAT_MESSAGE",

  NOTIFICATION = "NOTIFICATION",

  DASHBOARD = "DASHBOARD",

  RESULT_PUBLISHED = "RESULT_PUBLISHED",

  SYSTEM_ALERT = "SYSTEM_ALERT",
}

/*
|--------------------------------------------------------------------------
| Socket User
|--------------------------------------------------------------------------
*/

export interface ISocketUser {
  userId: string;

  role: string;

  companyId?: string;

  branchId?: string;

  centerId?: string;

  examId?: string;

  candidateId?: string;
}

/*
|--------------------------------------------------------------------------
| Socket Payload
|--------------------------------------------------------------------------
*/

export interface ISocketPayload {
  event: SocketEvent;

  room?: SocketRoom;

  data?: Record<string, unknown>;
}
