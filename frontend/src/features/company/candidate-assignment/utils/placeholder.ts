import type { CandidateAssignment, AssignmentHistoryLog, CandidatePlaceholder } from '../types';

export const DUMMY_CANDIDATES: CandidatePlaceholder[] = [
  { id: 'C-001', name: 'John Doe', applicationNumber: 'APP-2026-001' },
  { id: 'C-002', name: 'Jane Smith', applicationNumber: 'APP-2026-002' },
  { id: 'C-003', name: 'Alice Johnson', applicationNumber: 'APP-2026-003' },
  { id: 'C-004', name: 'Bob Williams', applicationNumber: 'APP-2026-004' },
  { id: 'C-005', name: 'Charlie Brown', applicationNumber: 'APP-2026-005' },
];

export const DUMMY_ASSIGNMENTS: CandidateAssignment[] = [
  {
    id: 'A-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'John Doe',
    examId: 'EX-2026-SPRING',
    shiftId: 'SHIFT-M',
    centerId: 'CTR-NY-01',
    roomId: 'RM-101',
    seatNumber: 'S-12',
    status: 'Assigned',
    assignedDate: '2026-07-20',
  },
  {
    id: 'A-002',
    applicationNumber: 'APP-2026-002',
    candidateName: 'Jane Smith',
    examId: 'EX-2026-SPRING',
    shiftId: 'SHIFT-M',
    centerId: 'CTR-NY-01',
    roomId: 'RM-101',
    seatNumber: 'S-13',
    status: 'Assigned',
    assignedDate: '2026-07-20',
  },
  {
    id: 'A-003',
    applicationNumber: 'APP-2026-003',
    candidateName: 'Alice Johnson',
    examId: 'EX-2026-SPRING',
    shiftId: 'SHIFT-A',
    centerId: 'CTR-LA-02',
    roomId: 'RM-204',
    seatNumber: 'S-05',
    status: 'Pending',
    assignedDate: '2026-07-20',
  },
];

export const DUMMY_HISTORY: AssignmentHistoryLog[] = [
  {
    id: 'LOG-001',
    date: '2026-07-20T10:00:00Z',
    assignedBy: 'Admin User',
    examId: 'EX-2026-SPRING',
    shiftId: 'SHIFT-M',
    centerId: 'CTR-NY-01',
    totalAssigned: 150,
    status: 'Success',
  },
  {
    id: 'LOG-002',
    date: '2026-07-19T14:30:00Z',
    assignedBy: 'System Auto',
    examId: 'EX-2026-SPRING',
    shiftId: 'SHIFT-A',
    centerId: 'CTR-LA-02',
    totalAssigned: 200,
    status: 'Partial',
  },
];
