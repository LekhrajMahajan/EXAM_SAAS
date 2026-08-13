import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlans, useTogglePlanStatus, useDeletePlan } from "../hooks/plan.hooks";
import type { Plan } from "../types/plan.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search, Edit, Power, PowerOff, Trash2, Check, X, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/providers/ConfirmProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { cn } from "@/utils/cn";

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

const getHeaderStyles = (planCode: string) => {
  if (planCode === 'STARTER') return { bg: "bg-[#2D3E2C]", text: "text-white" };
  if (planCode === 'PROFESSIONAL') return { bg: "bg-[#2D3E2C]", text: "text-white" };
  if (planCode === 'ENTERPRISE') return { bg: "bg-[#2D3E2C]", text: "text-white" };
  return { bg: "bg-[#2D3E2C]", text: "text-white" };
};

export const PlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const confirm = useConfirm();
  
  // State
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: plansResponse, isLoading } = usePlans({
    page: 1,
    limit: 100, // Fetch all plans for the grid view
    search: search || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as any),
  });

  const { mutateAsync: updateStatus } = useTogglePlanStatus();
  const { mutateAsync: deletePlan } = useDeletePlan();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleToggleStatus = async (plan: Plan) => {
    const newStatus = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (await confirm(`Are you sure you want to mark ${plan.planName} as ${newStatus.toLowerCase()}?`)) {
      await updateStatus({ id: plan._id, status: newStatus });
    }
  };

  const handleDelete = async (plan: Plan) => {
    if (await confirm(`Are you sure you want to delete ${plan.planName}? This action cannot be undone.`)) {
      await deletePlan(plan._id);
    }
  };

  const plans = plansResponse?.data || [];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription Plans</h1>
          <p className="text-slate-500">Manage all plans, pricing, and feature limits.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/master-admin/plans/new")} className="gap-2 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button">
          <Plus className="w-4 h-4" />
          Create Plan
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search plans by name or code..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearch(e.target.value);
            }}
            className="pl-9 bg-card border-border shadow-sm"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-border rounded-xl bg-card">
          <h3 className="text-lg font-semibold text-foreground">No plans found</h3>
          <p className="text-muted-foreground mt-1">Adjust your filters or create a new plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {plans.map((plan: Plan) => {
            const isInactive = plan.status !== 'ACTIVE';
            const headerStyles = getHeaderStyles(plan.planCode || '');
            
            return (
              <div 
                key={plan._id} 
                className={`flex flex-col rounded-2xl overflow-hidden shadow-sm border border-border bg-card transition-all hover:shadow-md group ${isInactive ? 'opacity-70 grayscale-[0.3]' : ''}`}
              >
                {/* Colored Header */}
                <div className={`p-6 ${headerStyles.bg} ${headerStyles.text}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-2xl tracking-tight group-hover:text-secondary transition-colors">{plan.planName}</h3>
                    
                    {/* Actions Dropdown / Icons */}
                    <div className="flex items-center gap-1 bg-white/10 rounded-md p-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 hover:text-white" onClick={() => navigate(`/master-admin/plans/${plan._id}`)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 hover:text-white" onClick={() => navigate(`/master-admin/plans/${plan._id}/edit`)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 hover:text-white" onClick={() => handleToggleStatus(plan)}>
                              {plan.status === 'ACTIVE' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{plan.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20 hover:text-white" onClick={() => handleDelete(plan)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                
                {/* Footer label */}
                <div className="p-4 bg-muted/20 border-t border-border text-[10px] font-semibold text-muted-foreground tracking-wider uppercase text-center">
                  {plan.planCode || "CUSTOM PLAN"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
