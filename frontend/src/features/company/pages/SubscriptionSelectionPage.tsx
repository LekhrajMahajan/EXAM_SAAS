import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { usePlans } from '@/features/master-admin/hooks/plan.hooks';
import { PlanStatus, type Plan } from '@/features/master-admin/types/plan.types';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { useUserStore } from '@/stores/user/user.store';
import { cn } from '@/utils/cn';
import { SubscriptionConfirmDialog } from '../components/SubscriptionConfirmDialog';

// Helper to convert camelCase to Title Case
const camelToTitle = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

const formatLimitValue = (key: string, value: number) => {
  if (value === 0 || value === null || value === undefined) {
    if (key.toLowerCase().includes('api')) return 'Not Included';
    return 'Unlimited';
  }
  return value.toLocaleString();
};

const PLAN_ORDER = ['ENTERPRISE', 'PROFESSIONAL', 'STARTER'];

const featureGroups = [
  {
    title: "Exam Management",
    keys: ["onlineExam", "offlineOMR", "hybridExam", "questionBank", "paperApproval", "resultApproval", "meritList", "certificate", "attendance", "notifications", "observerModule", "nlpEvaluation", "omrStrongRoomBell"]
  },
  {
    title: "AI & Security",
    keys: ["basicAiProctoring", "fullAiProctoring", "sixteenAiModules", "faceVerification", "biometric", "liveMonitoring", "geoMonitoring", "browserLock", "safeExamBrowser", "deviceTrust", "screenRecording", "clipboardBlocking", "voiceDetection", "cameraSnapshot", "liveCameraStream", "liveCameraAndVideo", "gpsAtLogin", "continuousGpsAndGeoFence", "fullGpsAndAiGeoFraud"]
  },
  {
    title: "Reports & Analytics",
    keys: ["reports", "importExport", "auditLogs", "activityLogs", "analyticsDashboard", "scheduledReports", "customReports"]
  },
  {
    title: "Storage & APIs",
    keys: ["fileStorage", "apiAccess", "webhooks", "apiRateLimiting", "dedicatedServerAndSla"]
  },
  {
    title: "Branding",
    keys: ["customBranding", "whiteLabel", "whiteLabelLogin", "customDomain", "darkTheme", "customTheme", "smtpConfiguration", "emailTemplates", "certificateTemplates", "admitCardTemplates"]
  },
  {
    title: "Authentication",
    keys: ["sso", "twoFactorAuth", "ldapActiveDirectory", "ipWhitelisting"]
  },
  {
    title: "Recruitment",
    keys: ["recruitingModule", "recruitingBodyModule", "recruitingBodyPortalLogin", "recruitingBodyDetailsOnHallTicket"]
  },
  {
    title: "Payment",
    keys: ["paymentGateway", "subscription", "invoices", "autoInvoice"]
  }
];

