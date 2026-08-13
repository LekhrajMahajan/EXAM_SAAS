import type {
  OfflineExamStats, OfflineSession, AttendanceRecord, SeatAllocation,
  Invigilator, ExamMaterial, OmrBatch, EvaluationSheet, OfflineResult,
} from '../types';

export const DUMMY_OFFLINE_STATS: OfflineExamStats = {
  scheduledExams: 8,
  runningExams: 3,
  completedExams: 24,
  presentCandidates: 4820,
  absentCandidates: 380,
  omrPending: 1240,
  omrProcessed: 3580,
  evaluationPending: 420,
};

export const DUMMY_SESSIONS: OfflineSession[] = [
  { id: 'SES-001', sessionCode: 'SESS-2026-1020-AM', exam: 'SSC CGL 2026', subject: 'General Intelligence', center: 'Delhi Centre 01', branch: 'Delhi', date: '2026-10-20', shift: 'Morning', startTime: '10:00', endTime: '12:00', status: 'Running', totalCandidates: 420, presentCount: 398, roomCount: 8, invigilatorCount: 16 },
  { id: 'SES-002', sessionCode: 'SESS-2026-1020-PM', exam: 'SSC CGL 2026', subject: 'Quantitative Aptitude', center: 'Delhi Centre 01', branch: 'Delhi', date: '2026-10-20', shift: 'Afternoon', startTime: '14:00', endTime: '16:00', status: 'Scheduled', totalCandidates: 418, presentCount: 0, roomCount: 8, invigilatorCount: 16 },
  { id: 'SES-003', sessionCode: 'SESS-2026-1019-AM', exam: 'IBPS PO 2026', subject: 'Reasoning Ability', center: 'Mumbai Centre 02', branch: 'Mumbai', date: '2026-10-19', shift: 'Morning', startTime: '09:00', endTime: '11:00', status: 'Completed', totalCandidates: 360, presentCount: 341, roomCount: 7, invigilatorCount: 14 },
  { id: 'SES-004', sessionCode: 'SESS-2026-1019-PM', exam: 'IBPS PO 2026', subject: 'English Language', center: 'Mumbai Centre 02', branch: 'Mumbai', date: '2026-10-19', shift: 'Afternoon', startTime: '14:00', endTime: '16:00', status: 'Completed', totalCandidates: 360, presentCount: 339, roomCount: 7, invigilatorCount: 14 },
  { id: 'SES-005', sessionCode: 'SESS-2026-1021-AM', exam: 'RRB NTPC 2026', subject: 'General Awareness', center: 'Hyderabad Centre 03', branch: 'Hyderabad', date: '2026-10-21', shift: 'Morning', startTime: '10:00', endTime: '12:00', status: 'Scheduled', totalCandidates: 520, presentCount: 0, roomCount: 10, invigilatorCount: 20 },
];

export const DUMMY_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-001', sessionId: 'SES-001', candidateName: 'Ravi Kumar', rollNumber: 'SSC2026DL00412', applicationNumber: 'APP-2026-00412', room: 'Room 101', seatNumber: 'A-01', status: 'Present', markedAt: '2026-10-20 09:48:00', markedBy: 'Invigilator 1' },
  { id: 'ATT-002', sessionId: 'SES-001', candidateName: 'Priya Sharma', rollNumber: 'SSC2026DL00413', applicationNumber: 'APP-2026-00413', room: 'Room 101', seatNumber: 'A-02', status: 'Present', markedAt: '2026-10-20 09:52:00', markedBy: 'Invigilator 1' },
  { id: 'ATT-003', sessionId: 'SES-001', candidateName: 'Anil Verma', rollNumber: 'SSC2026DL00414', applicationNumber: 'APP-2026-00414', room: 'Room 102', seatNumber: 'B-01', status: 'Absent', markedAt: '2026-10-20 10:05:00', markedBy: 'Invigilator 2' },
  { id: 'ATT-004', sessionId: 'SES-001', candidateName: 'Sunita Rao', rollNumber: 'SSC2026DL00415', applicationNumber: 'APP-2026-00415', room: 'Room 102', seatNumber: 'B-02', status: 'Late', markedAt: '2026-10-20 10:18:00', markedBy: 'Invigilator 2' },
  { id: 'ATT-005', sessionId: 'SES-001', candidateName: 'Mohan Das', rollNumber: 'SSC2026DL00416', applicationNumber: 'APP-2026-00416', room: 'Room 103', seatNumber: 'C-01', status: 'Present', markedAt: '2026-10-20 09:44:00', markedBy: 'Invigilator 3' },
  { id: 'ATT-006', sessionId: 'SES-001', candidateName: 'Kavya Reddy', rollNumber: 'SSC2026DL00417', applicationNumber: 'APP-2026-00417', room: 'Room 103', seatNumber: 'C-02', status: 'Not Marked' },
];

