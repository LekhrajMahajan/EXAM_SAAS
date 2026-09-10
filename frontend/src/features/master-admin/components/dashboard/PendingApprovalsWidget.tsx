import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Eye, Check, X, ClipboardList } from "lucide-react";
import { Building2 } from "lucide-react";
import { useCompanies } from "../../hooks/company.hooks";
import { usePlans } from "../../hooks/plan.hooks";
import { useSubscriptions } from "../../hooks/subscription.hooks";
import { PlanStatus } from "../../types/plan.types";
import { SubscriptionStatus } from "../../types/subscription.types";

export const PendingApprovalsWidget = () => {
  const { data: companiesData, isLoading: isLoadingCompanies, isError: isErrorCompanies } = useCompanies({ status: false, limit: 5, page: 1 });
  const pendingCompanies = companiesData?.data || [];

  const { data: plansData, isLoading: isLoadingPlans } = usePlans({ status: PlanStatus.INACTIVE });
  const pendingPlans = plansData?.data || [];

  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useSubscriptions({ status: SubscriptionStatus.PENDING });
  const pendingSubscriptions = subscriptionsData?.data || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 rounded-md shrink-0">
            <ClipboardList className="h-4 w-4" />
          </div>
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">Companies ({pendingCompanies.length})</TabsTrigger>
            <TabsTrigger value="plans">Plans ({pendingPlans.length})</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions ({pendingSubscriptions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies" className="mt-4">
            <div className="space-y-4">
              {isErrorCompanies ? (
                <div className="text-sm text-red-500 p-4 border border-dashed rounded bg-red-50 text-center">
                  Failed to load pending companies.
                </div>
              ) : isLoadingCompanies ? (
                <div className="text-sm text-slate-500 p-4 text-center">Loading...</div>
              ) : pendingCompanies.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#2D3E2C]/20 rounded-lg bg-[#2D3E2C]/5 empty-state-box">
                   <Building2 className="h-8 w-8 text-[#A5AF79] mb-2 empty-state-icon" />
                   <p className="text-sm font-medium text-[#2D3E2C] empty-state-title">No Pending Companies</p>
                   <p className="text-xs text-[#2D3E2C]/70 mt-1 empty-state-desc">There are no companies awaiting approval.</p>
                 </div>
              ) : (
                pendingCompanies.map((company, i) => (
                  <div key={company._id ? `${company._id}-${i}` : `company-${i}`} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div>
                      <p className="font-medium text-sm">{company.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {company.subscriptionPlan} • {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(company.createdAt))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7 text-[#2D3E2C] hover:text-[#2D3E2C]/80" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7 text-[#A5AF79] hover:text-[#A5AF79]/80" title="Approve">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7 text-[#827148] hover:text-[#827148]/80" title="Reject">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="plans" className="mt-4">
            <div className="space-y-4">
              {isLoadingPlans ? (
                <div className="text-sm text-slate-500 p-4 text-center">Loading...</div>
              ) : pendingPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#2D3E2C]/20 rounded-lg bg-[#2D3E2C]/5 empty-state-box">
                  <ClipboardList className="h-8 w-8 text-[#A5AF79] mb-2 empty-state-icon" />
                  <p className="text-sm font-medium text-[#2D3E2C] empty-state-title">No Pending Plans</p>
                  <p className="text-xs text-[#2D3E2C]/70 mt-1 empty-state-desc">There are no plans awaiting approval.</p>
                </div>
              ) : (
                pendingPlans.map((plan: any, i: number) => (
                  <div key={plan._id ? `${plan._id}-${i}` : `plan-${i}`} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div>
                      <p className="font-medium text-sm">{plan.planName}</p>
                      <p className="text-xs text-muted-foreground">
                        {plan.category} • ₹{plan.pricing?.monthlyPrice || 0}/mo
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="mt-4">
            <div className="space-y-4">
              {isLoadingSubscriptions ? (
                <div className="text-sm text-slate-500 p-4 text-center">Loading...</div>
              ) : pendingSubscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#2D3E2C]/20 rounded-lg bg-[#2D3E2C]/5 empty-state-box">
                  <ClipboardList className="h-8 w-8 text-[#A5AF79] mb-2 empty-state-icon" />
                  <p className="text-sm font-medium text-[#2D3E2C] empty-state-title">No Pending Subscriptions</p>
                  <p className="text-xs text-[#2D3E2C]/70 mt-1 empty-state-desc">There are no subscriptions awaiting approval.</p>
                </div>
              ) : (
                pendingSubscriptions.map((sub: any, i: number) => (
                  <div key={sub._id ? `${sub._id}-${i}` : `sub-${i}`} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div>
                      <p className="font-medium text-sm">{sub.companyName || sub.subscriptionId}</p>
                      <p className="text-xs text-muted-foreground">
                        Plan: {sub.planName || sub.planId} • Cycle: {sub.billingCycle}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
