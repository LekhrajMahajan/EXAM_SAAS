import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ADMIT_CARDS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Download, Mail, MessageSquare, Printer, Ban } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export function AdmitCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const card = DUMMY_ADMIT_CARDS.find(c => c.id === id);

  if (!card) {
    return <Navigate to="/company/admit-cards" replace />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admit Card: {card.applicationNumber}</h2>
          <p className="text-slate-500 mt-1">{card.candidateName} • {card.examId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {card.status === 'Generated' && <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm py-1">Generated</Badge>}
          {card.status === 'Downloaded' && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm py-1">Downloaded</Badge>}
          {card.status === 'Revoked' && <Badge className="bg-red-100 text-red-800 border-red-200 text-sm py-1">Revoked</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Exam</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{card.examName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Exam Date</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{new Date(card.examDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Center</dt>
                  <dd className="mt-1 text-sm text-slate-900">{card.centerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Room / Seat</dt>
                  <dd className="mt-1 text-sm text-slate-900">{card.roomId} / Seat {card.seatNumber}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <Button className="w-full justify-start" asChild>
                <Link to={`/company/admit-cards/${card.id}/preview`}>
                  <Printer className="w-4 h-4 mr-3" />
                  Print Preview
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-3" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-3" />
                Email to Candidate
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-3" />
                SMS to Candidate
              </Button>
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Ban className="w-4 h-4 mr-3" />
                  Revoke Admit Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
