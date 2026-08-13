import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';

export interface ExamStaffAssignment {
  id?: string;
  _id?: string;
  examId: string;
  examName: string;
  reportingTime?: string;
  examStartDate?: string;
  examEndDate?: string;
  assignments: {
    role: string;
    staffId: string;
    staffName: string;
    staffEmail?: string;
  }[];
  createdAt: string;
}

export interface AssignExamStaffStoreState {
  assignmentsList: ExamStaffAssignment[];
  isLoading: boolean;
  fetchAssignments: (centerId: string) => Promise<void>;
  addAssignment: (centerId: string, assignment: Omit<ExamStaffAssignment, 'id' | 'createdAt' | '_id'>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
}

export const useAssignExamStaffStore = create<AssignExamStaffStoreState>()(
  (set) => ({
    assignmentsList: [],
    isLoading: false,
    fetchAssignments: async (centerId: string) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.get('/center-assign-exam-staff', { params: { centerId } });
        if (response.data && response.data.data) {
          // Map _id to id for frontend compatibility
          const formatted = response.data.data.map((item: any) => ({
            ...item,
            id: item._id,
            examId: item.examId?._id || item.examId,
            examName: item.examName || item.examId?.title || 'Unknown Exam'
          }));
          set({ assignmentsList: formatted });
        }
      } catch (error) {
        console.error('Failed to fetch assignments', error);
      } finally {
        set({ isLoading: false });
      }
    },
    addAssignment: async (centerId, assignment) => {
      try {
        const payload = {
          centerId,
          examId: assignment.examId,
          examName: assignment.examName,
          reportingTime: assignment.reportingTime,
          // pass exam timing details directly to backend via assignment object if we added them to the interface
          examStartDate: (assignment as any).examStartDate,
          examEndDate: (assignment as any).examEndDate,
          assignments: assignment.assignments
        };
        const response = await apiClient.post('/center-assign-exam-staff', payload);
        if (response.data && response.data.data) {
          const newItem = {
            ...response.data.data,
            id: response.data.data._id
          };
          
          set((state) => {
            // Remove existing assignment for same exam if it exists (since our backend updates it)
            const filtered = state.assignmentsList.filter(a => a.examId !== assignment.examId);
            return {
              assignmentsList: [newItem, ...filtered]
            };
          });
        }
      } catch (error) {
        console.error('Failed to add assignment', error);
        throw error;
      }
    },
    deleteAssignment: async (id) => {
      try {
        await apiClient.delete(`/center-assign-exam-staff/${id}`);
        set((state) => ({
          assignmentsList: state.assignmentsList.filter(a => a.id !== id && a._id !== id)
        }));
      } catch (error) {
        console.error('Failed to delete assignment', error);
        throw error;
      }
    },
  })
);
