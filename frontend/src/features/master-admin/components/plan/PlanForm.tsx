import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { planSchema, type PlanFormValues } from "../../schemas/plan.schema";
import type { Plan } from "../../types/plan.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, CheckSquare, Layers, Settings, IndianRupee } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";

interface PlanFormProps {
  initialData?: Plan;
  onSubmit: (data: PlanFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function PlanForm({ initialData, onSubmit, isLoading }: PlanFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const defaultValues: Partial<PlanFormValues> = initialData
    ? {
        ...initialData,
        usageLimits: {
          maxBranches: 0,
          maxCenters: 0,
          maxEmployees: 0,
          maxCandidates: 0,
          maxSubjects: 0,
          maxExams: 0,
          maxPapers: 0,
          maxQuestionBankSize: 0,
          storageLimitGB: 0,
          apiRequestsPerMonth: 0,
          maxManagers: 0,
          maxConcurrentExams: 0,
          maxActiveShifts: 0,
          maxExamRooms: 0,
          maxInvigilators: 0,
          maxObservers: 0,
          maxAiProctorSessions: 0,
          maxFileUploadSizeMB: 0,
          backupRetentionDays: 0,
          auditLogRetentionDays: 0,
          reportRetentionDays: 0,
          sessionTimeoutMinutes: 0,
          maxLoginDevices: 0,
          ...(initialData.usageLimits || {}),
        },
        features: {
          questionBank: false,
          paperApproval: false,
          liveMonitoring: false,
          geoMonitoring: false,
          biometric: false,
          attendance: false,
          resultApproval: false,
          meritList: false,
          certificate: false,
          notifications: false,
          reports: false,
          apiAccess: false,
          fileStorage: false,
          importExport: false,
          customBranding: false,
          sso: false,
          auditLogs: false,
          offlineOMR: false,
          observerModule: false,
          nlpEvaluation: false,
          recruitingBodyModule: false,
          onlineExam: false,
          hybridExam: false,
          basicAiProctoring: false,
          fullAiProctoring: false,
          sixteenAiModules: false,
          cameraSnapshot: false,
          liveCameraStream: false,
          liveCameraAndVideo: false,
          gpsAtLogin: false,
          continuousGpsAndGeoFence: false,
          fullGpsAndAiGeoFraud: false,
          hallTicketAndSeating: false,
          recruitingBodyDetailsOnHallTicket: false,
          recruitingBodyPortalLogin: false,
          whiteLabelAndCustomDomain: false,
          dedicatedServerAndSla: false,
          omrStrongRoomBell: false,
          faceVerification: false,
          browserLock: false,
          safeExamBrowser: false,
          deviceTrust: false,
          screenRecording: false,
          clipboardBlocking: false,
          voiceDetection: false,
          activityLogs: false,
          analyticsDashboard: false,
          scheduledReports: false,
          customReports: false,
          webhooks: false,
          apiRateLimiting: false,
          whiteLabel: false,
          whiteLabelLogin: false,
          customDomain: false,
          darkTheme: false,
          customTheme: false,
          smtpConfiguration: false,
          emailTemplates: false,
          certificateTemplates: false,
          admitCardTemplates: false,
          twoFactorAuth: false,
          ldapActiveDirectory: false,
          ipWhitelisting: false,
          recruitingModule: false,
          paymentGateway: false,
          subscription: false,
          invoices: false,
          autoInvoice: false,
          ...(initialData.features || {}),
        }
      }
    : {
        planName: "",
        planCode: "",
        description: "",
        category: undefined as any,
        status: undefined as any,
        billingCycle: ["MONTHLY", "YEARLY"] as any,
        pricing: {
          monthlyPrice: 0,
          quarterlyPrice: 0,
          halfYearlyPrice: 0,
          yearlyPrice: 0,
          currency: "INR",
          taxPercent: 0,
          discountPercent: 0,
          razorpayPlanIdMonthly: "",
          razorpayPlanIdYearly: "",
        },
        usageLimits: {
          maxBranches: 0,
          maxCenters: 0,
          maxEmployees: 0,
          maxCandidates: 0,
          maxSubjects: 0,
          maxExams: 0,
          maxPapers: 0,
          maxQuestionBankSize: 0,
          storageLimitGB: 0,
          apiRequestsPerMonth: 0,
          maxManagers: 0,
          maxConcurrentExams: 0,
          maxActiveShifts: 0,
          maxExamRooms: 0,
          maxInvigilators: 0,
          maxObservers: 0,
          maxAiProctorSessions: 0,
          maxFileUploadSizeMB: 0,
          backupRetentionDays: 0,
          auditLogRetentionDays: 0,
          reportRetentionDays: 0,
          sessionTimeoutMinutes: 0,
          maxLoginDevices: 0,
        },
        features: {
          questionBank: false,
          paperApproval: false,
          liveMonitoring: false,
          geoMonitoring: false,
          biometric: false,
          attendance: false,
          resultApproval: false,
          meritList: false,
          certificate: false,
          notifications: false,
          reports: false,
          apiAccess: false,
          fileStorage: false,
          importExport: false,
          customBranding: false,
          sso: false,
          auditLogs: false,
          offlineOMR: false,
          observerModule: false,
          nlpEvaluation: false,
          recruitingBodyModule: false,
          onlineExam: false,
          hybridExam: false,
          basicAiProctoring: false,
          fullAiProctoring: false,
          sixteenAiModules: false,
          cameraSnapshot: false,
          liveCameraStream: false,
          liveCameraAndVideo: false,
          gpsAtLogin: false,
          continuousGpsAndGeoFence: false,
          fullGpsAndAiGeoFraud: false,
          hallTicketAndSeating: false,
          recruitingBodyDetailsOnHallTicket: false,
          recruitingBodyPortalLogin: false,
          whiteLabelAndCustomDomain: false,
          dedicatedServerAndSla: false,
          omrStrongRoomBell: false,
          faceVerification: false,
          browserLock: false,
          safeExamBrowser: false,
          deviceTrust: false,
          screenRecording: false,
          clipboardBlocking: false,
          voiceDetection: false,
          activityLogs: false,
          analyticsDashboard: false,
          scheduledReports: false,
          customReports: false,
          webhooks: false,
          apiRateLimiting: false,
          whiteLabel: false,
          whiteLabelLogin: false,
          customDomain: false,
          darkTheme: false,
          customTheme: false,
          smtpConfiguration: false,
          emailTemplates: false,
          certificateTemplates: false,
          admitCardTemplates: false,
          twoFactorAuth: false,
          ldapActiveDirectory: false,
          ipWhitelisting: false,
          recruitingModule: false,
          paymentGateway: false,
          subscription: false,
          invoices: false,
          autoInvoice: false,
        },
      };

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const handleNext = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let fieldsToValidate: any[] = [];
    
    if (step === 1) fieldsToValidate = ["planName", "planCode", "description", "category", "status"];
    if (step === 2) fieldsToValidate = ["pricing"];
    if (step === 3) fieldsToValidate = ["usageLimits"];
    
    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      if (step < totalSteps) {
        e.preventDefault();
        e.stopPropagation();
        handleNext(e);
      }
    }
  };

