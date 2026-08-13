import type {
  ObserverStats, StaffProfile, DutyAllocation, DutyAttendance,
  IncidentReport, ViolationReport, RoomAssignment, ShiftInfo,
  StaffPerformance, ActivityLog
} from '../types';

export const DUMMY_OBSERVER_STATS: ObserverStats = {
  totalObservers: 45,
  totalInvigilators: 1250,
  todayDuties: 420,
  presentStaff: 405,
  absentStaff: 15,
  activeIncidents: 3,
  violationReports: 8,
  completedDuties: 312,
};

export const DUMMY_STAFF: StaffProfile[] = [
  { id: 'STF-001', name: 'Dr. Ramesh Kumar', employeeId: 'OBS-1001', role: 'Observer', email: 'ramesh@example.com', phone: '+91 9876543210', status: 'Active', assignedCenter: 'Delhi Centre 01', assignedExams: ['SSC CGL 2026', 'IBPS PO 2026'], totalDuties: 45, performanceScore: 9.2, rating: 4.8 },
  { id: 'STF-002', name: 'Dr. Sunita Sharma', employeeId: 'OBS-1002', role: 'Observer', email: 'sunita@example.com', phone: '+91 9876543211', status: 'Active', assignedCenter: 'Mumbai Centre 02', assignedExams: ['IBPS PO 2026'], totalDuties: 32, performanceScore: 8.9, rating: 4.5 },
  { id: 'STF-003', name: 'Mr. Anil Verma', employeeId: 'INV-2001', role: 'Invigilator', email: 'anil@example.com', phone: '+91 9876543212', status: 'Active', assignedCenter: 'Delhi Centre 01', totalDuties: 120, performanceScore: 9.5, rating: 4.9 },
  { id: 'STF-004', name: 'Ms. Priya Patel', employeeId: 'INV-2002', role: 'Invigilator', email: 'priya@example.com', phone: '+91 9876543213', status: 'On Leave', totalDuties: 85, performanceScore: 8.5, rating: 4.2 },
  { id: 'STF-005', name: 'Mr. Vikram Singh', employeeId: 'INV-2003', role: 'Invigilator', email: 'vikram@example.com', phone: '+91 9876543214', status: 'Active', assignedCenter: 'Mumbai Centre 02', totalDuties: 56, performanceScore: 7.8, rating: 3.9 },
];

export const DUMMY_DUTIES: DutyAllocation[] = [
  { id: 'DUTY-001', staffId: 'STF-001', staffName: 'Dr. Ramesh Kumar', role: 'Observer', exam: 'SSC CGL 2026', center: 'Delhi Centre 01', shift: 'Morning', date: '2026-10-20', status: 'Accepted' },
  { id: 'DUTY-002', staffId: 'STF-003', staffName: 'Mr. Anil Verma', role: 'Invigilator', exam: 'SSC CGL 2026', center: 'Delhi Centre 01', building: 'Main Block', floor: '1st Floor', room: 'Room 101', shift: 'Morning', date: '2026-10-20', status: 'Completed' },
  { id: 'DUTY-003', staffId: 'STF-005', staffName: 'Mr. Vikram Singh', role: 'Invigilator', exam: 'IBPS PO 2026', center: 'Mumbai Centre 02', building: 'North Wing', floor: 'Ground Floor', room: 'Room 004', shift: 'Afternoon', date: '2026-10-20', status: 'Assigned' },
  { id: 'DUTY-004', staffId: 'STF-002', staffName: 'Dr. Sunita Sharma', role: 'Observer', exam: 'IBPS PO 2026', center: 'Mumbai Centre 02', shift: 'Afternoon', date: '2026-10-20', status: 'Declined' },
];

export const DUMMY_ATTENDANCE: DutyAttendance[] = [
  { id: 'ATT-001', dutyId: 'DUTY-001', staffId: 'STF-001', staffName: 'Dr. Ramesh Kumar', date: '2026-10-20', shift: 'Morning', status: 'Checked In', checkInTime: '08:15 AM', location: 'Delhi Centre 01 Main Gate' },
  { id: 'ATT-002', dutyId: 'DUTY-002', staffId: 'STF-003', staffName: 'Mr. Anil Verma', date: '2026-10-20', shift: 'Morning', status: 'Checked Out', checkInTime: '08:30 AM', checkOutTime: '01:00 PM', workingHours: 4.5, location: 'Room 101' },
  { id: 'ATT-003', dutyId: 'DUTY-003', staffId: 'STF-005', staffName: 'Mr. Vikram Singh', date: '2026-10-20', shift: 'Afternoon', status: 'Pending' },
  { id: 'ATT-004', dutyId: 'DUTY-006', staffId: 'STF-006', staffName: 'Mrs. Rekha Joshi', date: '2026-10-20', shift: 'Morning', status: 'Absent' },
];

export const DUMMY_INCIDENTS: IncidentReport[] = [
  { id: 'INC-001', incidentNumber: 'INC-2026-001', category: 'Technical Issue', severity: 'Medium', description: 'Biometric device offline in Room 101.', reportedBy: 'Mr. Anil Verma', reportedAt: '2026-10-20 09:15 AM', center: 'Delhi Centre 01', room: 'Room 101', status: 'Resolved', hasAttachment: false },
  { id: 'INC-002', incidentNumber: 'INC-2026-002', category: 'Medical Emergency', severity: 'Critical', description: 'Candidate fainted during exam.', reportedBy: 'Dr. Ramesh Kumar', reportedAt: '2026-10-20 10:45 AM', center: 'Delhi Centre 01', room: 'Room 104', status: 'Closed', hasAttachment: true },
  { id: 'INC-003', incidentNumber: 'INC-2026-003', category: 'Logistics', severity: 'Low', description: 'Shortage of rough sheets.', reportedBy: 'Mr. Vikram Singh', reportedAt: '2026-10-20 02:30 PM', center: 'Mumbai Centre 02', room: 'Room 004', status: 'Open', hasAttachment: false },
];