export const DUMMY_SEATS: SeatAllocation[] = [
  { id: 'SEAT-001', sessionId: 'SES-001', building: 'Main Building', floor: 'Ground Floor', room: 'Room 101', benchNumber: 1, seatNumber: 'A-01', candidateName: 'Ravi Kumar', rollNumber: 'SSC2026DL00412', isOccupied: true },
  { id: 'SEAT-002', sessionId: 'SES-001', building: 'Main Building', floor: 'Ground Floor', room: 'Room 101', benchNumber: 1, seatNumber: 'A-02', candidateName: 'Priya Sharma', rollNumber: 'SSC2026DL00413', isOccupied: true },
  { id: 'SEAT-003', sessionId: 'SES-001', building: 'Main Building', floor: 'Ground Floor', room: 'Room 101', benchNumber: 2, seatNumber: 'B-01', candidateName: 'Anil Verma', rollNumber: 'SSC2026DL00414', isOccupied: false },
  { id: 'SEAT-004', sessionId: 'SES-001', building: 'Main Building', floor: 'Ground Floor', room: 'Room 101', benchNumber: 2, seatNumber: 'B-02', candidateName: 'Sunita Rao', rollNumber: 'SSC2026DL00415', isOccupied: true },
  { id: 'SEAT-005', sessionId: 'SES-001', building: 'Main Building', floor: '1st Floor', room: 'Room 102', benchNumber: 1, seatNumber: 'A-01', candidateName: 'Mohan Das', rollNumber: 'SSC2026DL00416', isOccupied: true },
  { id: 'SEAT-006', sessionId: 'SES-001', building: 'Main Building', floor: '1st Floor', room: 'Room 102', benchNumber: 1, seatNumber: 'A-02', candidateName: 'Kavya Reddy', rollNumber: 'SSC2026DL00417', isOccupied: false },
];

export const DUMMY_INVIGILATORS: Invigilator[] = [
  { id: 'INV-001', name: 'Dr. Rajesh Gupta', employeeId: 'EMP-1042', designation: 'Senior Invigilator', sessionId: 'SES-001', room: 'Room 101', dutyStatus: 'Present', reportTime: '09:00' },
  { id: 'INV-002', name: 'Ms. Anita Singh', employeeId: 'EMP-2031', designation: 'Invigilator', sessionId: 'SES-001', room: 'Room 102', dutyStatus: 'Present', reportTime: '09:00' },
  { id: 'INV-003', name: 'Mr. Suresh Kumar', employeeId: 'EMP-3014', designation: 'Invigilator', sessionId: 'SES-001', room: 'Room 103', dutyStatus: 'Absent', reportTime: '09:00' },
  { id: 'INV-004', name: 'Mrs. Deepa Patel', employeeId: 'EMP-4022', designation: 'Invigilator', sessionId: 'SES-001', room: 'Room 104', dutyStatus: 'Replaced', reportTime: '09:00' },
  { id: 'INV-005', name: 'Mr. Vivek Yadav', employeeId: 'EMP-5008', designation: 'Room Supervisor', sessionId: 'SES-002', room: 'Room 101', dutyStatus: 'Assigned', reportTime: '13:30' },
];

export const DUMMY_MATERIALS: ExamMaterial[] = [
  { id: 'MAT-001', sessionId: 'SES-001', materialType: 'Question Paper', totalQuantity: 420, distributedQuantity: 398, returnedQuantity: 0, status: 'Distributed' },
  { id: 'MAT-002', sessionId: 'SES-001', materialType: 'OMR Sheet', totalQuantity: 420, distributedQuantity: 398, returnedQuantity: 386, status: 'Partial Return' },
  { id: 'MAT-003', sessionId: 'SES-001', materialType: 'Answer Booklet', totalQuantity: 420, distributedQuantity: 398, returnedQuantity: 398, status: 'Returned' },
  { id: 'MAT-004', sessionId: 'SES-002', materialType: 'Question Paper', totalQuantity: 418, distributedQuantity: 0, returnedQuantity: 0, status: 'Pending Distribution' },
  { id: 'MAT-005', sessionId: 'SES-002', materialType: 'OMR Sheet', totalQuantity: 418, distributedQuantity: 0, returnedQuantity: 0, status: 'Pending Distribution' },
];

