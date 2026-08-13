import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useParams, Link } from 'react-router-dom';
import { PreviewCard } from '../components/PreviewCard';
import { ResultAnswersView } from '../components/ResultAnswersView';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { apiClient } from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-slate-500 hover:text-slate-900">
          <Link to="/company/results">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="Result Details" 
          description={`Viewing details for ${previewData.candidateName} (${previewData.applicationNumber})`} 
        />
      </div>

      <div className="bg-transparent border border-slate-800/50 rounded-lg p-6">
         <PreviewCard result={previewData as any} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Question Analysis</h3>
        <ResultAnswersView answers={result.answers || []} />
      </div>
    </div>
  );
}
