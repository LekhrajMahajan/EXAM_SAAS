import { useState } from "react";
import apiClient from "@/core/api/http/axios-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Building2, 
  MonitorSmartphone, 
  FileText, 
  CheckCircle2,
  Users,
  UserPlus,
  Monitor,
  Upload,
  ImageIcon,
  MapPin,
  Network,
  ClipboardList,
  FileCheck,
  Check,
  AlertCircle,
  Clock,
  XCircle,
  X,
  Trash2,
  Power
} from "lucide-react";
import { Link } from "react-router-dom";
import { CenterStatusBadge } from "./CenterStatusBadge";
import type { Center } from "../types/center.types";
import { useVerifyCenterSetup } from "../hooks/center.hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/shared/components/ui/switch";
interface CenterTableProps {
  centers: Center[];
}

interface DocItem {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'viewed' | 'approved' | 'rejected';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  url?: string;
  rejectionReason?: string;
}

export const CenterTable = ({ centers }: CenterTableProps) => {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [centerToDelete, setCenterToDelete] = useState<string | null>(null);
  const [docsList, setDocsList] = useState<DocItem[]>([]);
  const queryClient = useQueryClient();

  const verifyMutation = useVerifyCenterSetup();

  const statusUpdateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await apiClient.patch(`/centers/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Status Updated", description: "Center status has been updated successfully.", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    },
    onError: () => {
      toast({ title: "Update Failed", description: "Could not update center status.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/centers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Center Deleted", description: "Center has been permanently deleted.", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    },
    onError: () => {
      toast({ title: "Delete Failed", description: "Could not delete center.", variant: "destructive" });
    }
  });

  const handleOpenVerification = async (center: Center) => {
    setSelectedCenter(center);
    setDocsList([]); // Show loading state briefly

    const docTypeMapping: Record<string, {name: string, category: string}> = {
      "signed mou": { name: "MOU Agreement (Stamped & Signed)", category: "Statutory & Legal" },
      "pan card": { name: "PAN Card Document", category: "KYC verification" },
      "aadhaar card": { name: "Aadhaar Card Document", category: "KYC verification" },
      "cancelled cheque": { name: "Cancellation Cheque", category: "Banking Verification" },
      "gst certificate": { name: "GSTIN Registration Certificate", category: "Tax Compliance" },
    };

    let initialDocs: DocItem[] = [];

    try {
      const centerId = center.id || (center as any)._id;
      const res = await apiClient.get<{ success: boolean; data: Record<string, any> }>(`/centers/onboarding/status?centerId=${centerId}`);
      const onboardingData = res.data?.data;
      const documents = onboardingData?.documents || center.documents || [];

      if (Array.isArray(documents) && documents.length > 0) {
        initialDocs = documents.map((d: any, index: number) => {
          const typeKey = (d.documentType || "").toLowerCase();
          const typeInfo = docTypeMapping[typeKey] || { name: d.documentType || `Document ${index+1}`, category: "General" };
          
          const backendStatus = String(d.status || "").toLowerCase();
          let initialStatus: 'pending' | 'viewed' | 'approved' | 'rejected' = 'pending';
          if (backendStatus === 'approved') {
            initialStatus = 'approved';
          } else if (backendStatus === 'rejected') {
            initialStatus = 'rejected';
          }

          return {
            id: d._id || d.id || `doc-${index}`,
            name: typeInfo.name,
            category: typeInfo.category,
            status: initialStatus,
            fileName: d.fileName || `document_${index}.pdf`,
            fileSize: d.fileSize || "Unknown",
            uploadDate: d.uploadedAt ? new Date(d.uploadedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            url: d.documentUrl || d.fileUrl || ""
          };
        });
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
      toast({ title: "Warning", description: "Could not fetch documents dynamically.", variant: "destructive" });
    }

    setDocsList(initialDocs);
  };

  const handleViewDoc = (docId: string) => {
    const doc = docsList.find(d => d.id === docId);
    if (doc) {
      if (doc.url && doc.url.trim() !== "") {
        if (doc.url.startsWith("data:application/pdf;base64,")) {
          try {
            const base64Data = doc.url.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
          } catch (e) {
            console.error("Failed to open base64 PDF", e);
            window.open(doc.url, "_blank"); // Fallback
          }
        } else if (doc.url.startsWith("data:image")) {
           // For images, we can open in a new window or just create a simple html page
           const newWindow = window.open();
           if (newWindow) {
             newWindow.document.write(`<iframe src="${doc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
           }
        } else {
          window.open(doc.url, "_blank");
        }
      } else {
        // Fallback for mocked documents without URLs
        const dummyPdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        window.open(dummyPdfUrl, "_blank");
      }
      setDocsList(prev => prev.map(d => d.id === docId ? { ...d, status: 'viewed' } : d));
    }
  };

  const allViewed = docsList.length > 0 && docsList.every(d => d.status !== 'pending');

  const handleSubmitVerifications = async () => {
    if (!selectedCenter) return;
    const centerId = selectedCenter.id || selectedCenter._id || "";
    if (!centerId) return;

    const unreviewed = docsList.filter(d => d.status === 'pending' || d.status === 'viewed');
    if (unreviewed.length > 0) {
      toast({ title: "Incomplete Review", description: "Please explicitly Approve or Reject each viewed document.", variant: "destructive" });
      return;
    }

    try {
      // Submit individual document statuses
      for (const doc of docsList) {
        if (doc.status === 'approved') {
          await apiClient.patch(`/centers/documents/${doc.id}/approve?centerId=${centerId}`);
        } else if (doc.status === 'rejected') {
          await apiClient.patch(`/centers/documents/${doc.id}/reject?centerId=${centerId}`, { 
            rejectionReason: doc.rejectionReason, 
            correctionNotes: "Please re-upload a clear and correct copy." 
          });
        }
      }

      // Submit overall center status
      const hasRejections = docsList.some(d => d.status === 'rejected');
      const finalStatus = hasRejections ? 'REJECTED' : 'ACTIVE';
      const finalRemarks = hasRejections 
        ? "Some documents were rejected. Please review and re-upload the rejected documents." 
        : "All 5 statutory documents verified and approved.";

      verifyMutation.mutate({
        id: centerId,
        payload: { status: finalStatus, remarks: finalRemarks }
      }, {
        onSuccess: () => {
          toast({
            title: hasRejections ? "Verification Rejected" : "Center Approved & Unlocked!",
            description: hasRejections ? "Feedback sent to Center Manager." : "Center Manager dashboard unlocked.",
            variant: hasRejections ? "destructive" : "success",
          });
          setSelectedCenter(null);
        }
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Action Failed", description: "Could not submit verifications. Check server logs.", variant: "destructive" });
    }
  };

  return (
    <div className="rounded-xl border border-border dark:border-slate-800/80 bg-card dark:bg-[#111726]/80 shadow-xs overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border">
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Center Code</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Center Name</TableHead>

            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Location</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Capacity</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Approval</TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {centers.map((center, idx) => {
            const centerObj = center as unknown as Record<string, unknown>;
            const centerId = center.id || center._id || `center-${idx}`;

            const isApproved = String(center.approvalStatus).toLowerCase() === 'approved' || String(centerObj.setupStatus).toUpperCase() === 'ACTIVE';
            const statusVal = isApproved ? 'ACTIVE' : 'Pending Verification';
            const approvalVal = isApproved ? 'Approved' : 'Pending';
            
            const rooms = centerObj.totalLabs ?? center.capacity?.maxRooms ?? 1;
            const systems = centerObj.totalSystems ?? center.capacity?.maxSystems ?? (typeof center.capacity === 'number' ? center.capacity : null) ?? 20;
            const hasSubmittedDocuments = String(centerObj.setupStatus).toUpperCase() === 'SUBMITTED' || 
                                          String(centerObj.setupStatus).toUpperCase() === 'PENDING_VERIFICATION' || 
                                          (typeof centerObj.setupCurrentStep === 'number' && centerObj.setupCurrentStep >= 8) || 
                                          String(approvalVal).toLowerCase() === 'submitted' ||
                                          (Array.isArray(centerObj.documents) && centerObj.documents.some((d: Record<string, unknown>) => d.fileUrl && d.fileUrl !== "" && d.fileUrl !== "#" && d.fileName !== "Pending Upload")) ||
                                          (Array.isArray(centerObj.verificationDocuments) && centerObj.verificationDocuments.length > 0);

            return (
              <TableRow key={centerId} className="hover:bg-muted/50 border-b transition-colors">
                <TableCell className="font-semibold text-foreground py-3.5">{center.centerCode || 'N/A'}</TableCell>
                <TableCell className="text-foreground font-medium py-3.5">{center.centerName || 'Unnamed Center'}</TableCell>

                <TableCell className="py-3.5">
                  <div className="text-sm font-medium text-foreground">
                    {center.city || 'N/A'}
                    <span className="text-muted-foreground block text-xs mt-0.5 font-normal">
                      {center.state || 'India'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="text-sm text-foreground">
                    Labs: <span className="font-medium text-foreground">{String(rooms)}</span>
                    <span className="text-muted-foreground block text-xs mt-0.5">
                      Systems: <span className="font-medium text-foreground">{String(systems)}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <CenterStatusBadge status={statusVal as any} />
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-2">

                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary border-0 text-[#2D3E2C]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#2D3E2C]" />
                        Approved & Unlocked
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenVerification(center)}
                        className="h-8 text-xs px-3.5 border-[#2D3E2C] bg-white text-[#2D3E2C] flex items-center gap-1.5 rounded-lg shadow-sm font-semibold"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        Verify Documents
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right py-3.5 flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      setCenterToDelete(centerId);
                    }}
                    disabled={deleteMutation.isPending && deleteMutation.variables === centerId}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground shadow-xl max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-200/50 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <Link to={`/company/centers/${centerId}`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Eye className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">View Details</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/edit`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Edit className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Edit Info</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/staff`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Users className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Center Staff Add</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/labs`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Monitor className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Center Lab Add</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assigned-exams`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <ClipboardList className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Assigned Exams</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/infrastructure`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Upload className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Center Infrastructure</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/photos`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <ImageIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Center Photos</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/location`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Center Location</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/system-network`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Network className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">System Network</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assign-exam-staff`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <UserPlus className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Assign Exam Staff</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assigned-candidate-attendance`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-secondary/10 flex items-center gap-2.5 py-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                            <Users className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground">Assigned Candidate Attendance</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {centers.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-slate-400 font-medium">
                No centers found. Click &quot;Add Center&quot; above to provision your first examination center.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* DOCUMENT VERIFICATION MODAL */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-muted/30 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-secondary text-secondary-foreground border border-secondary/10 shadow-sm">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-wide">
                    Center Document Verification
                  </h3>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-secondary text-secondary-foreground shadow-sm uppercase">
                    {selectedCenter.centerCode}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Review all statutory & legal documents submitted by center manager for <span className="text-foreground font-semibold">{selectedCenter.centerName}</span>.
                </p>
              </div>
              <button 
                onClick={() => setSelectedCenter(null)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Alert guidance */}
              <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all shadow-sm ${
                allViewed 
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-800" 
                  : "bg-secondary/10 border-secondary/15 text-[#2D3E2C]"
              }`}>
                <div className={`p-2.5 rounded-xl ${allViewed ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-[#2D3E2C] shadow-sm"}`}>
                  {allViewed ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 animate-bounce" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-semibold">
                    {allViewed 
                      ? "All submitted documents have been inspected!" 
                      : "Action Required: View & inspect all documents to enable approval."
                    }
                  </p>
                  <p className="text-xs opacity-90 mt-0.5">
                    {allViewed
                      ? "You may now approve the center setup to instantly unlock the Center Manager's dashboard and sidebar navigation menus."
                      : "Please click 'View' on each document below to verify authenticity (PAN, Aadhaar, Cheque, GSTIN, MOU) before approving."
                    }
                  </p>
                </div>
                <div className="ml-auto font-bold text-sm tracking-wider px-3 py-1 bg-white rounded-lg border border-border shadow-sm">
                  {docsList.filter(d => d.status !== 'pending').length} / {docsList.length} Viewed
                </div>
              </div>

              {/* Documents Grid / Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#2D3E2C] uppercase tracking-wider flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-secondary text-[#2D3E2C] shadow-sm">
                    <FileText className="h-4 w-4" />
                  </div>
                  Uploaded Statutory Documents ({docsList.filter(d => d.url).length}/{docsList.length} Received)
                </h4>
                
                <div className="border border-border rounded-xl divide-y divide-border bg-card overflow-hidden">
                  {docsList.map((doc) => {
                    const isViewed = doc.status !== 'pending';
                    return (
                      <div key={doc.id} className="p-4 flex flex-col items-start gap-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`p-2.5 rounded-lg border ${
                              doc.status === 'approved' ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                              doc.status === 'rejected' ? "bg-rose-50 border-rose-200 text-rose-600" :
                              isViewed ? "bg-secondary/10 border-secondary/20 text-[#2D3E2C]" : 
                              "bg-slate-100 border-slate-200 text-slate-500"
                            }`}>
                              {doc.status === 'approved' ? <CheckCircle2 className="h-5 w-5" /> :
                               doc.status === 'rejected' ? <XCircle className="h-5 w-5" /> :
                               <FileText className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-foreground">{doc.name}</h5>
                                {doc.fileName === "Pending Upload" || !doc.url ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                    Not Uploaded
                                  </span>
                                ) : doc.status === 'approved' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <Check className="h-2.5 w-2.5" /> Approved
                                  </span>
                                ) : doc.status === 'rejected' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
                                    <X className="h-2.5 w-2.5" /> Rejected
                                  </span>
                                ) : isViewed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#2D3E2C] text-[#E4FD97] border border-[#2D3E2C]">
                                    <Eye className="h-2.5 w-2.5" /> Viewed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                    Unviewed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                                <span>File: <strong className="text-foreground">{doc.fileName}</strong></span>
                                <span>Size: <strong className="text-foreground">{doc.fileSize}</strong></span>
                                <span>Uploaded: <strong className="text-foreground">{doc.uploadDate}</strong></span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {doc.status === 'viewed' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const centerId = selectedCenter?.id || (selectedCenter as any)?._id || "";
                                      await apiClient.patch(`/centers/documents/${doc.id}/approve?centerId=${centerId}`);
                                      setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'approved' } : d));
                                      toast({ title: "Document Approved", variant: "default" });
                                    } catch (error) {
                                      toast({ title: "Failed to approve", variant: "destructive" });
                                    }
                                  }}
                                  className="bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-white font-semibold shadow-sm h-8 px-4"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'rejected' } : d))}
                                  className="border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold shadow-sm h-8 px-3"
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {doc.fileName !== "Pending Upload" && doc.url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDoc(doc.id)}
                                className={`text-xs px-3.5 py-1.5 h-8 font-semibold rounded-lg shadow-sm border transition-all ${
                                  isViewed 
                                    ? "bg-white border-border text-foreground hover:bg-muted" 
                                    : "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-secondary"
                                }`}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                {isViewed ? "View Again" : "View & Inspect"}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Document-specific Rejection Input */}
                        {doc.status === 'rejected' && (
                          <div className="w-full mt-2 p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                            <h6 className="text-xs font-bold text-rose-700 mb-2">Rejection Reason for {doc.name}</h6>
                            <textarea
                              rows={2}
                              value={doc.rejectionReason || ""}
                              onChange={(e) => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, rejectionReason: e.target.value } : d))}
                              placeholder="E.g., Document is blurry, signature is missing, etc."
                              className="w-full bg-white border border-rose-200 rounded p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                            />
                            <div className="mt-2 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'viewed', rejectionReason: "" } : d))}
                                className="h-6 px-2 text-[10px] bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              >
                                Cancel Rejection
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer (Dynamic Submit Button) */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs flex items-center gap-2">
                {docsList.length > 0 && docsList.every(d => d.status === 'approved' || d.status === 'rejected') ? (
                  <span className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4" /> All documents reviewed. You can now submit verifications.
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-[#2D3E2C] font-semibold bg-secondary/50 px-3 py-1.5 rounded-lg border border-secondary">
                    <AlertCircle className="h-4 w-4" /> View and explicitly approve/reject every document to proceed.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  onClick={handleSubmitVerifications}
                  disabled={!docsList.every(d => d.status === 'approved' || d.status === 'rejected') || verifyMutation.isPending}
                  className={`font-bold px-5 shadow-sm transition-all flex items-center gap-2 ${
                    docsList.length > 0 && docsList.every(d => d.status === 'approved' || d.status === 'rejected')
                      ? "bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-white cursor-pointer" 
                      : "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-70"
                  }`}
                >
                  <FileCheck className="h-4 w-4" />
                  Submit Verifications
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!centerToDelete} onOpenChange={(open) => !open && setCenterToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the center and all associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCenterToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (centerToDelete) {
                deleteMutation.mutate(centerToDelete);
                setCenterToDelete(null);
              }
            }}>
              {deleteMutation.isPending ? "Deleting..." : "Delete Center"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
