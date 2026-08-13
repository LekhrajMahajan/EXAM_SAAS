import React, { useState } from 'react';
import { usePendingVerifications, useVerifyBranchSetup } from '../hooks/branch.hooks';
import { BranchHeader } from '../components/BranchHeader';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { CheckCircle, XCircle, Loader2, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BranchPendingVerificationsPage: React.FC = () => {
  const { data: response, isLoading, refetch } = usePendingVerifications();
  const verifyMutation = useVerifyBranchSetup();

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');

  const pendingBranches = response?.data || [];

  const handleApprove = (id: string) => {
    verifyMutation.mutate(
      { id, payload: { status: 'ACTIVE' } },
      { onSuccess: () => refetch() }
    );
  };

  const handleOpenReject = (id: string) => {
    setSelectedBranchId(id);
    setRejectionRemarks('');
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (!selectedBranchId) return;
    verifyMutation.mutate(
      { id: selectedBranchId, payload: { status: 'REJECTED', remarks: rejectionRemarks } },
      { 
        onSuccess: () => {
          setRejectDialogOpen(false);
          setSelectedBranchId(null);
          refetch();
        } 
      }
    );
  };

  return (
    <div className="space-y-6">
      <BranchHeader
        title="Branch Onboarding Verifications"
        description="Review submitted branch setups, inspect readiness evaluations, and authorize active dashboard permissions."
        actions={
          <Link to="/company/branches">
            <Button variant="outline" size="sm">Back to All Branches</Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : pendingBranches.length === 0 ? (
        <Card className="text-center py-16 border-dashed bg-muted/10">
          <CardHeader>
            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-60 mb-2" />
            <CardTitle className="text-xl font-bold">No Pending Verifications</CardTitle>
            <CardDescription className="max-w-md mx-auto mt-1">
              All branch setups have been processed or are currently being completed by Branch Managers.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[220px]">Branch Identity</TableHead>
                <TableHead>Location & Contact</TableHead>
                <TableHead className="text-center">Readiness Score</TableHead>
                <TableHead>Setup Status</TableHead>
                <TableHead className="text-right">Verification Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBranches.map((branch) => {
                const score = branch.readinessScore || 85;
                const badgeColor = score >= 80 ? 'bg-green-600 text-white' : score >= 50 ? 'bg-amber-500 text-white' : 'bg-destructive text-white';

                return (
                  <TableRow key={branch._id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground">{branch.branchName}</span>
                        <span className="text-xs text-muted-foreground font-mono">Code: {branch.branchCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{branch.city}, {branch.state}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium">{branch.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${badgeColor} px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1 shadow-sm`}>
                        <Sparkles className="h-3 w-3" />
                        {score} / 100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/5 text-xs inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-all"
                        onClick={() => handleOpenReject(branch._id)}
                        disabled={verifyMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Reject & Return
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all"
                        onClick={() => handleApprove(branch._id)}
                        disabled={verifyMutation.isPending}
                      >
                        {verifyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
                        Approve & Activate
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold">
              <XCircle className="h-5 w-5" /> Reject Branch Setup
            </DialogTitle>
            <DialogDescription>
              Provide explicit revision feedback for the Branch Manager explaining what needs correction in their setup wizard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              rows={4}
              placeholder="e.g., Uploaded safety inspection license is expired; please re-upload valid fire certificate."
              value={rejectionRemarks}
              onChange={(e) => setRejectionRemarks(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={verifyMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionRemarks.trim() || verifyMutation.isPending}>
              {verifyMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
