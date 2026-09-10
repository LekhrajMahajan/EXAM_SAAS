export enum EntityTrustType {
  CANDIDATE = "CANDIDATE",
  CENTER = "CENTER",
  OBSERVER = "OBSERVER",
}

export enum FraudRating {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface IViolationBreakdown {
  tabSwitches: number;
  fullscreenExits: number;
  copyPastes: number;
  devToolsOpens: number;
  networkDisconnects: number;
  faceMismatches: number;
  spoofDetections: number;
}

export interface ITrustScore {
  entityType: EntityTrustType;
  entityId: string;
  examId: string;
  score: number; // 0-100
  violationBreakdown: IViolationBreakdown;
  fraudRating: FraudRating;
  calculatedAt: Date;
}
