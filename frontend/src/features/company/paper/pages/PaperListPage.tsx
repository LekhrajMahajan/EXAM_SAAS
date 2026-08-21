import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, ChevronDown, ChevronUp, Search, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import api from '@/services/api';

interface UploadedBatch {
  importId: string;
  examName: string;
  count: number;
  centers: any[];
  examStatus: string;
  isSentToCenters: boolean;
  examObj: any;
}

export const PaperListPage = () => {
  const [searchParams] = useSearchParams();
  const importIdParam = searchParams.get('importId');
  const [uploadedBatches, setUploadedBatches] = useState<UploadedBatch[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(importIdParam);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchImports = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/import-center-assign-exam?sentToAdmin=true');
      if (res.data?.success) {
        const batches = res.data.data.map((item: any) => ({
          importId: item._id,
          examName: item.examId?.examName || item.examId?.examTitle || 'Unknown Exam',
          count: item.centers?.length || 0,
          centers: item.centers || [],
          examStatus: item.examId?.status || 'UNKNOWN',
          isSentToCenters: item.isSentToCenters || false,
          examObj: item.examId
        }));
        setUploadedBatches(batches);
      }
    } catch (err) {
      console.error('Failed to fetch imported batches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchImports();
    };
    initFetch();
  }, []);

  const uniqueExams = useMemo(() => {
    const exams = new Set(uploadedBatches.map(b => b.examName).filter(Boolean));
    return Array.from(exams) as string[];
  }, [uploadedBatches]);

  const filteredBatches = useMemo(() => {
    return uploadedBatches.filter(b => {
      if (search && !b.examName.toLowerCase().includes(search.toLowerCase())) return false;
      if (examFilter !== "all" && b.examName !== examFilter) return false;
      if (statusFilter !== "all" && b.examStatus.toUpperCase() !== statusFilter.toUpperCase()) return false;
      return true;
    });
  }, [uploadedBatches, search, examFilter, statusFilter]);

  const examStatuses = [
    { value: "ACTIVE", label: "Active" },
    { value: "DRAFT", label: "Draft" },
    { value: "EXAM_STARTED", label: "Exam Started" },
    { value: "EXAM_ENDED", label: "Exam Ended" },
    { value: "COMPLETED", label: "Completed" },
    { value: "RESULT_GENERATED", label: "Result Generated" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "INACTIVE", label: "Inactive" }
  ];

  const toggleRow = (importId: string) => {
    setExpandedRow(expandedRow === importId ? null : importId);
  };

  const handleSendToCenters = async (importId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSendingId(importId);
      const res = await api.post(`/import-center-assign-exam/${importId}/send-to-centers`);
      
      // Artificial delay for UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (res.data?.success) {
        toast.success("Exams have been assigned to the matched centers successfully.");
        setUploadedBatches(prev => prev.map(batch => 
          batch.importId === importId ? { ...batch, isSentToCenters: true } : batch
        ));
      }
    } catch (err: any) {
      console.error('Failed to send to centers:', err);
      toast.error(err.response?.data?.message || "Failed to send exams to centers.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Send center assign exam</h1>
          <p className="text-muted-foreground mt-1">View centers assigned and sent by the Government Authority.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={fetchImports} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Placeholder */}
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-md border border-border">
        <div className="flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              className="pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className="w-[200px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {uniqueExams.map(exam => (
                <SelectItem key={exam} value={exam}>{exam}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] hidden lg:flex focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {examStatuses.map(st => (
                <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Uploaded Batches Table */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48 border border-border rounded-md bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="flex justify-center items-center h-48 border border-border rounded-md bg-card">
            <p className="text-muted-foreground text-sm">No centers have been assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBatches.map((batch) => (
              <div key={batch.importId} className="flex flex-col bg-card border border-border rounded-md overflow-hidden transition-all duration-300 shadow-sm">
                {/* Header Row */}
                <div 
                  className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleRow(batch.importId)}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {batch.examObj && (
                      <ExamStatusBadge exam={batch.examObj} className="h-6" />
                    )}
                    <span className="font-semibold text-foreground">{batch.examName}</span>
                    <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{batch.count} Centers Assigned</span>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <Button 
                      size="sm" 
                      className={`text-white shadow-sm disabled:opacity-50 ${
                        batch.isSentToCenters ? 'bg-[#7A8E60] hover:bg-[#7A8E60]/90' : 'bg-[#4A5D23] hover:bg-[#4A5D23]/90'
                      }`}
                      disabled={batch.isSentToCenters || sendingId === batch.importId}
                      onClick={(e) => {
                        if (!batch.isSentToCenters && sendingId !== batch.importId) {
                          handleSendToCenters(batch.importId, e);
                        } else {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {sendingId === batch.importId ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : batch.isSentToCenters ? (
                        <>
                          <svg
                            className='w-4 h-4 mr-2'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <polyline points='20 6 9 17 4 12'></polyline>
                          </svg>
                          Sent to Centers
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send to centers
                        </>
                      )}
                    </Button>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                      {expandedRow === batch.importId ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
                
                {/* Accordion Content */}
                {expandedRow === batch.importId && (
                  <div className="border-t border-border bg-background p-4 animate-in slide-in-from-top-2 duration-300">
                    {batch.centers && batch.centers.length > 0 ? (
                      <div className="overflow-x-auto rounded-md border border-border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                            <tr>
                              <th className="px-4 py-3 font-medium">Center Name</th>
                              <th className="px-4 py-3 font-medium">Center Code</th>
                              <th className="px-4 py-3 font-medium">City</th>
                              <th className="px-4 py-3 font-medium">State</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border bg-background">
                            {batch.centers.map((row, i) => (
                              <tr key={i} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground">{row.centerName}</td>
                                <td className="px-4 py-3 text-muted-foreground">{row.centerCode}</td>
                                <td className="px-4 py-3 text-muted-foreground">{row.city}</td>
                                <td className="px-4 py-3 text-muted-foreground">{row.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-4">No center details found for this batch.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
