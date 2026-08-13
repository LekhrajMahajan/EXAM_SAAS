import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaperWizard } from '../components/PaperWizard';

export const CreatePaperPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/company/papers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Paper</h1>
          <p className="text-slate-500">Configure paper details, select questions, and build the blueprint.</p>
        </div>
      </div>

      <PaperWizard />
    </div>
  );
};
