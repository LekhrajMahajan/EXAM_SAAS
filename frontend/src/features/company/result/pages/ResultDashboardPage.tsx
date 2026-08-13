import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { ResultTable } from '../components/ResultTable';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/core/api/http/axios-client';
import type { CandidateResult } from '../types';
import { toast } from 'react-hot-toast';

const EMPTY_STATS = {
  totalResults: 0,
  publishedResults: 0,
  pendingResults: 0,
  failedResults: 0,
  averageScore: 0,
  highestScore: 0,
  lowestScore: 0,
  passPercentage: 0
};

export function ResultDashboardPage() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch stats
        const statsRes = await apiClient.get('/results/dashboard');
        if (statsRes.data?.data) {
          const d = statsRes.data.data;
          setStats({
            totalResults: d.totalCandidates || 0,
            publishedResults: d.publishedResults || 0,
            pendingResults: d.pendingResults || 0,
            failedResults: d.failCandidates || 0,
            averageScore: d.averageScore || 0,
            highestScore: d.highestScore || 0,
            lowestScore: d.lowestScore || 0,
            passPercentage: d.totalCandidates ? Math.round(((d.passCandidates || 0) / d.totalCandidates) * 100) : 0
          });
        }

        // Fetch recent results (or all results for the table)
        const resultsRes = await apiClient.get('/results');
        if (resultsRes.data?.data) {
          setResults(resultsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Result Management Dashboard" 
          description="Overview of result generation, publications, and candidate performance." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild>
             <Link to="/company/results/publish">Publish Results</Link>
           </Button>
           <Button asChild>
             <Link to="/company/results/generate">
               <PlusCircle className="w-4 h-4 mr-2" />
               Generate Results
             </Link>
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={stats} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">Recently Generated Results</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-card"
              />
            </div>
            <Button variant="link" asChild className="text-primary p-0 shrink-0">
              <Link to="/company/results">View All</Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center p-12 bg-muted/50 border border-border border-dashed rounded-xl">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        ) : (
          <ResultTable results={results} />
        )}
      </div>
    </div>
  );
}
