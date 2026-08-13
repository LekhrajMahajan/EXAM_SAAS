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
import { useCompanies } from "../../hooks/company.hooks";
import { usePlans } from "../../hooks/plan.hooks";
import { useAssignSubscription } from "../../hooks/subscription.hooks";
import { useCreatePaymentOrder, useVerifyPayment } from "../../hooks/payment.hooks";
import { BillingCycle } from "../../types/subscription.types";
import { useToast } from "@/hooks/use-toast";

interface AssignSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const calculateEndDate = (start: string, cycle: BillingCycle) => {
  if (!start) return "";
  const end = new Date(start);
  if (isNaN(end.getTime())) return "";
  if (cycle === BillingCycle.MONTHLY) end.setMonth(end.getMonth() + 1);
  else if (cycle === BillingCycle.QUARTERLY) end.setMonth(end.getMonth() + 3);
  else if (cycle === BillingCycle.HALF_YEARLY) end.setMonth(end.getMonth() + 6);
  else if (cycle === BillingCycle.YEARLY) end.setFullYear(end.getFullYear() + 1);
  return end.toISOString().split("T")[0];
};

export const AssignSubscriptionDialog = ({ open, onOpenChange }: AssignSubscriptionDialogProps) => {
  const { toast } = useToast();
  const { data: companiesRes, isLoading: isLoadingCompanies } = useCompanies({ page: 1, limit: 100 });
  const { data: plansRes, isLoading: isLoadingPlans } = usePlans({ page: 1, limit: 100 });
  const { mutateAsync: assignSubscription } = useAssignSubscription();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const companies = companiesRes?.data || [];
  const plans = plansRes?.data || [];

  const [companyId, setCompanyId] = useState("");
  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.YEARLY);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => calculateEndDate(new Date().toISOString().split("T")[0], BillingCycle.YEARLY));

  const getPlanPrice = (p: any, cycle: BillingCycle) => {
    if (!p || !p.pricing) return 0;
    if (cycle === BillingCycle.MONTHLY) return p.pricing.monthlyPrice || 0;
    if (cycle === BillingCycle.QUARTERLY) return p.pricing.quarterlyPrice || 0;
    if (cycle === BillingCycle.HALF_YEARLY) return p.pricing.halfYearlyPrice || 0;
    if (cycle === BillingCycle.YEARLY) return p.pricing.yearlyPrice || 0;
    return 0;
  };

  const handleAssign = async () => {
    if (!companyId || !planId || !startDate || !endDate) return;

    const selectedPlan = plans.find((p: any) => p._id === planId);
    const amount = getPlanPrice(selectedPlan, billingCycle);

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

      const orderRes = await createOrder({ companyId, planId, amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SdMZboWmLDIG9B",
        amount: amount * 100, 
        currency: "INR",
        name: "ExamGuard Pro",
        description: "New Subscription Assignment",
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await assignSubscription({
              companyId,
              planId,
              billingCycle,
              startDate: new Date(startDate).toISOString(),
              endDate: new Date(endDate).toISOString(),
              notes: `Razorpay Payment ID: ${response.razorpay_payment_id}`,
            });

            onOpenChange(false);
            setCompanyId("");
            setPlanId("");
            setBillingCycle(BillingCycle.YEARLY);
            const today = new Date().toISOString().split("T")[0];
            setStartDate(today);
            setEndDate(calculateEndDate(today, BillingCycle.YEARLY));
          } catch (e) {
            console.error("Verification or Assignment Failed", e);
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
          <DialogTitle>Payment Subscription</DialogTitle>
          <DialogDescription>
            Assign a subscription plan to a company and process payment via Razorpay.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCompanies ? "Loading..." : "Select Company"} />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c: any) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.companyName} ({c.companyCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Select value={billingCycle} onValueChange={(v) => {
              const cycle = v as BillingCycle;
              setBillingCycle(cycle);
              setEndDate(calculateEndDate(startDate, cycle));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BillingCycle.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={BillingCycle.YEARLY}>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingPlans ? "Loading..." : "Select Plan"} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.planName} (₹{getPlanPrice(p, billingCycle)?.toLocaleString()})
                  </SelectItem>
                ))}
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
                  setEndDate(calculateEndDate(newStart, billingCycle));
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
          <Button onClick={handleAssign} disabled={isPending || !companyId || !planId}>
            {isPending ? "Processing..." : "Payment Subscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
