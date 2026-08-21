import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useParams, Link } from 'react-router-dom';
import { ResultAnswersView } from '../components/ResultAnswersView';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2, User, Target, FileText } from 'lucide-react';
import { apiClient } from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';
import { Card, CardHeader } from '@/shared/components/ui/card';

export function ResultDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/results/${id}/details`);
        if (res.data?.data) {
          setResult(res.data.data);
        } else {
          toast.error("Failed to load result details");
        }
      } catch (error) {
        console.error("Error fetching result details:", error);
        toast.error("Failed to load result details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-slate-500">Result not found.</p>
        <Button asChild variant="outline">
          <Link to="/company/results">Back to Results</Link>
        </Button>
      </div>
    );
  }

  // Map backend format to what PreviewCard expects if needed
  const previewData = {
    id: result.id,
    candidateName: result.candidate?.name || result.candidateName || 'Unknown Candidate',
    applicationNumber: result.candidate?.applicationNumber || result.applicationNo || 'N/A',
    photo: result.candidate?.photo || null,
    exam: result.exam?.name || result.exam?.examTitle || 'Unknown Exam',
    subject: 'General',
    shift: 'General',
    center: 'Online',
    marksObtained: result.marks?.obtainedMarks ?? result.marksObtained ?? 0,
    totalMarks: result.marks?.totalMarks ?? result.totalMarks ?? 0,
    percentage: result.marks?.percentage ?? result.percentage ?? 0,
    grade: result.grade,
    status: result.status || result.resultStatus || 'Generated',
    publishStatus: 'Published'
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-stretch gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          asChild 
          className="h-auto px-4 bg-card hover:bg-muted border border-border shadow-xl rounded-xl shrink-0"
        >
          <Link to="/company/results">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
        </Button>
        <PageHeader 
          title="Result Details" 
          description={`Viewing details for ${previewData.candidateName} (${previewData.applicationNumber})`} 
        />
      </div>

      {/* Top Box: Exam Name */}
      <Card className="bg-white dark:bg-[#16191F] border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="py-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Exam Name</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{previewData.exam}</h2>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Middle Row: Two Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Candidate Info */}
        <Card className="bg-white dark:bg-[#16191F] border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 overflow-hidden">
                {previewData.photo ? (
                  <img src={previewData.photo} alt={previewData.candidateName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{previewData.candidateName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">App No: {previewData.applicationNumber}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Box 2: Marks Obtained */}
        <Card className="bg-white dark:bg-[#16191F] border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks Obtained</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-3xl">{previewData.marksObtained}</h3>
                  <span className="text-base text-slate-500 dark:text-slate-400 font-medium">/ {previewData.totalMarks}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Question Analysis</h3>
        <ResultAnswersView answers={result.answers || []} />
      </div>
    </div>
  );
}
