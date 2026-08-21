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
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { CenterStatusBadge } from "./CenterStatusBadge";
import type { Center } from "../types/center.types";
import { useVerifyCenterSetup } from "../hooks/center.hooks";
import { toast } from "@/hooks/use-toast";

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
  const [docsList, setDocsList] = useState<DocItem[]>([]);

  const verifyMutation = useVerifyCenterSetup();

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
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Branch</TableHead>
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
            const branchLabel = typeof center.branch === 'object' && center.branch
              ? (center.branch as Record<string, unknown>).name || (center.branch as Record<string, unknown>).branchName || 'Branch'
              : center.branch || centerObj.branchName || 'Main Hub';
            const rooms = centerObj.totalLabs ?? center.capacity?.maxRooms ?? 1;
            const systems = centerObj.totalSystems ?? center.capacity?.maxSystems ?? (typeof center.capacity === 'number' ? center.capacity : null) ?? 20;
            const statusVal = center.status || (centerObj.setupStatus === 'ACTIVE' ? 'Active' : 'Inactive');
            const approvalVal = center.approvalStatus || (centerObj.setupStatus === 'ACTIVE' ? 'Approved' : 'Pending');
            const isApproved = String(approvalVal).toLowerCase() === 'approved' || centerObj.setupStatus === 'ACTIVE';
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
                <TableCell className="text-muted-foreground py-3.5">{String(branchLabel)}</TableCell>
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
                  <CenterStatusBadge status={statusVal as 'Active' | 'Inactive'} />
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex items-center">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E4FD97] border-0 text-[#2D3E2C]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#2D3E2C]" />
                        Approved & Unlocked
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenVerification(center)}
                        className="h-8 text-xs px-3.5 border-indigo-500/50 bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 rounded-lg shadow-sm transition-all font-semibold"
                      >
                        <FileCheck className="h-3.5 w-3.5 text-indigo-300" />
                        Verify Documents
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground shadow-xl">
                      <Link to={`/company/centers/${centerId}`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                          View Details
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/edit`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Edit className="mr-2 h-4 w-4 text-slate-500" />
                          Edit Info
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/staff`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Users className="mr-2 h-4 w-4 text-slate-500" />
                          Center Staff Add
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/labs`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Monitor className="mr-2 h-4 w-4 text-slate-500" />
                          Center Lab Add
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assigned-exams`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <ClipboardList className="mr-2 h-4 w-4 text-slate-500" />
                          Assigned Exams
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/infrastructure`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Upload className="mr-2 h-4 w-4 text-slate-500" />
                          Center Infrastructure
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/photos`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <ImageIcon className="mr-2 h-4 w-4 text-slate-500" />
                          Center Photos
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/location`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <MapPin className="mr-2 h-4 w-4 text-slate-500" />
                          Center Location
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/system-network`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Network className="mr-2 h-4 w-4 text-slate-500" />
                          System Network
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assign-exam-staff`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <UserPlus className="mr-2 h-4 w-4 text-slate-500" />
                          Assign Exam Staff
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/company/centers/${centerId}/assigned-candidate-attendance`}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Users className="mr-2 h-4 w-4 text-slate-500" />
                          Assigned Candidate Attendance
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#141B2D] to-[#0F1626] border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Center Document Verification
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {selectedCenter.centerCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Review all statutory & legal documents submitted by center manager for <span className="text-white font-semibold">{selectedCenter.centerName}</span>.
                </p>
              </div>
              <button 
                onClick={() => setSelectedCenter(null)}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Alert guidance */}
              <div className={`p-4 rounded-xl border flex items-center gap-3.5 transition-colors ${
                allViewed 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}>
                {allViewed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-400 shrink-0 animate-bounce" />
                )}
                <div className="text-sm">
                  <p className="font-semibold text-white">
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
                <div className="ml-auto font-bold text-sm tracking-wider px-3 py-1 bg-black/30 rounded-lg border border-white/10">
                  {docsList.filter(d => d.status !== 'pending').length} / {docsList.length} Viewed
                </div>
              </div>

              {/* Documents Grid / Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Uploaded Statutory Documents (5/5 Received)
                </h4>
                
                <div className="border border-slate-800 rounded-xl divide-y divide-slate-800/80 bg-[#111726]/50 overflow-hidden">
                  {docsList.map((doc) => {
                    const isViewed = doc.status !== 'pending';
                    return (
                      <div key={doc.id} className="p-4 flex flex-col items-start gap-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`p-2.5 rounded-lg border ${
                              doc.status === 'approved' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                              doc.status === 'rejected' ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                              isViewed ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : 
                              "bg-slate-800/80 border-slate-700 text-slate-400"
                            }`}>
                              {doc.status === 'approved' ? <CheckCircle2 className="h-5 w-5" /> :
                               doc.status === 'rejected' ? <XCircle className="h-5 w-5" /> :
                               <FileText className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-slate-200">{doc.name}</h5>
                                {doc.fileName === "Pending Upload" || !doc.url ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-500/15 text-slate-400 border border-slate-500/30">
                                    Not Uploaded
                                  </span>
                                ) : doc.status === 'approved' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <Check className="h-2.5 w-2.5" /> Approved
                                  </span>
                                ) : doc.status === 'rejected' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                    <X className="h-2.5 w-2.5" /> Rejected
                                  </span>
                                ) : isViewed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    <Eye className="h-2.5 w-2.5" /> Viewed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    Unviewed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                <span>File: <strong className="text-slate-300">{doc.fileName}</strong></span>
                                <span>Size: <strong className="text-slate-300">{doc.fileSize}</strong></span>
                                <span>Uploaded: <strong className="text-slate-300">{doc.uploadDate}</strong></span>
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
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs h-8 px-3"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'rejected' } : d))}
                                  className="border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold shadow-xs h-8 px-3"
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
                                className={`text-xs px-3.5 py-1.5 h-8 font-semibold rounded-lg shadow-xs border transition-all ${
                                  isViewed 
                                    ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700" 
                                    : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-blue-500/20"
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
                          <div className="w-full mt-2 p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                            <h6 className="text-xs font-bold text-rose-400 mb-2">Rejection Reason for {doc.name}</h6>
                            <textarea
                              rows={2}
                              value={doc.rejectionReason || ""}
                              onChange={(e) => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, rejectionReason: e.target.value } : d))}
                              placeholder="E.g., Document is blurry, signature is missing, etc."
                              className="w-full bg-[#0A0D14] border border-rose-500/30 rounded p-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                            />
                            <div className="mt-2 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDocsList(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'viewed', rejectionReason: "" } : d))}
                                className="h-6 px-2 text-[10px] bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
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
            <div className="px-6 py-4 bg-[#141A29] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                {docsList.length > 0 && docsList.every(d => d.status === 'approved' || d.status === 'rejected') ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> All documents reviewed. You can now submit verifications.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <AlertCircle className="h-4 w-4" /> View and explicitly approve/reject every document to proceed.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  onClick={handleSubmitVerifications}
                  disabled={!docsList.every(d => d.status === 'approved' || d.status === 'rejected') || verifyMutation.isPending}
                  className={`font-bold px-5 shadow-lg transition-all flex items-center gap-2 ${
                    docsList.length > 0 && docsList.every(d => d.status === 'approved' || d.status === 'rejected')
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 scale-102 cursor-pointer" 
                      : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50"
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
    </div>
  );
};