  const steps = [
    { id: 1, title: "Basic Information", icon: <Layers className="w-5 h-5" /> },
    { id: 2, title: "Pricing", icon: <IndianRupee className="w-5 h-5" /> },
    { id: 3, title: "Usage Limits", icon: <Settings className="w-5 h-5" /> },
    { id: 4, title: "Features", icon: <CheckSquare className="w-5 h-5" /> },
  ];

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Enterprise Plus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ENT-PLUS-2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GOVERNMENT">Government</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing.monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.yearlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pricing.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.taxPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax % (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricing.discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount % (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <FormField
              control={form.control}
              name="usageLimits.maxBranches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Branches</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxCenters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Centers</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Employees</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxCandidates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Candidates</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxSubjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Subjects</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxExams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Exams</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxPapers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Papers</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.maxQuestionBankSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Question Bank Size</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.storageLimitGB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Limit (GB)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usageLimits.apiRequestsPerMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Requests / Month</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="usageLimits.maxManagers" render={({ field }) => (<FormItem><FormLabel>Max Managers</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxConcurrentExams" render={({ field }) => (<FormItem><FormLabel>Max Concurrent Exams</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxActiveShifts" render={({ field }) => (<FormItem><FormLabel>Max Active Shifts</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxExamRooms" render={({ field }) => (<FormItem><FormLabel>Max Exam Rooms</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxInvigilators" render={({ field }) => (<FormItem><FormLabel>Max Invigilators</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxObservers" render={({ field }) => (<FormItem><FormLabel>Max Observers</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxAiProctorSessions" render={({ field }) => (<FormItem><FormLabel>Max AI Proctor Sessions</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxFileUploadSizeMB" render={({ field }) => (<FormItem><FormLabel>Max File Upload Size (MB)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.backupRetentionDays" render={({ field }) => (<FormItem><FormLabel>Backup Retention (Days)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.auditLogRetentionDays" render={({ field }) => (<FormItem><FormLabel>Audit Log Retention (Days)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.reportRetentionDays" render={({ field }) => (<FormItem><FormLabel>Report Retention (Days)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.sessionTimeoutMinutes" render={({ field }) => (<FormItem><FormLabel>Session Timeout (Minutes)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="usageLimits.maxLoginDevices" render={({ field }) => (<FormItem><FormLabel>Maximum Login Devices</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            {featureGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.keys.map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`features.${key}` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 space-y-0 bg-background/50 hover:bg-background transition-colors">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium cursor-pointer">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Wizard Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
          {initialData ? "Edit Subscription Plan" : "Create Subscription Plan"}
        </h2>
        
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2 rounded" />
          <div className="absolute top-5 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
          
          <div className="flex justify-between">
            {steps.map((s) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                    isCurrent ? 'bg-background border-primary text-primary' : 
                    'bg-background border-border text-muted-foreground'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : s.icon}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
          <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-lg text-foreground">
                {steps[step - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border p-6 bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/master-admin/plans')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                {step < totalSteps ? (
                  <Button type="button" onClick={handleNext} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 qa-button">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 qa-button">
                    {isLoading ? "Saving..." : (initialData ? "Update Plan" : "Create Plan")}
                    {!isLoading && <Check className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
