import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_VERIFICATIONS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, UserCheck, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { VerificationStatusBadge } from '../components/VerificationStatusBadge';

export function VerificationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const verification = DUMMY_VERIFICATIONS.find(v => v.id === id);

  if (!verification) {
    return <Navigate to="/company/entry-verification" replace />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4" asChild>
            <Link to="/company/entry-verification">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verification: {verification.applicationNumber}</h2>
          <p className="text-slate-500 mt-1">{verification.candidateName}</p>
        </div>
        <div className="flex items-center gap-2">
          <VerificationStatusBadge status={verification.status} className="text-sm py-1" />
          {verification.status === 'Pending' && (
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to={`/company/entry-verification/check-in?appNo=${verification.applicationNumber}`}>
                <UserCheck className="w-4 h-4 mr-2" /> Verify Now
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
                  <User className="w-4 h-4 text-slate-500" />
                  Candidate & Exam Details
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

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
               <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  Security Checks Log
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               {verification.status !== 'Pending' ? (
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-slate-700">Admit Card Verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-slate-700">Photo / Face Match Confirmed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-slate-700">Original Identity Proof Checked</span>
                    </div>
                 </div>
               ) : (
                 <p className="text-sm text-slate-500 italic">No security checks performed yet.</p>
               )}
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
                <p className="text-xs font-medium text-slate-500 mb-1">Check-in Timestamp</p>
                <p className="text-sm font-medium text-slate-900">
                  {verification.checkInTime ? new Date(verification.checkInTime).toLocaleString() : 'Not checked in'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Verified By</p>
                <p className="text-sm font-medium text-slate-900">{verification.verifiedBy || 'N/A'}</p>
              </div>
              {verification.remarks && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1 text-red-600">Remarks</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-red-50 p-2 rounded border border-red-100">
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
