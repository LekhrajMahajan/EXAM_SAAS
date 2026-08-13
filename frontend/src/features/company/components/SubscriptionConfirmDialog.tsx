import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { type Plan } from '@/features/master-admin/types/plan.types';
import apiClient from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/stores/user/user.store';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SubscriptionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere';

export const SubscriptionConfirmDialog: React.FC<SubscriptionConfirmDialogProps> = ({ open, onOpenChange, plan }) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const { profile, setProfile } = useUserStore();
  const navigate = useNavigate();

  // Load Razorpay Script
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (document.getElementById('razorpay-sdk')) return;
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  if (!plan) return null;

  const basePrice = billingCycle === 'YEARLY' ? plan.pricing?.yearlyPrice || 0 : plan.pricing?.monthlyPrice || 0;
  const discountAmount = (basePrice * (plan.pricing?.discountPercent || 0)) / 100;
  const priceAfterDiscount = basePrice - discountAmount;
  const taxAmount = (priceAfterDiscount * (plan.pricing?.taxPercent || 0)) / 100;
  const finalAmount = priceAfterDiscount + taxAmount;

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Initiate Purchase
      const { data } = await apiClient.post('/subscriptions/purchase', {
        planId: plan._id,
        billingCycle,
      });

      const { orderId, amount, currency } = data.data;

      // Dev Simulation fallback if no live keys or order is mock
      if (orderId.startsWith('order_mock_') || RAZORPAY_KEY === 'rzp_test_YourTestKeyHere') {
        toast.loading('Dev Mode: Razorpay test simulation initiating...', { duration: 1500 });
        setTimeout(async () => {
          try {
            await apiClient.post('/subscriptions/verify-purchase', {
              orderId: orderId,
              paymentId: `pay_mock_${Date.now()}`,
              signature: 'mock_signature_dev',
              planId: plan._id,
              billingCycle,
            });
            toast.success('Subscription activated successfully!');
            const meRes = await apiClient.get('/auth/me');
            let completed = false;
            if (meRes.data?.data) {
              setProfile(meRes.data.data);
              completed = !!meRes.data.data.onboardingCompleted;
            }
            onOpenChange(false);
            if (!completed) {
              navigate('/company/onboarding', { replace: true });
            } else {
              navigate('/company/dashboard', { replace: true });
            }
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        }, 1500);
        return;
      }

      // 2. Open Razorpay with all payment options enabled
      const options = {
        key: RAZORPAY_KEY,
        amount: amount * 100, // paise
        currency: currency,
        name: 'Practice Exam SaaS',
        description: `Subscription: ${plan.planName} (${billingCycle})`,
        order_id: orderId,
        handler: async function (response: Record<string, string>) {
          try {
            // 3. Verify Payment
            await apiClient.post('/subscriptions/verify-purchase', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planId: plan._id,
              billingCycle,
            });

            toast.success('Subscription activated successfully!');
            const meRes = await apiClient.get('/auth/me');
            let completed = false;
            if (meRes.data?.data) {
              setProfile(meRes.data.data);
              completed = !!meRes.data.data.onboardingCompleted;
            }
            onOpenChange(false);
            if (!completed) {
              navigate('/company/onboarding', { replace: true });
            } else {
              navigate('/company/dashboard', { replace: true });
            }
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: (profile as any)?.phone || '9999999999',
        },
        theme: {
          color: '#2D3E2C',
        },
        config: {
          display: {
            blocks: {
              all: {
                name: "All Payment Methods Enabled",
                instruments: [
                  { method: "card" },
                  { method: "upi" },
                  { method: "netbanking" },
                  { method: "wallet" },
                  { method: "emi" },
                  { method: "paylater" }
                ],
              },
            },
            sequence: ["block.all"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled by user');
            setIsProcessing(false);
          },
          confirm_close: true,
        },
      };

      const rzp = new (window as Record<string, any>).Razorpay(options);
      rzp.on('payment.failed', function (response: Record<string, any>) {
        toast.error(`Payment failed: ${response.error?.description || 'Transaction unsuccessful'}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: unknown) {
      toast.error((error as any).response?.data?.message || 'Failed to initiate purchase');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight">Confirm Subscription</DialogTitle>
          <DialogDescription className="text-sm">
            You have selected the <span className="font-bold text-foreground">{plan.planName}</span> plan. Choose your billing cycle to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center gap-4">
            <Button 
              variant={billingCycle === 'MONTHLY' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('MONTHLY')}
              className={cn(
                "flex-1 font-bold h-11 transition-all", 
                billingCycle === 'MONTHLY' 
                  ? "bg-[#2D3E2C] text-white hover:bg-[#2D3E2C]/90 shadow-sm" 
                  : "hover:border-[#2D3E2C]/40 text-muted-foreground"
              )}
            >
              Monthly
            </Button>
            <Button 
              variant={billingCycle === 'YEARLY' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('YEARLY')}
              className={cn(
                "flex-1 relative font-bold h-11 transition-all", 
                billingCycle === 'YEARLY' 
                  ? "bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 shadow-sm border border-[#2D3E2C]" 
                  : "hover:border-[#2D3E2C]/40 text-muted-foreground"
              )}
            >
              Yearly
              <span className="absolute -top-2.5 -right-2 bg-[#E4FD97] text-[#2D3E2C] text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-[#2D3E2C]/30 shadow-md">
                SAVE {plan.pricing?.monthlyPrice && plan.pricing?.yearlyPrice ? Math.round((1 - plan.pricing.yearlyPrice / (plan.pricing.monthlyPrice * 12)) * 100) : 0}%
              </span>
            </Button>
          </div>

          <div className="bg-muted/40 border border-border/50 p-4 rounded-xl space-y-2.5 text-sm">
            <div className="flex justify-between font-medium">
              <span className="text-muted-foreground">Base Price ({billingCycle.toLowerCase()})</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-semibold text-[#2D3E2C] dark:text-[#E4FD97]">
                <span>Discount ({plan.pricing?.discountPercent}%)</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({plan.pricing?.taxPercent}%)</span>
                <span>+₹{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border pt-3 mt-2 flex justify-between font-extrabold text-lg text-foreground">
              <span>Total Amount</span>
              <span>₹{Math.round(finalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="font-semibold" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            className="bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 hover:text-white font-extrabold px-6 shadow-md transition-all h-10" 
            onClick={handlePayment} 
            disabled={isProcessing || finalAmount <= 0}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#E4FD97]" /> : null}
            Pay & Activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
