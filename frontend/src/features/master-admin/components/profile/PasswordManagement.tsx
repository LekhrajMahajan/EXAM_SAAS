import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useChangePassword } from "../../hooks/profile.hooks";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, ShieldAlert, Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordManagement: React.FC = () => {
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const newPassword = watch("newPassword", "");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "Weak", color: "bg-slate-200", icon: ShieldAlert };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.match(/[A-Z]/)) score++;
    if (pwd.match(/[a-z]/)) score++;
    if (pwd.match(/[0-9]/)) score++;
    if (pwd.match(/[^A-Za-z0-9]/)) score++;

    if (score < 3) return { score, text: "Weak", color: "bg-red-500", icon: ShieldAlert };
    if (score < 5) return { score, text: "Medium", color: "bg-amber-500", icon: ShieldAlert };
    return { score, text: "Strong", color: "bg-emerald-500", icon: ShieldCheck };
  };

  const strength = getPasswordStrength(newPassword);

  const onSubmit = (data: PasswordFormValues) => {
    changePassword.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        reset();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to change password");
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm max-w-2xl">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 relative">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showCurrent ? "text" : "password"} 
                {...register("currentPassword")} 
                className="pr-10"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-9 w-9 text-slate-400 hover:text-slate-600"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input 
                id="newPassword" 
                type={showNew ? "text" : "password"} 
                {...register("newPassword")} 
                className="pr-10"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-9 w-9 text-slate-400 hover:text-slate-600"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
            
            {newPassword && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <strength.icon className={`w-3 h-3 ${strength.text === 'Strong' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    Password Strength: <span className="font-medium">{strength.text}</span>
                  </span>
                </div>
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-100'}`}></div>
                  <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-100'}`}></div>
                  <div className={`flex-1 rounded-full ${strength.score >= 5 ? strength.color : 'bg-slate-100'}`}></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
