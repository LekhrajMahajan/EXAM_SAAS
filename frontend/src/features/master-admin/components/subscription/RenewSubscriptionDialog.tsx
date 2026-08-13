import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePlans } from "../../hooks/plan.hooks";
import { useRenewSubscription } from "../../hooks/subscription.hooks";
import { useCreatePaymentOrder, useVerifyPayment } from "../../hooks/payment.hooks";
import { BillingCycle, type ISubscription } from "../../types/subscription.types";
import { useToast } from "@/hooks/use-toast";

interface RenewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: ISubscription | null;
}

const loadRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RenewSubscriptionDialog = ({ open, onOpenChange, subscription }: RenewSubscriptionDialogProps) => {
  const { toast } = useToast();
  const { data: plansRes, isLoading: isLoadingPlans } = usePlans({ page: 1, limit: 100 });
  const { mutateAsync: renewSubscription } = useRenewSubscription();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const plans = plansRes?.data || [];

  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.YEARLY);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  const [prevSubscription, setPrevSubscription] = useState<ISubscription | null>(null);
  const [prevOpen, setPrevOpen] = useState(false);

  if (subscription !== prevSubscription || open !== prevOpen) {
    setPrevSubscription(subscription);
    setPrevOpen(open);
    if (subscription && open) {
      setPlanId(subscription.planId?._id || subscription.planId);
      setBillingCycle(subscription.billingCycle);
      
      let nextStart = new Date(subscription.endDate);
      if (nextStart < new Date()) {
        nextStart = new Date(); // default to today if expired or cancelled
      }
      setStartDate(nextStart.toISOString().split("T")[0]);
      
      const nextEnd = new Date(nextStart);
      if (subscription.billingCycle === BillingCycle.MONTHLY) nextEnd.setMonth(nextEnd.getMonth() + 1);
      else nextEnd.setFullYear(nextEnd.getFullYear() + 1);
      setEndDate(nextEnd.toISOString().split("T")[0]);
    }
  }

  // Handle billing cycle change to automatically calculate end date
  const handleCycleChange = (cycle: BillingCycle) => {
    setBillingCycle(cycle);
    const end = new Date(startDate);
    if (cycle === BillingCycle.MONTHLY) end.setMonth(end.getMonth() + 1);
    else end.setFullYear(end.getFullYear() + 1);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const handleRenew = async () => {
    if (!subscription || !planId || !startDate || !endDate) return;

    const selectedPlan = plans.find((p: any) => p._id === planId);
    let amount = 0;
    if (selectedPlan) {
      if (billingCycle === BillingCycle.MONTHLY) amount = selectedPlan.pricing.monthlyPrice;
      else if (billingCycle === BillingCycle.YEARLY) amount = selectedPlan.pricing.yearlyPrice;
    }

    if (amount === 0) {
      toast({ title: "Error", description: "Invalid plan pricing", variant: "destructive" });
      return;
    }

    try {
      const res = await loadRazorpay();
      if (!res) {
        toast({ title: "Error", description: "Razorpay SDK failed to load.", variant: "destructive" });
        return;
      }

      const companyId = subscription.companyId?._id || subscription.companyId;
      const orderRes = await createOrder({ companyId, planId, amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SdMZboWmLDIG9B",
        amount: amount * 100, 
        currency: "INR",
        name: "ExamGuard Pro",
        description: "Subscription Renewal",
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await renewSubscription({
              id: subscription._id,
              payload: {
                planId,
                billingCycle,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                notes: `Razorpay Payment ID: ${response.razorpay_payment_id}`,
              }
            });

            onOpenChange(false);
          } catch (e) {
            console.error("Verification or Renewal Failed", e);
          }
        },
        theme: { color: "#2563eb" },
        config: {
          display: {
            blocks: {
              card: {
                name: "Pay with Card",
                instruments: [{ method: "card" }]
              },
              upi: {
                name: "Pay with UPI",
                instruments: [{ method: "upi" }]
              },
              netbanking: {
                name: "Pay with Netbanking",
                instruments: [{ method: "netbanking" }]
              },
              wallet: {
                name: "Pay with Wallet",
                instruments: [{ method: "wallet" }]
              }
            },
            sequence: ["block.card", "block.upi", "block.netbanking", "block.wallet"],
            preferences: {
              show_default_blocks: true,
            }
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
    }
  };

  const isPending = isCreatingOrder || isVerifying;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Renew Subscription</DialogTitle>
          <DialogDescription>
            Renew and process payment for this subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingPlans ? "Loading..." : "Select Plan"} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.planName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Select value={billingCycle} onValueChange={(v) => handleCycleChange(v as BillingCycle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BillingCycle.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={BillingCycle.YEARLY}>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setStartDate(newStart);
                  if (newStart) {
                    const newEnd = new Date(newStart);
                    if (billingCycle === BillingCycle.MONTHLY) newEnd.setMonth(newEnd.getMonth() + 1);
                    else newEnd.setFullYear(newEnd.getFullYear() + 1);
                    setEndDate(newEnd.toISOString().split("T")[0]);
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRenew} disabled={isPending || !planId}>
            {isPending ? "Processing..." : "Renew & Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
