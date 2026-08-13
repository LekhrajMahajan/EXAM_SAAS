/*
|--------------------------------------------------------------------------
| Observer Status
|--------------------------------------------------------------------------
*/

export enum ObserverStatus {
  PENDING = "PENDING",

  ASSIGNED = "ASSIGNED",

  CHECKED_IN = "CHECKED_IN",

  ON_DUTY = "ON_DUTY",

  BREAK = "BREAK",

  CHECKED_OUT = "CHECKED_OUT",

  COMPLETED = "COMPLETED",

  CANCELLED = "CANCELLED",
}

/*
|--------------------------------------------------------------------------
| Observer Type
|--------------------------------------------------------------------------
*/

export enum ObserverType {
  CHIEF = "CHIEF",

  SENIOR = "SENIOR",

  ASSISTANT = "ASSISTANT",

  TECHNICAL = "TECHNICAL",

  FLYING_SQUAD = "FLYING_SQUAD",
}

/*
|--------------------------------------------------------------------------
| Incident Severity
|--------------------------------------------------------------------------
*/

export enum IncidentSeverity {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",

  CRITICAL = "CRITICAL",
}

/*
|--------------------------------------------------------------------------
| Incident Status
|--------------------------------------------------------------------------
*/

export enum IncidentStatus {
  OPEN = "OPEN",

  IN_PROGRESS = "IN_PROGRESS",

  RESOLVED = "RESOLVED",

  REJECTED = "REJECTED",
}

/*
|--------------------------------------------------------------------------
| Observer Assignment
|--------------------------------------------------------------------------
*/

export interface IObserverAssignment {
  observerId: string;

  shiftId: string;

  examId: string;

  centerId: string;

  assignedBy: string;

  assignedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Incident Report
|--------------------------------------------------------------------------
*/

export interface IIncidentReport {
  candidateId: string;

  examId: string;

  shiftId: string;

  centerId: string;

  severity: IncidentSeverity;

  title: string;

  description: string;

  attachment?: string;

  status: IncidentStatus;
}

/*
|--------------------------------------------------------------------------
| Observer Dashboard
|--------------------------------------------------------------------------
*/

export interface IObserverDashboard {
  totalObservers: number;

  activeObservers: number;

  completedShifts: number;

  incidentsReported: number;

  pendingIncidents: number;
}
