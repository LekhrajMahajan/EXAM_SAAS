import type { CandidateInfo, ExamInfo, ExamSection } from '../types';

export const DUMMY_CANDIDATE: CandidateInfo = {
  id: 'CAN-1001',
  name: 'John Doe',
  rollNumber: 'RL-2026-001',
  photoUrl: ''
};

export const DUMMY_EXAM: ExamInfo = {
  id: 'EXAM-101',
  name: 'Spring Admissions Test 2026',
  durationMinutes: 120,
  totalQuestions: 20
};

export const DUMMY_SECTIONS: ExamSection[] = [
  {
    id: 'SEC-1',
    name: 'General Knowledge',
    questions: Array.from({ length: 10 }).map((_, i) => ({
      id: `Q${i + 1}`,
      questionNumber: i + 1,
      type: 'Single Choice',
      text: `This is a sample question ${i + 1} for the General Knowledge section. What is the correct answer among the following options?`,
      status: i === 0 ? 'Not Answered' : i === 1 ? 'Answered' : i === 2 ? 'Marked for Review' : 'Not Visited',
      options: [
        { id: `O1`, text: 'Option A' },
        { id: `O2`, text: 'Option B' },
        { id: `O3`, text: 'Option C' },
        { id: `O4`, text: 'Option D' }
      ]
    }))
  },
  {
    id: 'SEC-2',
    name: 'Mathematics',
    questions: Array.from({ length: 10 }).map((_, i) => ({
      id: `Q${i + 11}`,
      questionNumber: i + 11,
      type: i % 2 === 0 ? 'Numerical' : 'Multiple Choice',
      text: `Solve the following mathematical problem ${i + 11}. Provide your reasoning if necessary.`,
      status: 'Not Visited',
      options: i % 2 !== 0 ? [
        { id: `O1`, text: 'Option W' },
        { id: `O2`, text: 'Option X' },
        { id: `O3`, text: 'Option Y' },
        { id: `O4`, text: 'Option Z' }
      ] : undefined
    }))
  }
];
