import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useUpdatePreferences } from "../../hooks/profile.hooks";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface AccountSettingsProps {
  user: any;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const updatePreferences = useUpdatePreferences();

  const { control, register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      secondaryEmail: "", // Mocked
      mobileNumber: user?.mobileNumber || "",
      language: user?.preferences?.language || "ENGLISH",
      timezone: "Asia/Kolkata", // Mocked
      dateFormat: "DD/MM/YYYY", // Mocked
    }
  });

  const onSubmit = (data: any) => {
    // Only language is supported in backend preferences for now
    updatePreferences.mutate({ language: data.language }, {
      onSuccess: () => toast.success("Account settings updated successfully"),
      onError: () => toast.error("Failed to update settings")
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account identifiers and regional settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} disabled className="bg-muted" />
                <p className="text-[10px] text-muted-foreground">Username cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Primary Email</Label>
                <Input id="email" type="email" {...register("email")} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryEmail">Secondary Email</Label>
                <Input id="secondaryEmail" type="email" {...register("secondaryEmail")} placeholder="backup@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" {...register("mobileNumber")} disabled className="bg-muted" />
                <p className="text-[10px] text-muted-foreground">Contact support to change mobile number.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Regional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENGLISH">English (US)</SelectItem>
                        <SelectItem value="HINDI">Hindi</SelectItem>
                        <SelectItem value="GUJARATI">Gujarati</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                        <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Controller
                  name="dateFormat"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={!isDirty || updatePreferences.isPending}>
              {updatePreferences.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
