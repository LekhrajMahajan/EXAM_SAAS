export interface BaseEventPayload {
  timestamp: number;
  senderId?: string;
}

export interface ExamEventPayload extends BaseEventPayload {
  examId: string;
  candidateId: string;
}

export interface ViolationEventPayload extends ExamEventPayload {
  violationType: 'tab_switch' | 'multiple_faces' | 'no_face' | 'audio_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  snapshotUrl?: string;
}

export interface NotificationPayload extends BaseEventPayload {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
}
