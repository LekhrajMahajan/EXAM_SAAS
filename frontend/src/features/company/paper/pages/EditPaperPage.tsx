import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaperWizard } from '../components/PaperWizard';
import { DUMMY_PAPERS } from '../utils/placeholder';

export const EditPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const paper = DUMMY_PAPERS.find(p => p.id === id) || DUMMY_PAPERS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/company/papers/${paper.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Paper: {paper.code}</h1>
          <p className="text-slate-500">Update paper details, questions, or blueprint.</p>
        </div>
      </div>

      <PaperWizard />
    </div>
  );
};
