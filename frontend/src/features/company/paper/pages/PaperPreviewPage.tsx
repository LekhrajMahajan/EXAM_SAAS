import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaperPreview } from '../components/PaperPreview';
import { PaperHeader } from '../components/PaperHeader';
import { DUMMY_PAPERS } from '../utils/placeholder';

export const PaperPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const paper = DUMMY_PAPERS.find(p => p.id === id) || DUMMY_PAPERS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Preview: {paper.name}</h1>
          <p className="text-slate-500">Student view simulation.</p>
        </div>
      </div>

      <PaperHeader paper={paper} showActions={false} />

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <PaperPreview paper={paper} />
      </div>
    </div>
  );
};
