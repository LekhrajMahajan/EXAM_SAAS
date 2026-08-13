import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useUpdatePreferences } from "../../hooks/profile.hooks";
import { toast } from "react-hot-toast";
import { Loader2, Monitor, Moon, Sun } from "lucide-react";

interface PreferencesSettingsProps {
  user: any;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ user }) => {
  const updatePreferences = useUpdatePreferences();

  const { control, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      theme: user?.preferences?.theme || "SYSTEM",
      sidebarState: "expanded", // Mocked
      dashboardLayout: "default", // Mocked
      notifications: {
        email: user?.preferences?.notifications?.email ?? true,
        sms: user?.preferences?.notifications?.sms ?? true,
        push: user?.preferences?.notifications?.push ?? true,
      }
    }
  });

  const onSubmit = (data: any) => {
    updatePreferences.mutate({
      theme: data.theme,
      notifications: data.notifications
    }, {
      onSuccess: () => toast.success("Preferences updated successfully"),
      onError: () => toast.error("Failed to update preferences")
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>System Preferences</CardTitle>
        <CardDescription>Customize your workspace and notification settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Appearance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <Controller
                  name="theme"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <Button type="button" variant={field.value === 'LIGHT' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => field.onChange('LIGHT')}>
                        <Sun className="w-4 h-4" /> Light
                      </Button>
                      <Button type="button" variant={field.value === 'DARK' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => field.onChange('DARK')}>
                        <Moon className="w-4 h-4" /> Dark
                      </Button>
                      <Button type="button" variant={field.value === 'SYSTEM' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => field.onChange('SYSTEM')}>
                        <Monitor className="w-4 h-4" /> System
                      </Button>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Sidebar State</Label>
                <Controller
                  name="sidebarState"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sidebar state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expanded">Expanded (Default)</SelectItem>
                        <SelectItem value="collapsed">Collapsed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Notification Preferences</h3>
            <div className="space-y-4 border rounded-xl p-4 bg-muted/50 border-border">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive daily digests and critical alerts via email.</p>
                </div>
                <Controller
                  name="notifications.email"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive critical system alerts via SMS.</p>
                </div>
                <Controller
                  name="notifications.sms"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive real-time notifications in the browser.</p>
                </div>
                <Controller
                  name="notifications.push"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={!isDirty || updatePreferences.isPending}>
              {updatePreferences.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
