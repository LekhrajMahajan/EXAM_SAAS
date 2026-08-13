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
      case 'Published': return <span className="flex items-center text-emerald-600 text-xs font-medium"><CheckCircle className="w-3 h-3 mr-1" /> Published</span>;
      case 'Scheduled': return <span className="flex items-center text-blue-600 text-xs font-medium"><Clock className="w-3 h-3 mr-1" /> Scheduled</span>;
      default: return <span className="flex items-center text-slate-500 text-xs font-medium"><Clock className="w-3 h-3 mr-1" /> Draft</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generated': return <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">Generated</span>;
      case 'Published': return <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">Published</span>;
      default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">{status}</span>;
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No merit records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
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
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-baseline gap-1">
                      <span className="text-slate-400 font-bold text-xs">#</span>
                      <span className="text-lg font-extrabold text-slate-900">{record.ranks.overallRank}</span>
                   </div>
                   {record.ranks.categoryRank && (
                      <div className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-1">
                        {record.category}: #{record.ranks.categoryRank}
                      </div>
                   )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{record.candidateName}</div>
                  <div className="text-xs font-mono text-slate-500">{record.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                     {record.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-slate-900">{record.marksObtained} <span className="text-slate-400 font-normal text-xs">/ {record.totalMarks}</span></div>
                  <div className={cn("text-xs font-medium", record.percentage >= 40 ? "text-emerald-600" : "text-red-600")}>{record.percentage}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPublishBadge(record.publishStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="outline" size="sm" asChild>
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
