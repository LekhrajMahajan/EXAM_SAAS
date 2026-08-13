import React, { useState } from 'react';
import { usePendingVerifications, useVerifyCenterSetup, useApproveDocument, useRejectDocument } from '../hooks/center.hooks';
import type { Center } from '../types/center.types';
import { CenterHeader } from '../components/CenterHeader';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { CheckCircle, XCircle, Loader2, Clock, MapPin, Sparkles, ShieldCheck, FileText, Lock, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CenterPendingVerificationsPage: React.FC = () => {
  const { data: response, isLoading, refetch } = usePendingVerifications();
  const verifyMutation = useVerifyCenterSetup();
  const approveDocMutation = useApproveDocument();
  const rejectDocMutation = useRejectDocument();

  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');

  // Document Review Modal State
  const [docReviewCenter, setDocReviewCenter] = useState<Center | null>(null);
  const [docRejectId, setDocRejectId] = useState<string | null>(null);
  const [docRejectionReason, setDocRejectionReason] = useState('');
  const [docCorrectionNotes, setDocCorrectionNotes] = useState('');
  const [viewedDocIds, setViewedDocIds] = useState<Record<string, boolean>>({});

  const pendingCenters = response?.data || [];

  const handleApproveCenter = (id: string) => {
    verifyMutation.mutate(
      { id, payload: { status: 'ACTIVE' } },
      { onSuccess: () => refetch() }
    );
  };

  const handleOpenRejectCenter = (id: string) => {
    setSelectedCenterId(id);
    setRejectionRemarks('');
    setRejectDialogOpen(true);
  };

  const confirmRejectCenter = () => {
    if (!selectedCenterId) return;
    verifyMutation.mutate(
      { id: selectedCenterId, payload: { status: 'REJECTED', remarks: rejectionRemarks } },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setSelectedCenterId(null);
          refetch();
        },
      }
    );
  };

  const handleApproveDoc = (docId: string, centerId?: string) => {
    approveDocMutation.mutate(
      { docId, centerId },
      {
        onSuccess: () => {
          refetch();
          if (docReviewCenter) {
            const updatedDocs = (docReviewCenter.documents || []).map(d =>
              d._id === docId || d.id === docId ? { ...d, verificationStatus: 'APPROVED' as const } : d
            );
            setDocReviewCenter({ ...docReviewCenter, documents: updatedDocs });
          }
        },
      }
    );
  };

  const confirmRejectDoc = () => {
    if (!docRejectId || !docReviewCenter) return;
    rejectDocMutation.mutate(
      {
        docId: docRejectId,
        payload: {
          rejectionReason: docRejectionReason,
          correctionNotes: docCorrectionNotes,
          centerId: docReviewCenter._id || docReviewCenter.id,
        },
      },
      {
        onSuccess: () => {
          setDocRejectId(null);
          setDocRejectionReason('');
          setDocCorrectionNotes('');
          refetch();
          const updatedDocs = (docReviewCenter.documents || []).map(d =>
            d._id === docRejectId || d.id === docRejectId ? { ...d, verificationStatus: 'REJECTED' as const, rejectionReason: docRejectionReason } : d
          );
          setDocReviewCenter({ ...docReviewCenter, documents: updatedDocs });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <CenterHeader
        title="Center Onboarding & Document Verifications"
        description="Review submitted center setups, verify statutory legal documents, evaluate readiness scores, and authorize operational permissions."
        actions={
          <Link to="/company/centers">
            <Button variant="outline" size="sm">Back to All Centers</Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : pendingCenters.length === 0 ? (
        <Card className="text-center py-16 border-dashed bg-muted/10">
          <CardHeader>
            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-60 mb-2" />
            <CardTitle className="text-xl font-bold">No Pending Center Verifications</CardTitle>
            <CardDescription className="max-w-md mx-auto mt-1">
              All center setups have been reviewed or are currently being worked on by Center Managers.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[240px]">Center Identity</TableHead>
                <TableHead>Location & Contact</TableHead>
                <TableHead className="text-center">Scores (Readiness / Compliance)</TableHead>
                <TableHead>Documents Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Verification Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCenters.map((center) => {
                const readiness = center.readinessScore || 85;
                const compliance = center.complianceScore || 90;
                const docs = center.documents || [];
                const approvedCount = docs.filter((d) => d.verificationStatus === 'APPROVED').length;
                const rejectedCount = docs.filter((d) => d.verificationStatus === 'REJECTED').length;
                const centerId = center._id || center.id;
                const allDocsApproved = docs.length > 0 && docs.length === approvedCount;

                return (
                  <TableRow key={centerId} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground">{center.centerName}</span>
                        <span className="text-xs text-muted-foreground font-mono">Code: {center.centerCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{center.city}, {center.state}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium">{center.headEmail || center.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-emerald-600 text-white px-2 py-0.5 text-xs font-bold shadow-sm inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          R: {readiness}%
                        </Badge>
                        <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs font-bold shadow-sm inline-flex items-center gap-1">
                          C: {compliance}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDocReviewCenter(center)}
                        className="text-xs font-semibold"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Inspect ({approvedCount}/{docs.length || 0} Approved)
                        {rejectedCount > 0 && <span className="ml-1 text-destructive font-bold">({rejectedCount} Rej)</span>}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/5 text-xs inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-all"
                          onClick={() => handleOpenRejectCenter(centerId)}
                          disabled={verifyMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Reject Setup
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleApproveCenter(centerId)}
                          disabled={!allDocsApproved || verifyMutation.isPending}
                          title={!allDocsApproved ? "All statutory documents must be inspected and approved first before unlocking dashboard" : "Grant dashboard operational permissions"}
                        >
                          {verifyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
                          Approve & Unlock
                        </Button>
                      </div>
                      {!allDocsApproved && (
                        <p className="text-[11px] text-amber-600 font-semibold text-right flex items-center justify-end gap-1">
                          <AlertCircle className="h-3 w-3 inline" /> Approve all {docs.length || 5} documents in review first
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Reject Center Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold">
              <XCircle className="h-5 w-5" /> Reject Center Onboarding
            </DialogTitle>
            <DialogDescription>
              Provide specific revision notes for the Center Manager outlining necessary corrections before operational permissions are granted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              rows={4}
              placeholder="e.g., CCTV layout camera density does not meet minimum testing standards; please upload corrected floor layout."
              value={rejectionRemarks}
              onChange={(e) => setRejectionRemarks(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={verifyMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectCenter} disabled={!rejectionRemarks.trim() || verifyMutation.isPending}>
              {verifyMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Inspection & Verification Modal */}
      <Dialog open={!!docReviewCenter} onOpenChange={(open) => !open && setDocReviewCenter(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-6 w-6 text-primary" />
              Document Review: {docReviewCenter?.centerName} ({docReviewCenter?.centerCode})
            </DialogTitle>
            <DialogDescription>
              Review uploaded statutory documents and commercial agreements. Approved documents become permanently locked to maintain compliance integrity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {(docReviewCenter?.documents || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">No documents currently uploaded for this center.</p>
            ) : (
              (docReviewCenter?.documents || []).map((doc, idx) => {
                const docId = doc._id || doc.id || String(idx);
                const isApproved = doc.verificationStatus === 'APPROVED';
                const isRejected = doc.verificationStatus === 'REJECTED';
                const isViewed = !!viewedDocIds[docId] || isApproved;
                const fileUrl = doc.documentUrl || (doc as Record<string, unknown>).fileUrl as string | undefined || "https://storage.practice-exam.com/docs/" + (doc.fileName || "statutory-doc.pdf");

                return (
                  <div key={docId} className="border rounded-lg p-4 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">{doc.documentType || 'Statutory License'}</span>
                        {isApproved && (
                          <Badge className="bg-green-600 text-white text-xs inline-flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Approved & Locked
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge variant="destructive" className="text-xs">
                            Rejected
                          </Badge>
                        )}
                        {!isApproved && !isRejected && (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/5 text-xs">
                            Pending Verification
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{doc.fileName || 'document.pdf'}</p>
                      {doc.rejectionReason && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Reason: {doc.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isViewed ? "secondary" : "default"} 
                          size="sm"
                          className={!isViewed ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                          onClick={() => {
                            setViewedDocIds(prev => ({ ...prev, [docId]: true }));
                            window.open(fileUrl, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1.5" /> {isViewed ? "Viewed Document" : "View to Enable Approve"}
                        </Button>
                        {!isApproved && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => {
                                setDocRejectId(docId);
                                setDocRejectionReason('');
                                setDocCorrectionNotes('');
                              }}
                              disabled={rejectDocMutation.isPending || approveDocMutation.isPending}
                            >
                              Reject Doc
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleApproveDoc(docId, docReviewCenter?._id || docReviewCenter?.id)}
                              disabled={!isViewed || approveDocMutation.isPending || rejectDocMutation.isPending}
                              title={!isViewed ? "You must click 'View to Enable Approve' to check file contents first" : "Approve document"}
                            >
                              {approveDocMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                              Approve Doc
                            </Button>
                          </>
                        )}
                      </div>
                      {!isApproved && !isViewed && (
                        <span className="text-[11px] text-blue-600 font-semibold italic flex items-center gap-1">
                          * Click view button above to inspect document and enable Approve
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setDocReviewCenter(null)} className="w-full sm:w-auto">
              Close Document Inspector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Rejection Modal (Reason Required) */}
      <Dialog open={!!docRejectId} onOpenChange={(open) => !open && setDocRejectId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2 font-bold">
              <AlertCircle className="h-5 w-5" /> Document Rejection Feedback
            </DialogTitle>
            <DialogDescription>
              Rejection of statutory documents requires a specific reason so the Center Manager can upload corrected files.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Rejection Reason (Required)</label>
              <Textarea
                rows={3}
                placeholder="e.g., Certificate signature is missing or blurred beyond legibility."
                value={docRejectionReason}
                onChange={(e) => setDocRejectionReason(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Correction Instructions (Optional)</label>
              <Textarea
                rows={2}
                placeholder="e.g., Please ensure all page borders and official government stamps are visible."
                value={docCorrectionNotes}
                onChange={(e) => setDocCorrectionNotes(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocRejectId(null)} disabled={rejectDocMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectDoc}
              disabled={!docRejectionReason.trim() || rejectDocMutation.isPending}
            >
              {rejectDocMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
