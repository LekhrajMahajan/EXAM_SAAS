import React from 'react';
import type { MeritRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MeritTableProps {
  records: MeritRecord[];
}

export function MeritTable({ records }: MeritTableProps) {

  const getPublishBadge = (status: string) => {
    switch (status) {
      case 'Published': return <span className="flex items-center text-primary text-xs font-medium"><CheckCircle className="w-3 h-3 mr-1" /> Published</span>;
      case 'Scheduled': return <span className="flex items-center text-blue-500 text-xs font-medium"><Clock className="w-3 h-3 mr-1" /> Scheduled</span>;
      default: return <span className="flex items-center text-muted-foreground text-xs font-medium"><Clock className="w-3 h-3 mr-1" /> Draft</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generated': return <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">Generated</span>;
      case 'Published': return <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium border border-primary/20">Published</span>;
      default: return <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium border border-border">{status}</span>;
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/50 border border-border border-dashed rounded-xl">
        <p className="text-muted-foreground">No merit records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs text-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-4">Rank</th>
              <th scope="col" className="px-6 py-4">Candidate</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Marks</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Publish</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-baseline gap-1">
                      <span className="text-muted-foreground font-bold text-xs">#</span>
                      <span className="text-lg font-extrabold text-foreground">{record.ranks.overallRank}</span>
                   </div>
                   {record.ranks.categoryRank && (
                      <div className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded inline-block mt-1">
                        {record.category}: #{record.ranks.categoryRank}
                      </div>
                   )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-foreground">{record.candidateName}</div>
                  <div className="text-xs font-mono text-muted-foreground">{record.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className="px-2 py-1 rounded bg-muted border border-border text-foreground font-medium">
                     {record.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-foreground">{record.marksObtained} <span className="text-muted-foreground font-normal text-xs">/ {record.totalMarks}</span></div>
                  <div className={cn("text-xs font-medium", record.percentage >= 40 ? "text-primary" : "text-destructive")}>{record.percentage}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPublishBadge(record.publishStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="outline" size="sm" asChild className="bg-card">
                    <Link to={`/company/merit/${record.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