export const SubscriptionSelectionPage = () => {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const isSubscribed = profile?.paymentStatus === 'SUCCESS' || !!profile?.subscriptionId;
  const currentPlanCode = isSubscribed ? profile?.subscriptionPlan : null;

  const { data: plansResponse, isLoading } = usePlans({ status: PlanStatus.ACTIVE });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = useMemo(() => {
    const fetchedPlans = plansResponse?.data || [];
    return [...fetchedPlans].sort((a, b) => {
      const indexA = PLAN_ORDER.indexOf(a.planCode || '');
      const indexB = PLAN_ORDER.indexOf(b.planCode || '');
      // If a plan isn't in the predefined list, put it at the end
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  }, [plansResponse?.data]);

  const selectedPlanObj = useMemo(() => plans.find((p) => p._id === selectedPlan) || null, [plans, selectedPlan]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onCtaClick = (plan: Plan, ctaText: string) => {
    if (ctaText === 'Current Plan') return;
    setSelectedPlan(plan._id as string);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getHeaderStyles = (planCode: string) => {
    if (planCode === 'STARTER') return { bg: "bg-[#2D3E2C]", text: "text-white" };
    if (planCode === 'PROFESSIONAL') return { bg: "bg-[#2D3E2C]", text: "text-white" };
    if (planCode === 'ENTERPRISE') return { bg: "bg-[#2D3E2C]", text: "text-white" };
    return { bg: "bg-[#2D3E2C]", text: "text-white" };
  };

  const getCtaText = (planCode: string) => {
    if (!currentPlanCode) return 'Buy Now';
    if (planCode === currentPlanCode) return 'Current Plan';
    
    const currentIndex = PLAN_ORDER.indexOf(currentPlanCode);
    const planIndex = PLAN_ORDER.indexOf(planCode);
    
    // Lower index means higher tier (Enterprise is 0, Professional is 1, Starter is 2)
    if (planIndex < currentIndex) return 'Upgrade';
    return 'Change Plan';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-12">
      <DashboardHeader 
        title="Select a Subscription Plan" 
        description="Choose the plan that best fits your company's needs to continue." 
      />

      {currentPlanCode && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-md text-primary">
          <p className="font-medium">Current Active Plan: {currentPlanCode}</p>
          <p className="text-sm">You can upgrade your plan or continue to the dashboard.</p>
          <Button variant="link" className="px-0 mt-2" onClick={() => navigate('/company/dashboard')}>
            Go to Dashboard &rarr;
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start mt-6">
        {plans.map((plan) => {
          const headerStyles = getHeaderStyles(plan.planCode || '');
          const isSelected = selectedPlan === plan._id;
          const ctaText = getCtaText(plan.planCode || '');
          const isCurrentPlan = plan.planCode === currentPlanCode;

          return (
            <div 
              key={plan._id} 
              className={cn(
                "flex flex-col rounded-2xl overflow-hidden shadow-sm border bg-card transition-all duration-200 group",
                isSelected ? "border-primary ring-2 ring-primary/20 shadow-xl scale-[1.01]" : "border-border hover:shadow-md",
                isCurrentPlan && !isSelected && "border-border opacity-90"
              )}
            >
              {/* Colored Header */}
              <div className={`p-6 ${headerStyles.bg} ${headerStyles.text}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-black text-2xl tracking-tight group-hover:text-secondary transition-colors">{plan.planName}</h3>
                </div>
                <p className="text-[10px] font-semibold opacity-80 tracking-wider uppercase h-8">
                  {plan.description || "Custom Plan Description"}
                </p>
              </div>

              {/* Pricing Area */}
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.pricing?.currency || '₹'} {plan.pricing?.monthlyPrice?.toLocaleString() || 0}</span>
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">
                  {plan.pricing?.currency || '₹'}{plan.pricing?.yearlyPrice?.toLocaleString() || 0}/yr • save {plan.pricing?.discountPercent || 0}%
                </div>
              </div>

              {/* Condensed Features & Limits */}
              <div className="p-4 flex-grow bg-card space-y-1">
                
                {/* Usage Limits */}
                {plan.usageLimits && Object.keys(plan.usageLimits).length > 0 && (
                  <div className="py-2.5 border-b border-border/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Usage Limits</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-[10px] text-primary hover:text-primary/80 font-bold px-2 py-1 rounded bg-primary/10 transition-colors">View Details</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Usage Limits - {plan.planName}</DialogTitle>
                          </DialogHeader>
                          <div className="max-h-[65vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 py-4 text-sm">
                              {Object.entries(plan.usageLimits).map(([key, value]) => {
                                const formattedValue = formatLimitValue(key, value as number);
                                return (
                                  <div key={key} className="flex flex-col space-y-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <span className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">{camelToTitle(key).replace('Max ', '')}</span>
                                    <span className="font-bold text-lg">{formattedValue}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                      {Object.entries(plan.usageLimits).slice(0, 4).map(([k, v]) => `${formatLimitValue(k, v as number)} ${camelToTitle(k).replace('Max ', '')}`).join(', ')}...
                    </p>
                  </div>
                )}

                {/* Features */}
                {plan.features && Object.keys(plan.features).length > 0 && (
                  <div className="space-y-1">
                    {featureGroups.map((group) => {
                      const relevantKeys = group.keys.filter(k => k in plan.features!);
                      if (relevantKeys.length === 0) return null;
                      
                      const includedKeys = group.keys.filter(k => plan.features![k as keyof typeof plan.features]);
                      const previewText = includedKeys.length > 0 
                        ? includedKeys.slice(0, 4).map(camelToTitle).join(', ') + (includedKeys.length > 4 ? '...' : '')
                        : 'Not included';
                      
                      return (
                        <div key={group.title} className="py-2.5 border-b border-border/50 last:border-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{group.title}</h4>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-[10px] text-primary hover:text-primary/80 font-bold px-2 py-1 rounded bg-primary/10 transition-colors">View Details</button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle className="text-xl">{group.title} - {plan.planName}</DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[65vh] overflow-y-auto pr-2">
                                  <ul className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-sm">
                                    {relevantKeys.map((key) => {
                                      const value = plan.features![key as keyof typeof plan.features];
                                      return (
                                        <li key={key} className={`flex items-start gap-2 p-2 rounded-md ${!value ? 'opacity-60 bg-muted/20' : 'bg-primary/5'}`}>
                                          {value ? (
                                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={3} />
                                          ) : (
                                            <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" strokeWidth={3} />
                                          )}
                                          <span className={cn("text-base font-semibold text-foreground", !value && "line-through text-muted-foreground font-medium text-sm")}>
                                            {camelToTitle(key)}
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                            {previewText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-muted/20 border-t border-border mt-auto">
                <Button 
                  className={cn("w-full h-11 text-sm font-bold tracking-wide uppercase transition-all shadow-sm", 
                    isSelected ? "bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90" : 
                    isCurrentPlan ? "bg-muted text-muted-foreground hover:bg-muted" : "bg-[#2D3E2C] text-white hover:bg-[#2D3E2C]/90 hover:text-[#E4FD97]"
                  )}
                  variant={isSelected ? "default" : isCurrentPlan ? "secondary" : "default"}
                  disabled={isCurrentPlan}
                  onClick={() => onCtaClick(plan as unknown as Plan, ctaText)}
                >
                  {ctaText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <SubscriptionConfirmDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        plan={selectedPlanObj} 
      />

      {plans.length === 0 && (
        <div className="text-center p-12 border border-dashed rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No active plans found</h3>
          <p className="text-sm text-muted-foreground">Please contact the Master Admin to configure subscription plans.</p>
        </div>
      )}
    </div>
  );
};
