export type SubjectStatus = 'Active' | 'Inactive';
export type SubjectCategory = 'Competitive' | 'University' | 'School' | 'Recruitment' | 'Certification';

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  examType: string;
  language: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number;
  displayOrder: number;
  category: SubjectCategory;
  status: SubjectStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
