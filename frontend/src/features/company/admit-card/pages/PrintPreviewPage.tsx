import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AdmitCardPreview } from '../components/AdmitCardPreview';
import { DUMMY_ADMIT_CARDS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

export function PrintPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const card = DUMMY_ADMIT_CARDS.find(c => c.id === id);

  if (!card) {
    return <Navigate to="/company/admit-cards" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4 print:bg-white print:p-0 print:m-0">
      <div className="max-w-[210mm] mx-auto mb-6 flex items-center justify-between print:hidden">
        <Button variant="outline" className="bg-white" asChild>
          <Link to={`/company/admit-cards/${card.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print PDF
        </Button>
      </div>
      
      <AdmitCardPreview card={card} />
    </div>
  );
}
