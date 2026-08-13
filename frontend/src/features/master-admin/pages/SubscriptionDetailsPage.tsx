import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubscription, useSubscriptionStatusChange, useRenewSubscription } from "../hooks/subscription.hooks";
import { SubscriptionStatus } from "../types/subscription.types";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowLeft, RefreshCw, ArrowUpCircle, ArrowDownCircle, Power, PowerOff, ShieldX } from "lucide-react";
import { useConfirm } from "@/providers/ConfirmProvider";
import { RenewSubscriptionDialog } from "../components/subscription/RenewSubscriptionDialog";

export const SubscriptionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { data: subscriptionResponse, isLoading } = useSubscription(id as string);
  const subscription = subscriptionResponse?.subscription;
  const history = subscriptionResponse?.history;

  const { mutateAsync: suspendSub } = useSubscriptionStatusChange("suspend");
  const { mutateAsync: resumeSub } = useSubscriptionStatusChange("resume");
  const { mutateAsync: cancelSub } = useSubscriptionStatusChange("cancel");
  
  const [selectedRenewSub, setSelectedRenewSub] = useState<any | null>(null);

  const handleToggleStatus = async () => {
    if (!subscription) return;
    const isSuspended = subscription.status === SubscriptionStatus.SUSPENDED;
    if (await confirm(`Are you sure you want to ${isSuspended ? 'resume' : 'suspend'} this subscription?`)) {
      if (isSuspended) {
        await resumeSub({ id: subscription._id, payload: { notes: "Resumed by admin" } });
      } else {
        await suspendSub({ id: subscription._id, payload: { notes: "Suspended by admin" } });
      }
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    if (await confirm(`Are you sure you want to completely cancel this subscription? This action cannot be undone.`)) {
      await cancelSub({ id: subscription._id, payload: { notes: "Cancelled by admin" } });
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE: return <Badge className="bg-[#E4FD97] text-[#2D3E2C] border-[#2D3E2C]/20 hover:bg-[#d6f081]">Active</Badge>;
      case SubscriptionStatus.EXPIRED: return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Expired</Badge>;
      case SubscriptionStatus.SUSPENDED: return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      case SubscriptionStatus.CANCELLED: return <Badge variant="secondary">Cancelled</Badge>;
      case SubscriptionStatus.PENDING: return <Badge variant="outline">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading subscription details...</div>;
  }

  if (!subscription) {
    return <div className="p-8 text-center text-slate-500">Subscription not found.</div>;
  }

  const company = subscription.companyId;
  const plan = subscription.planId;

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/master-admin/subscriptions")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subscriptions
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Details</h1>
          <p className="text-muted-foreground mt-2">
            Detailed information about the subscription for {company?.companyName || "N/A"}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {subscription.status !== SubscriptionStatus.CANCELLED && (
            <>
              {(() => {
                const daysUntilExpiry = subscription.endDate ? (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) : Infinity;
                const isRenewable = daysUntilExpiry <= 3 || subscription.status === SubscriptionStatus.EXPIRED || subscription.status === SubscriptionStatus.CANCELLED;
                return isRenewable ? (
                  <Button variant="outline" size="sm" onClick={() => setSelectedRenewSub(subscription)} className="text-primary border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renew
                  </Button>
                ) : null;
              })()}

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                className={
                  subscription.status === SubscriptionStatus.SUSPENDED
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    : "text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                }
              >
                {subscription.status === SubscriptionStatus.SUSPENDED ? (
                  <><Power className="w-4 h-4 mr-2" /> Resume</>
                ) : (
                  <><PowerOff className="w-4 h-4 mr-2" /> Suspend</>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                <ShieldX className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Status</span>
              <span>{getStatusBadge(subscription.status)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Billing Cycle</span>
              <span className="capitalize">{subscription.billingCycle}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Start Date</span>
              <span>{subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : "-"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">End Date</span>
              <span>{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "-"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Created At</span>
              <span>{subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company & Plan Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Company Name</span>
              <span className="font-medium">{company?.companyName || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Company Code</span>
              <span>{company?.companyCode || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Plan Name</span>
              <span className="font-medium">{plan?.planName || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-medium">Plan Code</span>
              <span>{plan?.planCode || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center border border-border rounded-md bg-muted/50">
              No history records found for this subscription.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record: any, index: number) => (
                <div key={index} className="flex gap-4 p-4 border border-border rounded-lg items-start">
                  <div className="bg-muted p-2 rounded-full text-muted-foreground">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground capitalize">
                      {record.action.replace("_", " ")}
                    </div>
                    {record.notes && <div className="text-sm text-muted-foreground mt-1">{record.notes}</div>}
                    <div className="text-xs text-muted-foreground/70 mt-2">
                      {new Date(record.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRenewSub && (
        <RenewSubscriptionDialog
          open={!!selectedRenewSub}
          onOpenChange={(val) => !val && setSelectedRenewSub(null)}
          subscription={selectedRenewSub}
        />
      )}
    </div>
  );
};