export const DUMMY_OMR_BATCHES: OmrBatch[] = [
  { id: 'OMR-001', batchCode: 'OMR-SESS1-B01', sessionId: 'SES-003', exam: 'IBPS PO 2026', totalSheets: 180, pendingSheets: 0, processedSheets: 178, rejectedSheets: 2, status: 'Processed', uploadedAt: '2026-10-19 13:00:00', processedAt: '2026-10-19 15:30:00' },
  { id: 'OMR-002', batchCode: 'OMR-SESS1-B02', sessionId: 'SES-003', exam: 'IBPS PO 2026', totalSheets: 161, pendingSheets: 0, processedSheets: 160, rejectedSheets: 1, status: 'Processed', uploadedAt: '2026-10-19 13:10:00', processedAt: '2026-10-19 15:45:00' },
  { id: 'OMR-003', batchCode: 'OMR-SESS2-B01', sessionId: 'SES-001', exam: 'SSC CGL 2026', totalSheets: 200, pendingSheets: 200, processedSheets: 0, rejectedSheets: 0, status: 'Pending' },
  { id: 'OMR-004', batchCode: 'OMR-SESS2-B02', sessionId: 'SES-001', exam: 'SSC CGL 2026', totalSheets: 198, pendingSheets: 80, processedSheets: 112, rejectedSheets: 6, status: 'Scanned', uploadedAt: '2026-10-20 12:30:00' },
];

export const DUMMY_EVALUATIONS: EvaluationSheet[] = [
  { id: 'EVAL-001', sessionId: 'SES-004', candidateName: 'Priya Sharma', rollNumber: 'IBPS2026MUM00413', subject: 'English Language', evaluatorName: 'Dr. Meera Joshi', marksObtained: 42, maxMarks: 60, status: 'Completed', evaluatedAt: '2026-10-20 10:00:00' },
  { id: 'EVAL-002', sessionId: 'SES-004', candidateName: 'Ravi Kumar', rollNumber: 'IBPS2026MUM00412', subject: 'English Language', evaluatorName: 'Dr. Meera Joshi', marksObtained: 38, maxMarks: 60, status: 'Reviewed', evaluatedAt: '2026-10-20 10:20:00' },
  { id: 'EVAL-003', sessionId: 'SES-004', candidateName: 'Anil Verma', rollNumber: 'IBPS2026MUM00414', subject: 'English Language', evaluatorName: 'Prof. K. Rao', status: 'In Progress', maxMarks: 60 },
  { id: 'EVAL-004', sessionId: 'SES-004', candidateName: 'Mohan Das', rollNumber: 'IBPS2026MUM00416', subject: 'English Language', evaluatorName: '', status: 'Pending', maxMarks: 60 },
];

export const DUMMY_OFFLINE_RESULTS: OfflineResult[] = [
  { id: 'RES-001', sessionId: 'SES-003', candidateName: 'Priya Sharma', rollNumber: 'IBPS2026MUM00413', exam: 'IBPS PO 2026', subject: 'Reasoning Ability', marksObtained: 38, maxMarks: 50, percentage: 76.0, grade: 'A', result: 'Pass' },
  { id: 'RES-002', sessionId: 'SES-003', candidateName: 'Ravi Kumar', rollNumber: 'IBPS2026MUM00412', exam: 'IBPS PO 2026', subject: 'Reasoning Ability', marksObtained: 29, maxMarks: 50, percentage: 58.0, grade: 'C', result: 'Pass' },
  { id: 'RES-003', sessionId: 'SES-003', candidateName: 'Anil Verma', rollNumber: 'IBPS2026MUM00414', exam: 'IBPS PO 2026', subject: 'Reasoning Ability', marksObtained: 0, maxMarks: 50, percentage: 0, grade: '-', result: 'Absent' },
  { id: 'RES-004', sessionId: 'SES-003', candidateName: 'Kavya Reddy', rollNumber: 'IBPS2026MUM00417', exam: 'IBPS PO 2026', subject: 'Reasoning Ability', marksObtained: 18, maxMarks: 50, percentage: 36.0, grade: 'F', result: 'Fail' },
];
