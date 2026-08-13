import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_BIOMETRICS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, ScanFace, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { StatusBadge } from '../components/StatusBadge';

export function VerificationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const verification = DUMMY_BIOMETRICS.find(v => v.id === id);

  if (!verification) {
    return <Navigate to="/company/biometric" replace />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4" asChild>
            <Link to="/company/biometric">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Biometric Record: {verification.applicationNumber}</h2>
          <p className="text-slate-500 mt-1">{verification.candidateName}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={verification.status} className="text-sm py-1" />
          {(verification.status === 'Pending' || verification.status === 'Failed' || verification.status === 'Manual Review Required') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to={`/company/biometric/check-in?appNo=${verification.applicationNumber}`}>
                <ScanFace className="w-4 h-4 mr-2" /> Retake Biometrics
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
               <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Candidate Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Exam</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{verification.examName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Center</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{verification.centerId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Shift</dt>
                  <dd className="mt-1 text-sm text-slate-900">{verification.shiftId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Room & Seat</dt>
                  <dd className="mt-1 text-sm text-slate-900">{verification.roomId} / S-{verification.seatNumber}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
             <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
               <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Verification Method</p>
                <p className="text-sm font-medium text-slate-900">{verification.verificationType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Match Score</p>
                <p className="text-sm font-bold text-slate-900">{verification.matchScore ? `${verification.matchScore}%` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Timestamp</p>
                <p className="text-sm font-medium text-slate-900">
                  {verification.verificationTime ? new Date(verification.verificationTime).toLocaleString() : 'Not verified'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Verified By</p>
                <p className="text-sm font-medium text-slate-900">{verification.verifiedBy || 'N/A'}</p>
              </div>
              {verification.remarks && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1 text-slate-700">Remarks</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                    {verification.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
