import React, { useState, useMemo } from 'react';
import { useUserStore } from '@/stores/user/user.store';
import { useOnboardingStatus, useSaveOnboardingStep, useSubmitOnboarding } from '../hooks/center.hooks';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Building2, 
  FileText, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Lock,
  Calendar,
  Layers,
  Download
} from 'lucide-react';

interface OnboardingStatusData {
  setupCurrentStep?: number;
  setupStatus?: string;
  readinessScore?: number;
  complianceScore?: number;
  adminReviewRemarks?: string;
  documents?: any[];
  [key: string]: any;
}

interface WizardFormData {
  digitalSignature?: string;
  agreementAccepted?: boolean;
  address?: string;
  pincode?: string;
  emergencyContact?: string;
  shiftCapacity?: number;
  bufferSystems?: number;
  cctvDensity?: string;
  staticIps?: string;
  complianceNotes?: string;
  [key: string]: string | number | boolean | undefined;
}

export const CenterSetupWizardPage: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const { data: statusResponse, isLoading: isStatusLoading, refetch } = useOnboardingStatus();
  const statusData: OnboardingStatusData = statusResponse?.data || {};

  const saveStepMutation = useSaveOnboardingStep();
  const submitMutation = useSubmitOnboarding();

  const [currentStep, setCurrentStep] = useState<number>(profile?.centerSetupCurrentStep || statusData.setupCurrentStep || 1);
  const [uploadedDocsState, setUploadedDocsState] = useState<Record<string, { fileName: string; fileUrl: string; isMandatory: boolean }>>({});
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [formData, setFormData] = useState<WizardFormData>({
    digitalSignature: '',
    agreementAccepted: false,
    address: '',
    pincode: '',
    emergencyContact: '',
    shiftCapacity: 200,
    bufferSystems: 10,
    cctvDensity: '1 camera per 20 desks',
    staticIps: '192.168.1.10 - 192.168.1.50',
    complianceNotes: 'All fire safety exits, UPS backups, and biometric gates tested successfully.',
  });

  const uploadedDocs = useMemo(() => {
    const docsMap: Record<string, { fileName: string; fileUrl: string; isMandatory: boolean }> = { ...uploadedDocsState };
    if (statusResponse?.data?.documents && Array.isArray(statusResponse.data.documents)) {
      statusResponse.data.documents.forEach((d: any) => {
        if (d && d.documentType && !docsMap[d.documentType]) {
          docsMap[d.documentType] = {
            fileName: d.fileName || d.documentType + ".pdf",
            fileUrl: d.fileUrl || "https://storage.practice-exam.com/docs/" + d.documentType + ".pdf",
            isMandatory: d.isMandatory !== undefined ? d.isMandatory : true,
          };
        }
      });
    }
    return docsMap;
  }, [statusResponse, uploadedDocsState]);

  const centerInfo = (statusResponse?.data as any) || {};
  const userProfile = (profile as any) || {};

  if (isStatusLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Loading Center Onboarding Wizard...</p>
      </div>
    );
  }

  const setupStatus = statusData.setupStatus || profile?.centerSetupStatus || 'DRAFT';
  const readinessScore = statusData.readinessScore || 0;
  const complianceScore = statusData.complianceScore || 0;
  const adminRemarks = statusData.adminReviewRemarks || '';

  // Render Read-Only View if Under Review
  if (setupStatus === 'PENDING_VERIFICATION') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="border-amber-500/30 bg-linear-to-br from-amber-500/5 via-card to-card shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-8 border-b">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 animate-pulse">
              <Clock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Center Setup Under Administrative Review</CardTitle>
            <CardDescription className="text-base mt-2">
              Your onboarding setup and statutory document portfolio have been successfully submitted and are awaiting official verification by the Company Admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/40 rounded-xl border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Current Status</p>
                <p className="font-bold text-amber-600 mt-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Pending Verification
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">Readiness Score</p>
                <Badge className="mt-1 text-base px-3 py-0.5 bg-emerald-600 text-white font-bold">
                  {readinessScore} / 100
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold">Compliance Index</p>
                <Badge className="mt-1 text-base px-3 py-0.5 bg-blue-600 text-white font-bold">
                  {complianceScore}%
                </Badge>
              </div>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-foreground">
              <p className="font-semibold flex items-center gap-2 mb-1 text-blue-600">
                <Lock className="h-4 w-4" /> Operational Access Restriction Active
              </p>
              Your Center Manager sidebar and operational modules (shift sessions, live attendance monitoring, and seating plans) remain locked until Company Admin document verification completes. Upon verification and approval, access is automatically unlocked.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { step: 1, endpoint: 'agreement', title: 'Commercial Agreement', icon: FileText, desc: 'Sign MOU and accept shift-wise commercial SLA billing structures' },
    { step: 2, endpoint: 'profile', title: 'Profile & Emergency Contacts', icon: Building2, desc: 'Configure facility location address and designated exam incident contacts' },
    { step: 3, endpoint: 'documents', title: 'Statutory Documents Upload', icon: FileText, desc: 'Upload mandatory Fire NOC, Building Safety, and ISP bandwidth agreements' },
    { step: 4, endpoint: 'staff', title: 'Staff & Invigilators Roster', icon: Users, desc: 'Assign center supervisors, technical support engineers, and proctor rosters' },
    { step: 5, endpoint: 'infrastructure', title: 'Infrastructure & Nodes', icon: Layers, desc: 'Configure biometric turnstiles, CCTV DVR IP streams, and UPS backup generators' },
    { step: 6, endpoint: 'readiness', title: 'Automated Readiness Audit', icon: Sparkles, desc: 'Execute algorithmic 100-point infrastructure and security evaluation' },
    { step: 7, endpoint: 'shift-planning', title: 'Shift & Capacity Allocation', icon: Calendar, desc: 'Allocate daily testing shifts, seating quotas, and emergency buffer PCs' },
    { step: 8, endpoint: 'compliance', title: 'Final Compliance & Submit', icon: ShieldCheck, desc: 'Complete testing checklists and transmit profile for administrative review' }
  ];

  const handleNext = async () => {
    const currentStepConfig = steps.find(s => s.step === currentStep) || steps[0];
    let payload: any = { ...formData, step: currentStep };

    if (currentStep === 3) {
      const docEntries = Object.entries(uploadedDocs).map(([docType, val]) => ({
        documentType: docType,
        fileName: val.fileName,
        fileUrl: val.fileUrl,
        isMandatory: val.isMandatory !== undefined ? val.isMandatory : true,
        status: "PENDING"
      }));
      payload = { ...payload, documents: docEntries };
    }

    if (currentStep === 8) {
      // Submit full onboarding for verification
      submitMutation.mutate(undefined, {
        onSuccess: () => {
          if (profile && setProfile) {
            setProfile({ ...profile, centerSetupStatus: 'PENDING_VERIFICATION', centerSetupCurrentStep: 8 });
          }
          refetch();
        },
      });
      return;
    }

    saveStepMutation.mutate(
      { endpoint: currentStepConfig.endpoint, data: payload },
      {
        onSuccess: (res: { readinessScore?: number }) => {
          const nextStep = Math.min(currentStep + 1, 8);
          setCurrentStep(nextStep);
          if (profile && setProfile) {
            setProfile({ ...profile, centerSetupCurrentStep: nextStep });
          }
          if (res?.readinessScore !== undefined) {
            refetch();
          }
        },
      }
    );
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps.find((s) => s.step === currentStep) || steps[0];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Rejection Alert Header */}
      {setupStatus === 'REJECTED' && (
        <div className="bg-destructive/10 border-2 border-destructive text-destructive rounded-xl p-5 shadow-sm flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-base">Center Onboarding Revision Required</h4>
            <p className="text-sm font-medium text-foreground">
              Company Admin reviewed your setup and provided revision instructions: <span className="font-bold text-destructive">&quot;{adminRemarks || 'Please re-verify uploaded documents and correct shift capacity totals.'}&quot;</span>
            </p>
            <p className="text-xs text-muted-foreground">Please update the required fields below and resubmit Step 8 for administrative verification.</p>
          </div>
        </div>
      )}

      {/* Title & Progress Bar */}
      <div className="space-y-4 bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 px-3 py-1 font-bold text-xs uppercase">
              Phase 5.3 Enterprise Onboarding
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Center Manager Setup Wizard</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete all mandatory stages to activate your test center operational authorization.</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs text-muted-foreground font-bold uppercase">Setup Progress</span>
            <span className="text-2xl font-black text-primary">Step {currentStep} of 8 ({Math.round((currentStep / 8) * 100)}%)</span>
          </div>
        </div>
        <Progress value={(currentStep / 8) * 100} className="h-3 rounded-full bg-muted" />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {steps.map((item) => {
          const Icon = item.icon;
          const isCurrent = item.step === currentStep;
          const isCompleted = item.step < currentStep;

          return (
            <button
              key={item.step}
              onClick={() => item.step <= (statusData.setupCurrentStep || currentStep) && setCurrentStep(item.step)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                isCurrent
                  ? 'border-primary bg-primary/10 text-primary shadow-md font-bold'
                  : isCompleted
                  ? 'border-green-500/30 bg-green-500/5 text-green-600 font-semibold hover:bg-green-500/10'
                  : 'border-muted opacity-50 bg-card cursor-not-allowed text-muted-foreground'
              }`}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5 mb-1 text-green-600" /> : <Icon className="h-5 w-5 mb-1" />}
              <span className="text-[11px] leading-tight line-clamp-1">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Form Content */}
      <Card className="border shadow-lg rounded-2xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/20 border-b p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary text-white shadow-sm">
              <currentStepData.icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{currentStepData.title}</CardTitle>
              <CardDescription className="text-sm mt-0.5">{currentStepData.desc}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Instructions & Guidelines Panel */}
              <div className="p-5 rounded-2xl border bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 space-y-3 shadow-sm border-blue-500/20">
                <div className="flex items-center gap-2 text-primary font-black text-lg">
                  <FileText className="h-5 w-5" />
                  <span>Center Manager Onboarding Instructions</span>
                </div>
                <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1 font-medium">
                  <li>Review all testing center specifications and operational details provided by Company Admin.</li>
                  <li>Download and inspect the official Memorandum of Understanding (MOU) PDF.</li>
                  <li>Print, stamp with your institution seal, and sign the MOU document.</li>
                  <li>Upload the signed MOU along with mandatory statutory documents (PAN, Aadhaar, Cancelled Cheque, GSTIN) in Step 3.</li>
                </ul>
                <div className="pt-2 border-t border-blue-500/20 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="accept-instructions"
                    checked={instructionsAccepted || formData.agreementAccepted || false}
                    onChange={(e) => {
                      setInstructionsAccepted(e.target.checked);
                      setFormData({ ...formData, agreementAccepted: e.target.checked });
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="accept-instructions" className="text-sm font-bold text-foreground cursor-pointer select-none">
                    I have read and accept all instructions, operational procedures, and testing guidelines.
                  </label>
                </div>
              </div>

              {/* Company Admin Configured Details & MOU Download */}
              <div className={`transition-all duration-300 ${!(instructionsAccepted || formData.agreementAccepted) ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
                    <div>
                      <h4 className="font-extrabold text-base text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Center Details (Configured by Company Admin)
                      </h4>
                      <p className="text-xs text-muted-foreground">Verify these profile particulars before proceeding to document submission.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        const content = `MEMORANDUM OF UNDERSTANDING (MOU)\n\nBetween Company Admin & ${statusResponse?.data?.centerName || 'Testing Center'}\nCenter Code: ${statusResponse?.data?.centerCode || 'N/A'}\nLocation: ${statusResponse?.data?.city || ''}, ${statusResponse?.data?.state || ''}\nCapacity: ${statusResponse?.data?.capacity || 100} Candidates\n\nThis document serves as the official operational binding SLA. Please stamp and affix authorized digital/physical signature.`;
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `MOU_${statusResponse?.data?.centerCode || 'Agreement'}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-sm"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download MOU PDF / Doc
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-muted/60">
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Center Name</span>
                      <strong className="text-foreground">{String(centerInfo.centerName || userProfile.centerName || 'N/A')}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Center Code</span>
                      <strong className="text-foreground font-mono text-primary">{String(centerInfo.centerCode || userProfile.centerCode || 'N/A')}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Official Email</span>
                      <strong className="text-foreground truncate block">{String(centerInfo.email || userProfile.email || 'N/A')}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Contact Phone</span>
                      <strong className="text-foreground">{String(centerInfo.phone || 'N/A')}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Facility Address</span>
                      <strong className="text-foreground block">{String(centerInfo.address || 'N/A')}, {String(centerInfo.city || '')}, {String(centerInfo.state || '')}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Candidate Capacity</span>
                      <strong className="text-foreground">{String(centerInfo.capacity || 100)} Seats</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block font-semibold uppercase">Manager In-Charge</span>
                      <strong className="text-foreground">{String(centerInfo.managerName || userProfile.firstName || 'N/A')}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="digitalSignature" className="font-bold">Authorized Center Head Digital Signature & Attestation</Label>
                <Input
                  id="digitalSignature"
                  placeholder="Type your full legal name as digital attestation sign-off"
                  value={formData.digitalSignature || ''}
                  onChange={(e) => setFormData({ ...formData, digitalSignature: e.target.value })}
                  disabled={!(instructionsAccepted || formData.agreementAccepted)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="font-bold">Facility Street Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., Plot No 42, Tech Park, Sector 62"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="font-bold">Postal Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="6-digit postal zip code"
                  value={formData.pincode || ''}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="emergencyContact" className="font-bold">24/7 Emergency Incident Hotline / Proctor Mobile</Label>
                <Input
                  id="emergencyContact"
                  placeholder="+91 / +1 emergency operational contact phone number"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-foreground mb-2 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-bold flex items-center gap-2 text-blue-600">
                    <Lock className="h-4 w-4" /> Statutory Verification Requirement
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload stamped & signed MOU along with government statutory KYC documents for Company Admin inspection.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const content = `MEMORANDUM OF UNDERSTANDING (MOU)\n\nCenter Code: ${statusResponse?.data?.centerCode || 'N/A'}\nCenter Name: ${statusResponse?.data?.centerName || ''}\n\nAuthorized Stamp & Signature Area:\n-----------------------------------`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `MOU_${statusResponse?.data?.centerCode || 'Agreement'}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10 font-bold text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> Re-download MOU
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'MOU (Stamped & Signed)', desc: 'Official signed MOU agreement file', req: true },
                  { name: 'PAN Card', desc: 'Center / Trust legal PAN certificate', req: true },
                  { name: 'Aadhaar Card', desc: 'Center Head / Authorised Aadhaar ID', req: true },
                  { name: 'Cancellation Cheque', desc: 'Bank cancelled cheque for SLA settlement', req: true },
                  { name: 'GSTIN Certificate', desc: 'GST registration billing certificate', req: true },
                  { name: 'Fire Safety NOC', desc: 'Municipal fire protection certificate', req: false }
                ].map((item, idx) => {
                  const doc = uploadedDocs[item.name];
                  const isUploaded = !!doc?.fileUrl;

                  return (
                    <div key={idx} className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${isUploaded ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-muted/10 border-muted'}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                          {item.req && <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-black uppercase">Required</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{item.desc}</p>
                        {isUploaded ? (
                          <div className="flex items-center gap-1.5 mt-2 text-emerald-600 text-xs font-bold">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Ready: {doc.fileName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/70 font-mono block mt-1">Status: Pending Upload</span>
                        )}
                      </div>

                      <div>
                        <input
                          type="file"
                          id={`file-upload-${idx}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadedDocsState((prev) => ({
                                ...prev,
                                [item.name]: {
                                  fileName: file.name,
                                  fileUrl: `https://storage.practice-exam.com/docs/${file.name}`,
                                  isMandatory: item.req,
                                }
                              }));
                            }
                          }}
                        />
                        <label
                          htmlFor={`file-upload-${idx}`}
                          className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border shadow-sm h-8 px-3 py-1 ${isUploaded ? 'border-emerald-500/30 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20' : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
                        >
                          {isUploaded ? 'Change File' : 'Upload PDF'}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep >= 4 && currentStep <= 7 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shiftCapacity" className="font-bold">Maximum Active Shift Capacity (Candidates)</Label>
                  <Input
                    id="shiftCapacity"
                    type="number"
                    value={formData.shiftCapacity || 200}
                    onChange={(e) => setFormData({ ...formData, shiftCapacity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bufferSystems" className="font-bold">Dedicated Buffer Computers (Min 5%)</Label>
                  <Input
                    id="bufferSystems"
                    type="number"
                    value={formData.bufferSystems || 10}
                    onChange={(e) => setFormData({ ...formData, bufferSystems: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cctvDensity" className="font-bold">CCTV Coverage Density Specification</Label>
                  <Input
                    id="cctvDensity"
                    value={formData.cctvDensity || ''}
                    onChange={(e) => setFormData({ ...formData, cctvDensity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staticIps" className="font-bold">Whitelisted Static IP Ranges</Label>
                  <Input
                    id="staticIps"
                    value={formData.staticIps || ''}
                    onChange={(e) => setFormData({ ...formData, staticIps: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="p-6 border-2 border-primary/20 rounded-2xl bg-linear-to-br from-primary/5 via-card to-card text-center space-y-3">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Final Onboarding Verification Attestation</h3>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  You are about to transmit this complete 8-step Center Onboarding dossier to the Company Admin for official document verification and readiness sign-off.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complianceNotes" className="font-bold">Final Compliance Notes / Remarks for Admin</Label>
                <Textarea
                  id="complianceNotes"
                  rows={4}
                  value={formData.complianceNotes || ''}
                  onChange={(e) => setFormData({ ...formData, complianceNotes: e.target.value })}
                  placeholder="Add any context regarding power backups or ISP failover configurations."
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/20 border-t p-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || saveStepMutation.isPending || submitMutation.isPending}
            className="font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Step
          </Button>

          <Button
            onClick={handleNext}
            disabled={saveStepMutation.isPending || submitMutation.isPending || (currentStep === 1 && !instructionsAccepted && !formData.agreementAccepted)}
            className={`font-bold text-white shadow-md px-6 ${currentStep === 8 ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'}`}
          >
            {saveStepMutation.isPending || submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : currentStep === 8 ? (
              <ShieldCheck className="h-4 w-4 mr-2" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2 order-2" />
            )}
            {currentStep === 8 ? 'Submit for Admin Verification' : 'Save & Next Stage'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
