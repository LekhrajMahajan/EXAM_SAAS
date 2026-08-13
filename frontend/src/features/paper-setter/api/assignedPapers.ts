import api from "@/services/api";

export interface AssignedPaper {
  _id: string;
  paperCode: string;
  paperName: string;
  subjectId: any;
  examId: any;
  approvalStatus: string;
  status: string;
  totalQuestions: number;
  assignedTo: string;
}

export const getAssignedPapers = async (): Promise<AssignedPaper[]> => {
  const response = await api.get("/papers/assigned");
  return response.data?.data?.papers || response.data?.data?.data || [];
};
