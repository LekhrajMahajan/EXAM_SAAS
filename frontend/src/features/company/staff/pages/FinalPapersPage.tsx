import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PageHeader } from "@/shared/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Loader2, FileSignature, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

export function FinalPapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectingExamId, setSelectingExamId] = useState<string | null>(null);
  const [selectedExams, setSelectedExams] = useState<Record<string, boolean>>({});
  
  // New states for Search, Filter, and Collapsible
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, SELECTED, UNSELECTED
  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get('/papers', { params: { limit: 1000 } });
        let allPapers = [];
        if (Array.isArray(res.data?.data)) {
          allPapers = res.data.data;
        } else if (res.data?.data?.papers) {
          allPapers = res.data.data.papers;
        }
        
        const finalStatuses = ['SUBMITTED', 'APPROVED', 'PUBLISHED'];
        const finalPapers = allPapers.filter((p: any) => finalStatuses.includes(p.approvalStatus));
        
        setPapers(finalPapers);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const groupedPapers = papers.reduce((acc: any, paper: any) => {
    const examId = paper.examId?._id || paper.examId || 'unassigned';
    const examName = paper.examId?.examTitle || paper.examId?.examName || paper.examId?.name || paper.examName || 'Unassigned Exam';
    if (!acc[examId]) {
      acc[examId] = { examName, papers: [], finalPaperId: paper.examId?.finalPaperId };
    }
    acc[examId].papers.push(paper);
    return acc;
  }, {});

  const handleAutoSelect = async (examId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from expanding/collapsing when clicking the button
    try {
      setSelectingExamId(examId);
      await api.post(`/exams/${examId}/papers/auto-select`);
      alert("Final paper randomly selected successfully!");
      setSelectedExams(prev => ({ ...prev, [examId]: true }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to auto-select paper.");
    } finally {
      setSelectingExamId(null);
    }
  };

  const toggleExpand = (examId: string) => {
    setExpandedExams(prev => ({ ...prev, [examId]: !prev[examId] }));
  };

  // Apply Search and Filter
  const filteredExamIds = Object.keys(groupedPapers).filter((examId) => {
    const group = groupedPapers[examId];
    
    // Search Filter
    if (searchQuery && !group.examName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status Filter
    const isSelected = selectedExams[examId] || !!group.finalPaperId;
    if (statusFilter === "SELECTED" && !isSelected) return false;
    if (statusFilter === "UNSELECTED" && isSelected) return false;
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <PageHeader 
            title="Final Papers"
            description="View all submitted papers grouped by exam."
          />
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search exams..."
                className="pl-9 bg-card border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border/50">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Papers</SelectItem>
                <SelectItem value="SELECTED">Selected Papers</SelectItem>
                <SelectItem value="UNSELECTED">Unselected Papers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExamIds.length === 0 ? (
              <Card className="flex flex-col items-center justify-center h-48 border-dashed bg-card/30">
                <p className="text-muted-foreground text-sm">No final papers found matching your criteria.</p>
              </Card>
            ) : (
              filteredExamIds.map((examId) => {
                const group = groupedPapers[examId];
                const sortedPapers = [...group.papers].sort((a: any, b: any) => {
                  return new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime();
                });
                
                const isExpanded = expandedExams[examId];

                return (
                  <Card key={examId} className="border border-border/50 bg-card/50 overflow-hidden transition-all duration-200">
                    <CardHeader 
                      className={`pb-4 cursor-pointer hover:bg-muted/30 transition-colors ${isExpanded ? 'bg-muted/20 border-b border-border/50' : 'bg-muted/10'}`}
                      onClick={() => toggleExpand(examId)}
                    >
                      <CardTitle className="text-lg flex items-center justify-between w-full">
                        <span className="truncate pr-4">{group.examName}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          {examId !== 'unassigned' && (
                            <Button 
                              variant={selectedExams[examId] || group.finalPaperId ? "secondary" : "default"}
                              disabled={selectedExams[examId] || !!group.finalPaperId || selectingExamId === examId}
                              onClick={(e) => handleAutoSelect(examId, e)}
                              className="shadow-sm"
                            >
                              {selectingExamId === examId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {selectedExams[examId] || group.finalPaperId ? "Final Paper Selected" : "Auto Paper Select"}
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {sortedPapers.length} Paper(s) submitted for this exam
                      </CardDescription>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="p-0 animate-in slide-in-from-top-2 duration-200">
                        <div className="divide-y divide-border/50">
                          {sortedPapers.map((paper: any, idx: number) => {
                            const setName = String.fromCharCode(65 + idx); // 0 -> A, 1 -> B
                            return (
                              <div key={paper._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors bg-card/30">
                                <div>
                                  <h4 className="font-medium text-primary">Paper Set {setName}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Total {paper.examId?.subjects?.length || 1} Subject(s) and {paper.totalQuestions || 0} Question(s) | Status: {paper.approvalStatus}
                                  </p>
                                </div>
                                <div className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full flex items-center shadow-sm">
                                  <FileSignature className="w-3 h-3 mr-1" />
                                  Confidential
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
