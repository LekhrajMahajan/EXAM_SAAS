import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { MeritTable } from '../components/MeritTable';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useMeritLists } from '../hooks/merit.hooks';
import type { MeritStatistics } from '../types';

export function MeritDashboardPage() {
  const { data: meritData, isLoading } = useMeritLists();
  const [selectedExam, setSelectedExam] = useState<string>('All Exams');

  const allExams = useMemo(() => {
    if (!meritData?.data) return [];
    const exams = new Set(meritData.data.map(r => r.exam));
    return Array.from(exams);
  }, [meritData]);

  const records = useMemo(() => {
    if (!meritData?.data) return [];
    let filtered = meritData.data;
    if (selectedExam !== 'All Exams') {
      filtered = filtered.filter(r => r.exam === selectedExam);
    }
    return filtered;
  }, [meritData, selectedExam]);

  const stats: MeritStatistics = useMemo(() => {
    return {
      totalMeritLists: records.length,
      publishedMeritLists: records.filter(r => r.publishStatus === 'Published').length,
      pendingMeritLists: records.filter(r => r.publishStatus !== 'Published').length,
      candidatesRanked: records.length,
      topRank: records.length > 0 ? 1 : 0,
      lastRank: records.length,
      categoryMeritCount: records.reduce((acc, r) => {
        const cat = r.category || 'General';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [records]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Merit List Management" 
          description="Generate, view, and publish ranked merit lists based on candidate performance." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-card" asChild>
             <Link to="/company/merit/publish">Publish Lists</Link>
           </Button>
           <Button asChild>
             <Link to="/company/merit/generate">
               <PlusCircle className="w-4 h-4 mr-2" />
               Generate Merit
             </Link>
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={stats} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">Recently Generated Rankings</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by candidate name or app ID..." 
                className="pl-9 bg-card"
              />
            </div>
            <select
              className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value="All Exams">All Exams</option>
              {allExams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
            Loading merit records...
          </div>
        ) : (
          <MeritTable records={records} />
        )}
      </div>
    </div>
  );
}
