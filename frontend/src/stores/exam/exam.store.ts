import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '../persist/config';

interface ExamState {
  currentExamId: string | null;
  currentQuestionIndex: number;
  examProgress: Record<string, any>;
  examConfiguration: Record<string, any>;
  
  startExam: (examId: string, config: any) => void;
  setQuestionIndex: (index: number) => void;
  updateProgress: (progress: any) => void;
  endExam: () => void;
  exams: any[];
  fetchExams: () => Promise<void>;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      currentExamId: null,
      currentQuestionIndex: 0,
      examProgress: {},
      examConfiguration: {},
      
      startExam: (examId, config) => set({ 
        currentExamId: examId, 
        examConfiguration: config,
        currentQuestionIndex: 0,
        examProgress: {}
      }),
      setQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      updateProgress: (progress) => set((state) => ({ 
        examProgress: { ...state.examProgress, ...progress } 
      })),
      endExam: () => set({ 
        currentExamId: null, 
        currentQuestionIndex: 0, 
        examProgress: {}, 
        examConfiguration: {} 
      }),
      exams: [],
      fetchExams: async () => {
        try {
          const api = (await import('@/services/api')).default;
          const response = await api.get('/exams');
          if (response.data.success) {
            const data = response.data.data;
            set({ exams: Array.isArray(data) ? data : (data.exams || []) });
          }
        } catch (error) {
          console.error('Failed to fetch exams', error);
        }
      },
    }),
    createPersistConfig('exam-session')
  )
);