export const DUMMY_VIOLATIONS: ViolationReport[] = [
  { id: 'VIO-001', reportNumber: 'VIO-2026-001', candidateName: 'Rahul Dev', candidateRollNo: 'SSC00123', violationType: 'Mobile Phone Possession', reportedBy: 'Mr. Anil Verma', reportedAt: '2026-10-20 10:15 AM', center: 'Delhi Centre 01', room: 'Room 101', actionTaken: 'Debarred', remarks: 'Phone confiscated and candidate debarred.' },
  { id: 'VIO-002', reportNumber: 'VIO-2026-002', candidateName: 'Sanjay Kumar', candidateRollNo: 'IBPS00456', violationType: 'Talking to neighbour', reportedBy: 'Mr. Vikram Singh', reportedAt: '2026-10-20 03:20 PM', center: 'Mumbai Centre 02', room: 'Room 004', actionTaken: 'Warning', remarks: 'First warning given. Candidate relocated.' },
];

export const DUMMY_ROOMS: RoomAssignment[] = [
  { id: 'RM-001', center: 'Delhi Centre 01', building: 'Main Block', room: 'Room 101', capacity: 40, shift: 'Morning', date: '2026-10-20', assignedStaff: [{ name: 'Mr. Anil Verma', role: 'Invigilator' }, { name: 'Ms. Neha Gupta', role: 'Invigilator' }] },
  { id: 'RM-002', center: 'Delhi Centre 01', building: 'Main Block', room: 'Room 102', capacity: 60, shift: 'Morning', date: '2026-10-20', assignedStaff: [{ name: 'Mrs. Rekha Joshi', role: 'Invigilator' }, { name: 'Mr. Amit Shah', role: 'Invigilator' }] },
  { id: 'RM-003', center: 'Mumbai Centre 02', building: 'North Wing', room: 'Room 004', capacity: 30, shift: 'Afternoon', date: '2026-10-20', assignedStaff: [{ name: 'Mr. Vikram Singh', role: 'Invigilator' }] },
];

export const DUMMY_SHIFTS: ShiftInfo[] = [
  { id: 'SH-001', name: 'Morning Shift', type: 'Morning', startTime: '09:00 AM', endTime: '12:00 PM', bufferBeforeMinutes: 60, bufferAfterMinutes: 30, isActive: true },
  { id: 'SH-002', name: 'Afternoon Shift', type: 'Afternoon', startTime: '02:00 PM', endTime: '05:00 PM', bufferBeforeMinutes: 60, bufferAfterMinutes: 30, isActive: true },
  { id: 'SH-003', name: 'Evening Shift', type: 'Evening', startTime: '06:00 PM', endTime: '08:00 PM', bufferBeforeMinutes: 45, bufferAfterMinutes: 30, isActive: false },
];

export const DUMMY_PERFORMANCE: StaffPerformance[] = [
  { id: 'PERF-001', staffName: 'Dr. Ramesh Kumar', role: 'Observer', dutiesAssigned: 45, dutiesCompleted: 44, attendanceRate: 98.5, incidentsReported: 12, incidentsResolved: 12, overallScore: 9.2 },
  { id: 'PERF-002', staffName: 'Mr. Anil Verma', role: 'Invigilator', dutiesAssigned: 120, dutiesCompleted: 118, attendanceRate: 99.1, incidentsReported: 5, incidentsResolved: 5, overallScore: 9.5 },
  { id: 'PERF-003', staffName: 'Mr. Vikram Singh', role: 'Invigilator', dutiesAssigned: 56, dutiesCompleted: 50, attendanceRate: 92.0, incidentsReported: 2, incidentsResolved: 1, overallScore: 7.8 },
];

export const DUMMY_ACTIVITY: ActivityLog[] = [
  { id: 'ACT-001', timestamp: '2026-10-20 08:15:22', action: 'Login', staffName: 'Dr. Ramesh Kumar', role: 'Observer', details: 'Mobile App Login from IP 192.168.1.5' },
  { id: 'ACT-002', timestamp: '2026-10-20 08:30:00', action: 'Duty Started', staffName: 'Mr. Anil Verma', role: 'Invigilator', details: 'Checked in at Delhi Centre 01, Room 101' },
  { id: 'ACT-003', timestamp: '2026-10-20 09:15:10', action: 'Incident Created', staffName: 'Mr. Anil Verma', role: 'Invigilator', details: 'Reported Technical Issue: Biometric offline' },
  { id: 'ACT-004', timestamp: '2026-10-20 10:15:45', action: 'Violation Reported', staffName: 'Mr. Anil Verma', role: 'Invigilator', details: 'Reported violation for Roll No SSC00123' },
  { id: 'ACT-005', timestamp: '2026-10-20 13:00:05', action: 'Duty Completed', staffName: 'Mr. Anil Verma', role: 'Invigilator', details: 'Checked out from Delhi Centre 01, Room 101' },
];
