import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Trophy, Users, CheckCircle2 } from 'lucide-react';

export interface PreviewData {
  candidatesProcessed: number;
  topScore: number;
  maxScore: number;
  tieBreakersApplied: number;
  topCandidates: Array<{
    id: string;
    name: string;
    category: string;
    state: string;
    score: number;
  }>;
}

interface PreviewCardProps {
  data?: PreviewData | null;
  isLoading?: boolean;
}

export function PreviewCard({ data, isLoading }: PreviewCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border shadow-md overflow-hidden relative bg-card h-full flex items-center justify-center min-h-[300px]">
         <div className="text-center text-muted-foreground">
            <p>Generating preview...</p>
         </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-border shadow-md overflow-hidden relative bg-card h-full flex items-center justify-center min-h-[300px]">
         <div className="text-center text-muted-foreground">
            <p>Configure parameters and generate to see preview.</p>
         </div>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-md overflow-hidden relative bg-card">
      <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
      <CardHeader className="pb-4 pt-8">
        <CardTitle className="text-2xl font-bold text-foreground mb-1">Merit List Generation Preview</CardTitle>
        <CardDescription className="text-base text-muted-foreground">Simulated run based on current parameters.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
             <div className="flex justify-center mb-2"><Users className="w-6 h-6 text-primary" /></div>
             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Candidates Processed</p>
             <p className="text-2xl font-bold text-foreground">{data.candidatesProcessed.toLocaleString()}</p>
           </div>
           
           <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
             <div className="flex justify-center mb-2"><Trophy className="w-6 h-6 text-primary" /></div>
             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Top Score</p>
             <p className="text-2xl font-bold text-foreground">{data.topScore} <span className="text-sm font-normal text-muted-foreground">/ {data.maxScore}</span></p>
           </div>
           
           <div className="bg-muted/50 p-4 rounded-lg border border-border text-center">
             <div className="flex justify-center mb-2"><CheckCircle2 className="w-6 h-6 text-primary" /></div>
             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Tie-Breakers Applied</p>
             <p className="text-2xl font-bold text-foreground">{data.tieBreakersApplied.toLocaleString()}</p>
           </div>
        </div>

        <div>
           <h4 className="font-bold text-foreground mb-3">Top 3 Preview</h4>
           <div className="space-y-2">
             {data.topCandidates.map((candidate, index) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                         #{index + 1}
                      </div>
                      <div>
                         <p className="font-semibold text-foreground">{candidate.name}</p>
                         <p className="text-xs text-muted-foreground">{candidate.category} • {candidate.state}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-foreground">{candidate.score}</p>
                   </div>
                </div>
             ))}
           </div>
        </div>

      </CardContent>
    </Card>
  );
}
