export type StaffStatus = 'Active' | 'Inactive' | 'On Leave' | 'Suspended';
export type DutyStatus = 'Assigned' | 'Accepted' | 'Declined' | 'Completed' | 'Missed';
export type AttendanceStatus = 'Checked In' | 'Checked Out' | 'Absent' | 'Pending';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved' | 'Closed';
export type ShiftType = 'Morning' | 'Afternoon' | 'Evening' | 'Custom';
export type ViolationAction = 'Warning' | 'Dismissed' | 'Debarred' | 'Under Review';
export type StaffRole = 'Observer' | 'Invigilator' | 'Center Superintendent' | 'Flying Squad';

export interface ObserverStats {
  totalObservers: number;
  totalInvigilators: number;
  todayDuties: number;
  presentStaff: number;
  absentStaff: number;
  activeIncidents: number;
  violationReports: number;
  completedDuties: number;
}

export interface StaffProfile {
  id: string;
  name: string;
  employeeId: string;
  role: StaffRole;
  email: string;
  phone: string;
  status: StaffStatus;
  assignedCenter?: string;
  assignedExams?: string[];
  totalDuties?: number;
  performanceScore?: number;
  rating?: number;
}

export interface DutyAllocation {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  exam: string;
  center: string;
  building?: string;
  floor?: string;
  room?: string;
  shift: ShiftType;
  date: string;
  status: DutyStatus;
}

export interface DutyAttendance {
  id: string;
  dutyId: string;
  staffId: string;
  staffName: string;
  date: string;
  shift: ShiftType;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  location?: string;
}

export interface IncidentReport {
  id: string;
  incidentNumber: string;
  category: string;
  severity: IncidentSeverity;
  description: string;
  reportedBy: string; // Staff Name
  reportedAt: string;
  center: string;
  room?: string;
  status: IncidentStatus;
  hasAttachment: boolean;
}

export interface ViolationReport {
  id: string;
  reportNumber: string;
  candidateName: string;
  candidateRollNo: string;
  violationType: string;
  reportedBy: string;
  reportedAt: string;
  center: string;
  room: string;
  actionTaken: ViolationAction;
  remarks?: string;
}

export interface RoomAssignment {
  id: string;
  center: string;
  building: string;
  room: string;
  capacity: number;
  assignedStaff: { name: string; role: StaffRole }[];
  shift: ShiftType;
  date: string;
}

export interface ShiftInfo {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  isActive: boolean;
}

export interface StaffPerformance {
  id: string;
  staffName: string;
  role: StaffRole;
  dutiesAssigned: number;
  dutiesCompleted: number;
  attendanceRate: number; // Percentage
  incidentsReported: number;
  incidentsResolved: number;
  overallScore: number; // out of 10
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string; // e.g., 'Login', 'Duty Started'
  staffName: string;
  role: StaffRole;
  details: string;
}
