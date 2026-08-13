export enum GeoEntityType {
  CANDIDATE = "candidate",
  CENTER = "center",
  OBSERVER = "observer",
}

export interface IGeoMonitoring {
  entityType: GeoEntityType;
  entityId: string;
  examId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  recordedAt: Date;
  outOfGeofence: boolean;
}
