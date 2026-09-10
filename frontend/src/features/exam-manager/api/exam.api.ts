import { apiClient } from '@/core/api/http/axios-client';

export interface ExamListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface Exam {
  _id: string;
  examCode: string;
  examTitle: string;
  examType?: string;
  examMode?: string;
  examDate: string;
  shift?: string;
  examGroupId?: string | null;
  hasMultipleShifts?: boolean;
  normalizationEnabled?: boolean;
  normalizationMethod?: 'PERCENTILE' | 'MEAN_EQUATING';
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarks?: number;
  language?: string;
  difficulty?: string;
  instructions?: string;
  examCategory?: string;
  shuffleSubjects?: boolean;
  shuffleQuestions?: boolean;
  subjects?: { name: string; questions: number; marksPerQuestion?: number; negativeMarksPerQuestion?: number; sectionalCutoff?: number; timeAllottedMinutes?: number }[];
  cutoffType?: 'MARKS' | 'PERCENTAGE';
  overallQualifyingPercent?: number;
  sectionalCutoffEnabled?: boolean;
  sectionalTimeLimitEnabled?: boolean;
  partWiseCutoffEnabled?: boolean;
  parts?: { partName: string; subjectIds: string[]; cutoffType: 'MARKS' | 'PERCENTAGE'; cutoffValue: number }[];
  categoryWiseCutoff?: { category: string; cutoffPercent: number }[];
  rankType?: 'COMBINED' | 'CATEGORY_WISE';
  tieBreakRules?: { order: number; ruleType: 'HIGHER_MARKS' | 'HIGHER_PERCENTAGE' | 'MORE_CORRECT' | 'LOWER_NEGATIVE' | 'OLDER_AGE' | 'YOUNGER_AGE' | 'APPLICATION_NUMBER' }[];
  isMultiStage?: boolean;
  stageType?: 'QUALIFYING_ONLY' | 'SCORE_CARRIED_FORWARD';
  stageWeightagePercent?: number;
  linkedNextExamId?: string;
  resultDeclarationDate?: string;
  securitySettings?: {
    faceVerification?: boolean;
    faceDetectionEnabled?: boolean;
    faceDetectionLimit?: number;
    multipleFacesEnabled?: boolean;
    multipleFacesLimit?: number;
    proctoringWarningEnabled?: boolean;
    proctoringWarningLimit?: number;
    webcamMonitoring?: boolean;
    screenRecording?: boolean;
    screenSharingDetection?: boolean;
    tabSwitchingEnabled?: boolean;
    tabSwitchLimit?: number;
    browserLock?: boolean;
    fullScreenMode?: boolean;
    copyPasteAllowed?: boolean;
    rightClickDisabled?: boolean;
    developerToolsBlocked?: boolean;
    multipleLoginAllowed?: boolean;
    geoFence?: boolean;
    ipRestriction?: boolean;
    candidateHeartbeat?: boolean;
    autoSubmitOnViolation?: boolean;
  };
  status: string;
  displayStatus?: string;
  approvalStatus: string;
  isResultGenerated?: boolean;
  createdAt: string;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: {
    exams: Exam[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const examApi = {
  getAll: async (params?: ExamListParams) => {
    const response = await apiClient.get<ExamListResponse>('/exams', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Exam }>(`/exams/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Exam }>('/exams', data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await apiClient.patch<{ success: boolean; data: Exam }>(`/exams/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/exams/${id}`);
    return response.data;
  },
};
