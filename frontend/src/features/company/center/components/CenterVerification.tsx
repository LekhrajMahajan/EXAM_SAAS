import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { FileCheck, AlertCircle, CheckCircle2, Eye, XCircle } from 'lucide-react';
import { centerApi } from '@/features/company/center/api/center.api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';

interface CenterVerificationProps {
  centerId: string;
}

export const CenterVerification: React.FC<CenterVerificationProps> = ({ centerId }) => {
  const { toast } = useToast();
  const [center, setCenter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');

  const fetchCenterDetails = React.useCallback(async () => {
    try {
      const res = await centerApi.getById(centerId);
      setCenter(res.data);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Failed to load center details', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [centerId, toast]);

  useEffect(() => {
    const init = async () => {
      await fetchCenterDetails();
    };
    init();
  }, [fetchCenterDetails]);

  const handleApproveDocument = async (docId: string) => {
    try {
      await centerApi.approveDocument(docId, centerId);
      toast({ title: 'Document approved successfully' });
      fetchCenterDetails();
    } catch (err: any) {
      toast({ title: 'Approval failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedDocId || !rejectionReason.trim()) return;
    try {
      await centerApi.rejectDocument(selectedDocId, { rejectionReason, correctionNotes, centerId });
      toast({ title: 'Document rejected', description: 'Rejection email sent to center manager.' });
      setRejectModalOpen(false);
      setSelectedDocId(null);
      setRejectionReason('');
      setCorrectionNotes('');
      fetchCenterDetails();
    } catch (err: any) {
      toast({ title: 'Rejection failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleActivateCenter = async () => {
    try {
      await centerApi.verifyCenterSetup(centerId, { status: 'ACTIVE', remarks: 'Manually verified by Company Admin' });
      toast({ title: 'Center Activated successfully' });
      fetchCenterDetails();
    } catch (err: any) {
      toast({ title: 'Activation failed', description: err.message, variant: 'destructive' });
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading verification data...</div>;
  if (!center) return <div className="p-4 text-center">Center not found.</div>;

  const documents = center.documents || [];
  const allApproved = documents.length > 0 && documents.every((doc: any) => doc.status === 'APPROVED');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Document Verification
              </CardTitle>
              <CardDescription>
                Review and approve documents uploaded by the Center Manager.
              </CardDescription>
            </div>
            <Badge variant={center.setupStatus === 'ACTIVE' ? 'default' : 'secondary'}>
              Status: {center.setupStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No documents found</AlertTitle>
              <AlertDescription>The center manager has not uploaded any documents yet.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => (
                <div key={doc._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-base">{doc.documentType}</h4>
                      {doc.status === 'APPROVED' && <Badge className="bg-green-500">Approved</Badge>}
                      {doc.status === 'REJECTED' && <Badge variant="destructive">Rejected</Badge>}
                      {doc.status === 'PENDING' && <Badge variant="secondary">Pending Review</Badge>}
                    </div>
                    {doc.fileUrl ? (
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                        <Eye className="h-3 w-3" /> View {doc.fileName}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">Not uploaded yet</p>
                    )}
                    {doc.status === 'REJECTED' && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        <strong>Reason:</strong> {doc.rejectionReason}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {doc.fileUrl && doc.status !== 'APPROVED' && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApproveDocument(doc._id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {doc.fileUrl && doc.status !== 'REJECTED' && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {
                        setSelectedDocId(doc._id);
                        setRejectModalOpen(true);
                      }}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/50 border-t flex justify-end p-6">
          <Button 
            onClick={handleActivateCenter}
            disabled={center.setupStatus === 'ACTIVE'}
            className={allApproved && center.setupStatus !== 'ACTIVE' ? "animate-pulse" : ""}
          >
            Verify & Activate Center
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document. This will be emailed directly to the Center Manager.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea 
                placeholder="e.g. Document is blurry, Expired date, Not matching PAN details..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Correction Notes (Optional)</label>
              <Textarea 
                placeholder="e.g. Please upload a scanned copy with all 4 corners visible."
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectDocument} disabled={!rejectionReason.trim()}>
              Confirm Rejection & Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
