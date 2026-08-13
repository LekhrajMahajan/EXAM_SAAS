export const SOCKET_EVENTS = {
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECTING: 'reconnecting',
  
  // Custom Ping/Pong
  HEARTBEAT: 'heartbeat',
  HEARTBEAT_ACK: 'heartbeat_ack',
  
  // Room Events
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',
  
  // Exam Events
  EXAM_START: 'exam:start',
  EXAM_SUBMIT: 'exam:submit',
  QUESTION_CHANGE: 'exam:question_change',
  TIMER_SYNC: 'exam:timer_sync',
  
  // Monitoring Events
  WARNING_ISSUED: 'monitor:warning',
  VIOLATION_DETECTED: 'monitor:violation',
  DEVICE_STATUS: 'monitor:device_status',
  
  // Presence Events
  USER_ONLINE: 'presence:online',
  USER_OFFLINE: 'presence:offline',
  
  // Notifications
  GLOBAL_BROADCAST: 'notification:broadcast',
  DIRECT_MESSAGE: 'notification:direct',
} as const;
