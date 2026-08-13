export type QuestionType = 
  | 'Single Choice (MCQ)' 
  | 'Multiple Choice (MSQ)' 
  | 'True / False' 
  | 'Fill in the Blank' 
  | 'Numerical' 
  | 'Descriptive';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type QuestionStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Rejected';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionMetadata {
  keywords: string[];
  tags: string[];
  bloomsLevel: string;
  cognitiveLevel: string;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  chapter: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  language: string;
  questionText: string;
  options: QuestionOption[];
  explanation: string;
  marks: number;
  negativeMarks: number;
  timeLimitSeconds?: number;
  metadata: QuestionMetadata;
  status: QuestionStatus;
  approvalStatus: ApprovalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
