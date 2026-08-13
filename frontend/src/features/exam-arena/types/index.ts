export type QuestionStatus = 'Answered' | 'Not Answered' | 'Not Visited' | 'Marked for Review';
export type QuestionType = 'Single Choice' | 'Multiple Choice' | 'True/False' | 'Numerical';

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options?: ExamOption[];
  status: QuestionStatus;
}

export interface ExamSection {
  id: string;
  name: string;
  questions: ExamQuestion[];
}

export interface CandidateInfo {
  id: string;
  name: string;
  rollNumber: string;
  photoUrl?: string;
}

export interface ExamInfo {
  id: string;
  name: string;
  durationMinutes: number;
  totalQuestions: number;
}

export interface ExamState {
  currentSectionId: string;
  currentQuestionId: string;
  timeRemaining: number;
  status: 'In Progress' | 'Submitted' | 'Paused';
}
