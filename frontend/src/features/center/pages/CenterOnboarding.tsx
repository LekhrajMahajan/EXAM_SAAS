import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Download, UploadCloud, ShieldCheck, Clock, LogOut } from "lucide-react";
import apiClient from "@/core/api/http/axios-client";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { toast } from "react-hot-toast";
import { logout } from '@/features/auth/api/auth.api';

const REQUIRED_DOCUMENTS = [
  { type: "Signed MOU", label: "Signed & Stamped MOU" },
  { type: "PAN Card", label: "Center PAN Card" },
  { type: "Aadhaar Card", label: "Manager Aadhar Card" },
  { type: "GST Certificate", label: "GST Certificate (If Applicable)", optional: true },
  { type: "Cancelled Cheque", label: "Cancelled Cheque" },
];

export function CenterOnboarding() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [centerData, setCenterData] = useState<any>(null);
  
  const [isPricingAccepted, setIsPricingAccepted] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        const res = await apiClient.post("/centers/onboarding/start");
        setCenterData(res.data.data);
        if (res.data.data?.setupStatus === 'REJECTED') {
          setIsPricingAccepted(true);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load onboarding data");
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, []);

  const docsToUpload = React.useMemo(() => {
    if (!centerData?.documents || centerData.documents.length === 0) {
      return REQUIRED_DOCUMENTS;
    }
    return REQUIRED_DOCUMENTS.filter((reqDoc) => {
      const existingDoc = centerData.documents.find((d: any) => d.documentType === reqDoc.type);
      if (!existingDoc || !existingDoc.fileUrl) return true;
      if (existingDoc.status === 'REJECTED') return true;
      return false;
    });
  }, [centerData]);

  const handleFileChange = (type: string, file: File | null) => {
    setUploadedDocs((prev) => {
      const updated = { ...prev };
      if (file) {
        updated[type] = file;
      } else {
        delete updated[type];
      }
      return updated;
    });
  };

  const allMandatoryUploaded = docsToUpload.every(
    (doc) => doc.optional || !!uploadedDocs[doc.type]
  );

  const handleSubmit = async () => {
    if (!isPricingAccepted) {
      toast.error("Please accept the commercial agreement first.");
      return;
    }
    if (!allMandatoryUploaded) {
      toast.error("Please upload all mandatory documents.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Accept Pricing (Agreement)
      await apiClient.put("/centers/onboarding/agreement", {});

      // 2. Upload Files
      const documentPayload = [];
      
      const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      for (const reqDoc of docsToUpload) {
        const file = uploadedDocs[reqDoc.type];
        if (file) {
          try {
            const base64Str = await toBase64(file);
            const sizeInKb = file.size / 1024;
            const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${sizeInKb.toFixed(2)} KB`;
            documentPayload.push({
              documentType: reqDoc.type,
              isMandatory: !reqDoc.optional,
              fileName: file.name,
              fileSize: formattedSize,
              fileUrl: base64Str,
            });
          } catch (e) {
            console.error("File convert error", e);
          }
        }
      }

      // 3. Save Documents to Center
      await apiClient.put("/centers/onboarding/documents", {
        documents: documentPayload
      });

      // 4. Submit Onboarding
      await apiClient.post("/centers/onboarding/submit", {});
      
      toast.success("Verification documents submitted successfully!");
      
      setCenterData((prev: any) => ({ ...prev, setupStatus: 'PENDING_VERIFICATION' }));
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Logout API failed', error);
    } finally {
      clearAuth();
      navigate('/auth/login', { replace: true });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading onboarding setup...</div>;
  }

  if (centerData?.setupStatus === 'PENDING_VERIFICATION') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex justify-end mb-6">
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Back to Login
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-2xl shadow-sm text-center">
          <div className="p-4 bg-amber-500/10 rounded-full mb-6">
            <Clock className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Verification Pending</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Your documents have been submitted successfully and are currently under review by the Company Admin.
            You will gain full access to the dashboard once they are approved.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Status
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end mb-2">
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Back to Login
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to {centerData?.centerName || "Exam Center"}</h1>
        <p className="text-muted-foreground">Complete these quick verification steps to unlock your dashboard and begin managing operations.</p>
      </div>


      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-5 mb-8">
        <h3 className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
          <ShieldCheck className="h-5 w-5" />
          Important Instructions for Onboarding
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-400">
          <li>Please <strong>download</strong> the MOU sent to you from here. Affix your seal/stamp, sign it, and upload it back.</li>
          <li>In addition, uploading 4 essential documents <strong>(PAN CARD, AADHAR CARD, GSTIN, and CANCELLED CHEQUE)</strong> is mandatory.</li>
          <li>Your <strong>Dashboard and Sidebar Menu will not unlock</strong> until you upload all the documents and accept the pricing terms.</li>
          <li>After you submit the documents, the Company Admin will verify them. Once verified, your account will become fully active.</li>
        </ul>
      </div>

      {centerData?.setupStatus === 'REJECTED' && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-5 mb-8">
          <h3 className="font-semibold mb-2">Documents Rejected</h3>
          <p className="text-sm">One or more of your documents were rejected by the Company Admin. Please review the reasons and re-upload the required documents below.</p>
        </div>
      )}

      {centerData?.setupStatus !== 'REJECTED' && (
      <Card>
        <CardHeader>
          <CardTitle>1. Commercial Agreement & Shift Pricing</CardTitle>
          <CardDescription>Review the pricing allocated for your center.</CardDescription>
        </CardHeader>
        <CardContent>
          {centerData?.commercialAgreement?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {centerData.commercialAgreement.map((shift: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                  <div className="font-semibold text-sm mb-1">{shift.shiftName || "Shift"}</div>
                  <div className="text-xl font-bold text-primary mt-2">₹{shift.pricePerCandidate || 250} <span className="text-sm font-normal text-muted-foreground">/ seat</span></div>
                </div>
              ))}
            </div>
          ) : centerData?.shiftRates?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {centerData.shiftRates.map((shift: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                  <div className="font-semibold text-sm mb-1">{shift.name || shift.shiftName || "Shift"}</div>
                  <div className="text-xl font-bold text-primary mt-2">₹{shift.price || shift.pricePerCandidate || 250} <span className="text-sm font-normal text-muted-foreground">/ seat</span></div>
                </div>
              ))}
            </div>
          ) : centerData?.shifts?.length > 0 && typeof centerData.shifts[0] === 'object' ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {centerData.shifts.map((shift: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                  <div className="font-semibold text-sm mb-1">{shift.name || shift.shiftName || "Shift"}</div>
                  <div className="text-xl font-bold text-primary mt-2">₹{shift.price || shift.pricePerCandidate || 250} <span className="text-sm font-normal text-muted-foreground">/ seat</span></div>
                </div>
              ))}
            </div>
          ) : centerData?.shifts?.length > 0 && typeof centerData.shifts[0] === 'string' ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {centerData.shifts.map((shiftStr: string, idx: number) => {
                const parts = shiftStr.split(" - ₹");
                const nameAndTiming = parts[0] || shiftStr;
                const pricePart = parts[1] ? parts[1].replace("/seat", "") : "250";
                
                return (
                  <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                    <div className="font-semibold text-sm mb-1">{nameAndTiming.split("(")[0]?.trim() || "Shift"}</div>
                    <div className="text-xl font-bold text-primary mt-2">₹{pricePart} <span className="text-sm font-normal text-muted-foreground">/ seat</span></div>
                  </div>
                );
              })}
            </div>
          ) : centerData?.shiftPlans?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {centerData.shiftPlans.map((shift: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                  <div className="font-semibold text-sm mb-1">{shift.shiftName || "Shift"}</div>
                  <div className="text-xs text-muted-foreground mb-3">Capacity: {shift.maximumCandidates || 100} Candidates</div>
                  <div className="text-xl font-bold text-primary">₹{shift.expectedRevenue ? Math.round(shift.expectedRevenue / (shift.maximumCandidates || 1)) : 250} <span className="text-sm font-normal text-muted-foreground">/ seat (est)</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border rounded bg-yellow-50 text-yellow-800 mb-6 flex flex-col gap-2">
              <p>No shift pricing configured yet.</p>
              <div className="text-xs opacity-70">
                Please contact the Company Admin to configure shift pricing in the admin dashboard. 
                <i>(If pricing was just configured, please log out and log back in or refresh to see the latest changes).</i>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 border rounded-lg bg-blue-50/50">
             <input 
               type="checkbox" 
               id="accept-pricing" 
               className="w-5 h-5 text-primary rounded" 
               checked={isPricingAccepted}
               onChange={(e) => setIsPricingAccepted(e.target.checked)}
             />
             <label htmlFor="accept-pricing" className="text-sm font-medium cursor-pointer">
               I have reviewed and accept the commercial shift pricing terms assigned by the Company Admin.
             </label>
          </div>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{centerData?.setupStatus === 'REJECTED' ? '1. ' : '2. '}Mandatory Document Uploads</CardTitle>
          <CardDescription>Upload your signed MOU and identification documents to proceed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div>
              <h4 className="font-semibold text-sm">Download MOU Template</h4>
              <p className="text-xs text-muted-foreground">Download, sign, stamp, and re-upload the MOU below.</p>
            </div>
            {centerData?.mouFileName || centerData?.mouPdfUrl ? (
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = centerData?.mouPdfUrl;
                    let dlUrl = '/mou_template.pdf';
                    if (url) {
                      dlUrl = url;
                    }
                    const link = document.createElement('a');
                    link.href = dlUrl;
                    link.target = '_blank';
                    link.download = url ? 'Center_MOU.pdf' : 'MOU_Template.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
              >
                <Download className="w-4 h-4 mr-2" /> Download MOU
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>Not Available</Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {docsToUpload.map((doc) => {
              const existingDoc = centerData?.documents?.find((d: any) => d.documentType === doc.type);
              const isRejected = existingDoc?.status === 'REJECTED';
              
              return (
              <div key={doc.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                   <h5 className="font-semibold text-sm">
                     {doc.label} {!doc.optional && <span className="text-red-500">*</span>}
                   </h5>
                   {uploadedDocs[doc.type] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                
                {isRejected && existingDoc?.rejectionReason && (
                  <div className="mb-4 text-xs bg-red-50 text-red-700 p-2 rounded border border-red-100">
                    <strong>Reason for rejection:</strong> {existingDoc.rejectionReason}
                    {existingDoc.correctionNotes && <div className="mt-1"><strong>Notes:</strong> {existingDoc.correctionNotes}</div>}
                  </div>
                )}
                
                <input
                  type="file"
                  id={`file-${doc.type}`}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                />
                
                {!uploadedDocs[doc.type] ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed h-20 bg-muted/20"
                    onClick={() => document.getElementById(`file-${doc.type}`)?.click()}
                  >
                    <UploadCloud className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground font-normal">Click to upload</span>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs truncate bg-muted p-2 rounded border">
                      {uploadedDocs[doc.type].name}
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 h-8" onClick={() => handleFileChange(doc.type, null)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )})}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex items-center justify-between rounded-b-xl border-t">
           <div className="text-sm text-muted-foreground">
             Please ensure all documents are clear and readable.
           </div>
           <Button 
             size="lg" 
             onClick={handleSubmit} 
             disabled={!isPricingAccepted || !allMandatoryUploaded || isSubmitting}
           >
             {isSubmitting ? "Submitting..." : "Submit for Verification"} <ChevronRight className="w-4 h-4 ml-2" />
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
