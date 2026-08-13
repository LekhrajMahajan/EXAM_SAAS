import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowLeft, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Paper } from '../types';

interface PaperHeaderProps {
  paper: Paper;
  showActions?: boolean;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ paper, showActions = true }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Draft':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/company/papers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {paper.name}
            <Badge variant={getStatusColor(paper.status) as any}>{paper.status}</Badge>
            <Badge variant={getApprovalColor(paper.approvalStatus) as any}>{paper.approvalStatus}</Badge>
          </h1>
          <div className="flex gap-4 text-sm text-slate-500 mt-2">
            <span>Code: <strong className="text-slate-700">{paper.code}</strong></span>
            <span>Subject: <strong className="text-slate-700">{paper.subject}</strong></span>
            <span>Duration: <strong className="text-slate-700">{paper.duration} mins</strong></span>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => navigate(`/company/papers/${paper.id}/preview`)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => navigate(`/company/papers/${paper.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {paper.approvalStatus === 'Pending' && (
            <>
              <Button variant="success">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
