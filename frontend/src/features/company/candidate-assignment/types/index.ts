import { z } from 'zod';
import { 
  assignmentSelectionSchema, 
  candidateSelectionSchema, 
  roomAllocationSchema 
} from '../schemas/assignment-schemas';

export type AssignmentSelection = z.infer<typeof assignmentSelectionSchema>;
export type CandidateSelection = z.infer<typeof candidateSelectionSchema>;
export type RoomAllocation = z.infer<typeof roomAllocationSchema>;

export type AssignmentStatus = 'Assigned' | 'Pending' | 'Error';

export interface CandidateAssignment {
  id: string;
  applicationNumber: string;
  candidateName: string;
  examId: string;
  shiftId: string;
  centerId: string;
  roomId: string;
  seatNumber: string;
  status: AssignmentStatus;
  assignedDate: string;
}

export interface AssignmentHistoryLog {
  id: string;
  date: string;
  assignedBy: string;
  examId: string;
  shiftId: string;
  centerId: string;
  totalAssigned: number;
  status: 'Success' | 'Partial' | 'Failed';
}

export interface CandidatePlaceholder {
  id: string;
  name: string;
  applicationNumber: string;
}
