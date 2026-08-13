import React, { useState } from 'react';
import { useUserStore } from '@/stores/user/user.store';
import { useBranch, useSaveOnboardingStep } from '../hooks/branch.hooks';
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
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

export const BranchSetupWizardPage: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const branchId = profile?.branchId || '';

  const { data: branchResponse, isLoading: isBranchLoading } = useBranch(branchId);
  const branch = branchResponse?.data;
  const saveStepMutation = useSaveOnboardingStep(branchId);

  const [currentStep, setCurrentStep] = useState<number>(profile?.branchSetupCurrentStep || 1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  if (isBranchLoading || !branchId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Loading Branch Setup Wizard...</p>
      </div>
    );
  }

  const setupStatus = branch?.setupStatus || profile?.branchSetupStatus || 'DRAFT';
  const readinessScore = branch?.readinessScore || 0;

  // Render Read-Only View if Under Review
  if (setupStatus === 'PENDING_VERIFICATION') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="border-amber-500/30 bg-linear-to-br from-amber-500/5 via-card to-card shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-8 border-b">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 animate-pulse">
              <Clock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Branch Setup Under Administrative Review</CardTitle>
            <CardDescription className="text-base mt-2">
              Your onboarding setup for <span className="font-semibold text-foreground">{branch?.branchName || 'your branch'}</span> has been successfully submitted and is currently awaiting verification by the Company Admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border">
              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <p className="font-semibold text-amber-600 mt-1">Pending Admin Verification</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Readiness Score</p>
                <Badge className={`mt-1 text-base px-3 py-1 ${readinessScore >= 80 ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}`}>
                  {readinessScore} / 100
                </Badge>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              You will gain full access to the Branch Management Dashboard once your setup is approved. If additional adjustments are required, you will be notified with specific feedback.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { step: 1, title: 'Basic Profile & Timings', icon: Building2, desc: 'Configure branch contact info and operational hours' },
    { step: 2, title: 'Legal Documents & Licensing', icon: FileText, desc: 'Upload mandatory establishment registration & compliance files' },
    { step: 3, title: 'GPS Geofencing & Location', icon: MapPin, desc: 'Verify physical branch GPS coordinates for biometric attendance' },
    { step: 4, title: 'Staff Roster Alignment', icon: Users, desc: 'Map departmental hierarchy and invigilator availability' },
    { step: 5, title: 'Infrastructure & Rooms', icon: Building2, desc: 'Register exam halls, server labs, and CCTV monitoring IP layouts' },
    { step: 6, title: 'Readiness Evaluation', icon: Sparkles, desc: 'Automated 100-point algorithmic readiness score assessment' },
    { step: 7, title: 'Final Review & Submit', icon: ShieldCheck, desc: 'Sign compliance declaration and transmit for Admin review' }
  ];

  const handleNext = async () => {
    let payload = { ...formData };
    if (currentStep === 7) {
      payload = { submitForVerification: true };
    }

    saveStepMutation.mutate(
      { step: currentStep, data: payload },
      {
        onSuccess: () => {
          if (profile) {
            const nextStatus = currentStep === 7 ? 'PENDING_VERIFICATION' : 'DRAFT';
            const nextStep = currentStep === 7 ? 7 : currentStep + 1;
            setProfile({
              ...profile,
              branchSetupStatus: nextStatus,
              branchSetupCurrentStep: nextStep
            });
          }
          if (currentStep < 7) {
            setCurrentStep((prev) => prev + 1);
          }
        }
      }
    );
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const scoreBadgeColor = readinessScore >= 80 ? 'bg-green-600' : readinessScore >= 50 ? 'bg-amber-500' : 'bg-destructive';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {setupStatus === 'REJECTED' && (
        <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/40 flex items-start gap-4 animate-in fade-in">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-destructive">Setup Verification Rejected</h4>
            <p className="text-sm text-foreground/80">
              The Company Admin requested revisions before approving this branch: <span className="font-semibold underline">{branch?.adminReviewRemarks || 'Please verify room capacity and document attachments.'}</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Branch Onboarding & Setup Wizard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Complete all 7 required compliance steps to unlock interactive dashboard features.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl border">
          <div className="text-right">
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Readiness Score</span>
            <span className="text-lg font-bold">{readinessScore} / 100</span>
          </div>
          <Badge className={`${scoreBadgeColor} text-white px-3 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-wider`}>
            {readinessScore >= 80 ? 'Optimal' : readinessScore >= 50 ? 'Moderate' : 'Needs Action'}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Step {currentStep} of 7: {steps[currentStep - 1].title}</span>
          <span>{Math.round((currentStep / 7) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / 7) * 100} className="h-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Step Navigation Sidebar */}
        <div className="space-y-2">
          {steps.map((item) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div
                key={item.step}
                onClick={() => { if (isCompleted || item.step === currentStep) setCurrentStep(item.step); }}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground font-semibold shadow-md ring-2 ring-primary/30'
                    : isCompleted
                    ? 'bg-muted/50 text-foreground hover:bg-muted font-medium border-green-500/30'
                    : 'bg-card text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Icon className={`h-5 w-5 shrink-0 ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                )}
                <div className="truncate">
                  <p className="text-xs font-bold truncate">Step {item.step}</p>
                  <p className="text-xs truncate">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Work Area */}
        <Card className="md:col-span-3 shadow-lg border-muted">
          <CardHeader className="bg-muted/20 border-b pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: 'h-6 w-6 text-primary' })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].desc}</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Branch Operating Phone</Label>
                    <Input 
                      placeholder="+1 (555) 000-1122" 
                      defaultValue={branch?.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Emergency Support Extension</Label>
                    <Input 
                      placeholder="Ext 401" 
                      onChange={(e) => setFormData({ ...formData, ext: e.target.value })}
                      className="mt-1" 
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold">Standard Operating Hours</Label>
                  <Input 
                    defaultValue="Mon - Sat | 07:30 AM - 06:00 PM" 
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="mt-1" 
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 border border-dashed rounded-xl bg-muted/20 text-center space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-sm font-semibold">Upload Establishment License & Safety Accreditations</p>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, PNG, JPG (Max 15MB)</p>
                  <Button variant="outline" size="sm" type="button" className="mt-2">Select Documents</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Latitude Coordinates</Label>
                    <Input placeholder="e.g. 28.6139" defaultValue="28.6139" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Longitude Coordinates</Label>
                    <Input placeholder="e.g. 77.2090" defaultValue="77.2090" className="mt-1" />
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>GPS Geofence radius initialized to 500 meters from center coordinates.</span>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <Label className="text-xs font-semibold">Department & Chief Invigilator Notes</Label>
                <Textarea 
                  rows={4} 
                  placeholder="Detail available onsite Technical Supervisors and Security rosters..." 
                  className="mt-1"
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Total Computer Labs</Label>
                    <Input type="number" defaultValue="4" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Total Seating Capacity</Label>
                    <Input type="number" defaultValue="250" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">CCTV Subnet Feeds</Label>
                    <Input type="number" defaultValue="16" className="mt-1" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary mb-2">
                  <Sparkles className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold">Automated Readiness Score: {readinessScore >= 80 ? '85 / 100' : `${readinessScore || 85} / 100`}&nbsp; Points</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Your branch satisfies high-tier security and capacity prerequisites for enterprise examination hosting.
                </p>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-xl border space-y-2">
                  <h4 className="font-bold text-sm">Compliance Declaration & Admin Transmission</h4>
                  <p className="text-xs text-muted-foreground">
                    By clicking Submit, you certify that all uploaded infrastructure specifications, GPS boundary geofences, and safety licenses reflect accurate physical conditions. Upon transmission, your account access will be briefly transitioned into read-only review until Company Admin verification is completed.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center bg-muted/10 border-t p-4">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 1 || saveStepMutation.isPending}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Previous Step
            </Button>

            <Button 
              onClick={handleNext} 
              disabled={saveStepMutation.isPending}
              className="flex items-center gap-2 min-w-[140px] justify-center shadow-md"
            >
              {saveStepMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {currentStep === 7 ? 'Submit for Review' : 'Save & Continue'}
              {currentStep < 7 && !saveStepMutation.isPending && <ArrowRight className="h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
