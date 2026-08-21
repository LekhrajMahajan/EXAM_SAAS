import React, { useEffect, useState } from "react";
import { getAssignedPapers, type AssignedPaper } from "../api/assignedPapers";
import { topicApi, type Topic } from "@/features/exam-manager/api/topic.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Loader2, FileText, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

function PaperSetCard({ paper, topics }: { paper: AssignedPaper; topics: Topic[] }) {
  const navigate = useNavigate();
  const [previewPaper, setPreviewPaper] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWorkspace = React.useCallback(async () => {
    try {
      const res = await api.get(`/papers/${paper._id}/preview`);
      if (res.data?.success) {
        setPreviewPaper(res.data.data.paper);
        setQuestions(res.data.data.questions || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch paper preview", err);
    } finally {
      setIsLoading(false);
    }
  }, [paper._id]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchWorkspace(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchWorkspace]);

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const confirmSubmitPaper = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/papers/${paper._id}/submit-for-approval`, { approvalStatus: "SUBMITTED" });
      clearAuth();
      navigate("/auth/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit paper set");
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT": return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
      case "SUBMITTED": return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" />Submitted</Badge>;
      case "APPROVED": return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const examSubjects = previewPaper?.examId?.subjects || (paper.examId as any)?.subjects || [];
  let totalRequired = 0;
  const totalAdded = questions.length;
  examSubjects.forEach((sub: any) => { totalRequired += sub.questions; });

  const isDraft = (previewPaper?.approvalStatus || paper.approvalStatus) === "DRAFT";
  const isComplete = totalAdded >= totalRequired && totalRequired > 0;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow flex flex-col overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="font-mono">{paper.paperCode}</Badge>
            {getStatusBadge(previewPaper?.approvalStatus || paper.approvalStatus)}
          </div>
          <CardTitle className="text-xl line-clamp-1">{paper.paperName}</CardTitle>
          <CardDescription className="line-clamp-2">
            {((paper.examId as any)?.examTitle || (paper.examId as any)?.examCode)
              ? `Exam: ${(paper.examId as any)?.examTitle || (paper.examId as any)?.examCode}`
              : "No Exam Linked"}
          </CardDescription>
          <div className="flex items-center justify-between mt-4 pt-2 border-t gap-4">
            <div className="text-sm font-medium whitespace-nowrap">
              {totalAdded} / {totalRequired || paper.totalQuestions} Questions Added
            </div>
            <div className="flex-1 text-right text-xs text-amber-500 font-medium px-2">
              Note: Submitting this paper will permanently disconnect your account and end your access.
            </div>
            <Button size="sm" disabled={!isDraft || !isComplete} onClick={() => setIsSubmitDialogOpen(true)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />Submit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 bg-card">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : examSubjects.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground text-sm">No subjects found for this exam.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
              {examSubjects.map((sub: any, i: number) => {
                const subjectQuestionsCount = questions.filter(
                  (q) => q.sectionCode?.toUpperCase() === sub.name?.toUpperCase()
                ).length;
                const isSubjectComplete = subjectQuestionsCount >= sub.questions;
                const subjectTopics = topics.filter(t =>
                  t.subjectId?.subjectName?.toLowerCase() === sub.name?.toLowerCase() ||
                  t.subjectName?.toLowerCase() === sub.name?.toLowerCase()
                );
                return (
                  <Card key={i} className="shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h4 className="font-medium line-clamp-1">{sub.name}</h4>
                      <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">
                        {subjectTopics.length} Topics
                      </Badge>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {subjectTopics.length > 0 ? (
                          subjectTopics.map(t => (
                            <Badge key={t._id} variant="secondary" className="font-normal px-2.5 py-1">
                              {t.topicName}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500 italic">No topics assigned</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 mt-auto flex items-center justify-between border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        {subjectQuestionsCount} / {sub.questions} Added
                      </p>
                      <Button
                        size="sm"
                        variant={isSubjectComplete ? "secondary" : "default"}
                        onClick={() => navigate(`/dashboard/paper-setter/workspace/${paper._id}/subject/${encodeURIComponent(sub.name)}`)}
                        disabled={!isDraft && !isSubjectComplete}
                      >
                        {isSubjectComplete ? "View" : "Add Questions"}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Paper Set</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this paper set? This action cannot be undone.
              Once submitted, your paper setter account session will permanently end and you will be logged out.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={confirmSubmitPaper} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AssignedPapersList() {
  const [papers, setPapers] = useState<AssignedPaper[]>([]);
  const [examTopicsMap, setExamTopicsMap] = useState<Record<string, Topic[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const papersData = await getAssignedPapers();
        if (papersData && papersData.length > 0) {
          setPapers(papersData);
          const topicsPerExam: Record<string, Topic[]> = {};
          await Promise.all(
            papersData.map(async (paper) => {
              const examId =
                (paper.examId as any)?._id?.toString() ||
                (paper.examId as any)?.toString();
              if (!examId || topicsPerExam[examId]) return;
              try {
                const topicsRes = await topicApi.getAll({ examId, limit: 1000 });
                if (topicsRes?.success) {
                  topicsPerExam[examId] = topicsRes.data.topics || [];
                }
              } catch {
                topicsPerExam[examId] = [];
              }
            })
          );
          setExamTopicsMap(topicsPerExam);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground">No paper sets currently assigned to you.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {papers.map((paper) => {
        const examId =
          (paper.examId as any)?._id?.toString() ||
          (paper.examId as any)?.toString();
        const topics = examTopicsMap[examId] || [];
        return <PaperSetCard key={paper._id} paper={paper} topics={topics} />;
      })}
    </div>
  );
}
