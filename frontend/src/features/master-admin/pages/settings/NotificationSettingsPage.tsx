import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Globe, Mail, MessageSquare, Bell, Smartphone, Radio, FileText, Zap, Send } from "lucide-react";
import { useNotificationSettings, useUpdateNotificationSettings } from "../../hooks/system-settings.hooks";

export const NotificationSettingsPage = () => {
  const { toast } = useToast();
  const { data: settingsData, isLoading: isLoadingSettings } = useNotificationSettings();
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateNotificationSettings();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [prevSettingsData, setPrevSettingsData] = useState<any>(null);

  if (settingsData !== prevSettingsData) {
    setPrevSettingsData(settingsData);
    if (settingsData?.data) {
      const initialData: Record<string, any> = {};
      settingsData.data.forEach((setting: any) => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      toast({ title: "Success", description: "Notification settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update notification settings.", variant: "destructive" });
    }
  };

  const handleBlur = async (key: string, title: string) => {
    const value = formData[key];
    try {
      await updateSettings({ [key]: value });
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch (error) {
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const handleToggle = async (key: string, value: boolean, title: string) => {
    handleChange(key, String(value));
    try {
      await updateSettings({ [key]: String(value) });
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch (error) {
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const cardStyle = "border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card text-card-foreground";

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage global notifications, emails, SMS, push alerts, and templates across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={handleSave} 
            disabled={isUpdating} 
            className="min-w-[120px] gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="bg-muted border border-border shadow-sm p-1 gap-1 h-auto flex-wrap">
          <TabsTrigger value="global" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Globe className="w-4 h-4 mr-2" />Global</TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><MessageSquare className="w-4 h-4 mr-2" />SMS</TabsTrigger>
          <TabsTrigger value="push" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Smartphone className="w-4 h-4 mr-2" />Push</TabsTrigger>
          <TabsTrigger value="inapp" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Bell className="w-4 h-4 mr-2" />In-App</TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Radio className="w-4 h-4 mr-2" />Real-Time</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Zap className="w-4 h-4 mr-2" />Events</TabsTrigger>
          <TabsTrigger value="delivery" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Send className="w-4 h-4 mr-2" />Delivery</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><FileText className="w-4 h-4 mr-2" />Templates</TabsTrigger>
        </TabsList>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Master switches to completely enable or disable notification systems.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border border-border p-3 rounded-md lg:col-span-2 bg-muted/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Enable All Notifications Globally</Label>
                  <p className="text-xs text-muted-foreground">Master switch. If disabled, absolutely NO notifications will be sent from the platform.</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLED !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLED", v, "Global Notifications")} />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle email gateway system-wide</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_EMAIL !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_EMAIL", v, "Email Notifications")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle SMS gateway system-wide</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_SMS !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_SMS", v, "SMS Notifications")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable Push Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle mobile/browser push notifications</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_PUSH !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_PUSH", v, "Push Notifications")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable In-App Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle bell icon notifications inside the app</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_INAPP !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_INAPP", v, "In-App Notifications")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable Real-Time (Socket.IO)</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle live real-time sockets system-wide</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_REAL_TIME !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_REAL_TIME", v, "Real-Time Notifications")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Queue Processing Enabled</Label>
                  <p className="text-[10px] text-muted-foreground">If disabled, jobs stay in queue and do not process.</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_QUEUE_PROCESSING !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_QUEUE_PROCESSING", v, "Queue Processing")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure default sender behaviors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Default Sender Name</Label>
                <Input placeholder="ExamGuard Admin" value={formData.NOTIFICATIONS_DEFAULT_SENDER_NAME || ""} onChange={(e) => handleChange("NOTIFICATIONS_DEFAULT_SENDER_NAME", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_DEFAULT_SENDER_NAME", "Default Sender Name")} />
              </div>
              <div className="space-y-2">
                <Label>Default Sender Email</Label>
                <Input placeholder="no-reply@examguard.com" value={formData.NOTIFICATIONS_DEFAULT_SENDER_EMAIL || ""} onChange={(e) => handleChange("NOTIFICATIONS_DEFAULT_SENDER_EMAIL", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_DEFAULT_SENDER_EMAIL", "Default Sender Email")} />
              </div>
              <div className="space-y-2">
                <Label>Reply-To Email</Label>
                <Input placeholder="support@examguard.com" value={formData.NOTIFICATIONS_REPLY_TO_EMAIL || ""} onChange={(e) => handleChange("NOTIFICATIONS_REPLY_TO_EMAIL", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_REPLY_TO_EMAIL", "Reply-To Email")} />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable HTML Emails</Label>
                  <p className="text-[10px] text-muted-foreground">Send rich text emails (recommended)</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_HTML_EMAILS !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_HTML_EMAILS", v, "HTML Emails")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable Attachments</Label>
                  <p className="text-[10px] text-muted-foreground">Allow PDF/CSV attachments (e.g. results)</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_ENABLE_ATTACHMENTS !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_ENABLE_ATTACHMENTS", v, "Email Attachments")} />
              </div>
              <div className="space-y-2">
                <Label>Maximum Attachment Size (MB)</Label>
                <Input type="number" value={formData.NOTIFICATIONS_MAX_ATTACHMENT_SIZE || 10} onChange={(e) => handleChange("NOTIFICATIONS_MAX_ATTACHMENT_SIZE", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_MAX_ATTACHMENT_SIZE", "Maximum Attachment Size")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>SMS Settings</CardTitle>
              <CardDescription>Configure short message service behavior.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Default Sender ID</Label>
                <Input placeholder="EXAMGRD" value={formData.NOTIFICATIONS_SMS_SENDER_ID || ""} onChange={(e) => handleChange("NOTIFICATIONS_SMS_SENDER_ID", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_SMS_SENDER_ID", "SMS Sender ID")} />
              </div>
              <div className="space-y-2">
                <Label>Maximum SMS Length (Characters)</Label>
                <Input type="number" value={formData.NOTIFICATIONS_SMS_MAX_LENGTH || 160} onChange={(e) => handleChange("NOTIFICATIONS_SMS_MAX_LENGTH", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_SMS_MAX_LENGTH", "Max SMS Length")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Retry Failed SMS</Label>
                  <p className="text-[10px] text-muted-foreground">Automatically enqueue failed deliveries</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_SMS_RETRY_FAILED === "true"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_SMS_RETRY_FAILED", v, "Retry Failed SMS")} />
              </div>
              <div className="space-y-2">
                <Label>SMS Rate Limiting (per min)</Label>
                <Input type="number" value={formData.NOTIFICATIONS_SMS_RATE_LIMIT || 100} onChange={(e) => handleChange("NOTIFICATIONS_SMS_RATE_LIMIT", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_SMS_RATE_LIMIT", "SMS Rate Limit")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Settings */}
        <TabsContent value="push" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Push Notification Settings</CardTitle>
              <CardDescription>Configure browser and mobile push notifications.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>VAPID Public Key</Label>
                <Input placeholder="Enter VAPID public key" value={formData.NOTIFICATIONS_PUSH_VAPID_PUBLIC_KEY || ""} onChange={(e) => handleChange("NOTIFICATIONS_PUSH_VAPID_PUBLIC_KEY", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_PUSH_VAPID_PUBLIC_KEY", "VAPID Public Key")} />
              </div>
              <div className="space-y-2">
                <Label>FCM Server Key</Label>
                <Input type="password" placeholder="Enter FCM server key" value={formData.NOTIFICATIONS_PUSH_FCM_SERVER_KEY || ""} onChange={(e) => handleChange("NOTIFICATIONS_PUSH_FCM_SERVER_KEY", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_PUSH_FCM_SERVER_KEY", "FCM Server Key")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Explicit Opt-In</Label>
                  <p className="text-[10px] text-muted-foreground">Ask users before sending push alerts</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_PUSH_REQUIRE_OPTIN !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_PUSH_REQUIRE_OPTIN", v, "Require Opt-In")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In-App Settings */}
        <TabsContent value="inapp" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Configure how notifications appear inside the web application.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Notification Retention (Days)</Label>
                <Input type="number" placeholder="30" value={formData.NOTIFICATIONS_INAPP_RETENTION_DAYS || 30} onChange={(e) => handleChange("NOTIFICATIONS_INAPP_RETENTION_DAYS", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_INAPP_RETENTION_DAYS", "Retention Days")} />
              </div>
              <div className="space-y-2">
                <Label>Max Unread Count Display</Label>
                <Input type="number" placeholder="99" value={formData.NOTIFICATIONS_INAPP_MAX_UNREAD || 99} onChange={(e) => handleChange("NOTIFICATIONS_INAPP_MAX_UNREAD", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_INAPP_MAX_UNREAD", "Max Unread")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Play Sound on Notification</Label>
                  <p className="text-[10px] text-muted-foreground">Play a subtle &quot;ding&quot; sound</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_INAPP_PLAY_SOUND === "true"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_INAPP_PLAY_SOUND", v, "Play Sound")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-Time Settings */}
        <TabsContent value="realtime" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Real-Time Architecture</CardTitle>
              <CardDescription>Configure WebSocket behavior for real-time deliveries.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Allow Long Polling Fallback</Label>
                  <p className="text-[10px] text-muted-foreground">If WebSocket fails, fallback to HTTP long polling</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_REALTIME_ALLOW_POLLING !== "false"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_REALTIME_ALLOW_POLLING", v, "Long Polling Fallback")} />
              </div>
              <div className="space-y-2">
                <Label>Disconnect Timeout (ms)</Label>
                <Input type="number" placeholder="5000" value={formData.NOTIFICATIONS_REALTIME_DISCONNECT_TIMEOUT || 5000} onChange={(e) => handleChange("NOTIFICATIONS_REALTIME_DISCONNECT_TIMEOUT", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_REALTIME_DISCONNECT_TIMEOUT", "Disconnect Timeout")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Settings */}
        <TabsContent value="events" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Notification Events</CardTitle>
              <CardDescription>Determine what events trigger automatic notifications.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 pt-0">
              {[
                { key: "USER_REGISTRATION", label: "User Registration" },
                { key: "USER_APPROVAL", label: "User Approval" },
                { key: "COMPANY_APPROVAL", label: "Company Approval" },
                { key: "SUBSCRIPTION_PURCHASED", label: "Subscription Purchased" },
                { key: "PAYMENT_SUCCESS", label: "Payment Success" },
                { key: "PAYMENT_FAILED", label: "Payment Failed" },
                { key: "EXAM_CREATED", label: "Exam Created" },
                { key: "EXAM_CANCELLED", label: "Exam Cancelled" },
                { key: "ADMIT_CARD_GENERATED", label: "Admit Card Generated" },
                { key: "EXAM_REMINDER", label: "Exam Reminder" },
                { key: "EXAM_STARTED", label: "Exam Started" },
                { key: "EXAM_SUBMITTED", label: "Exam Submitted" },
                { key: "ATTENDANCE_MARKED", label: "Attendance Marked" },
                { key: "RESULT_PUBLISHED", label: "Result Published" },
                { key: "MERIT_LIST_PUBLISHED", label: "Merit List Published" },
                { key: "CERTIFICATE_GENERATED", label: "Certificate Generated" },
                { key: "PASSWORD_CHANGED", label: "Password Changed" },
                { key: "PASSWORD_RESET", label: "Password Reset" },
                { key: "LOGIN_ALERT", label: "Login Alert" },
                { key: "SECURITY_ALERT", label: "Security Alert" },
              ].map(event => (
                <div key={event.key} className="flex items-center justify-between border p-3 rounded-md">
                  <Label className="text-sm">{event.label}</Label>
                  <Switch 
                    checked={formData[`NOTIFICATIONS_EVENT_${event.key}`] !== "false"} 
                    onCheckedChange={(v) => handleToggle(`NOTIFICATIONS_EVENT_${event.key}`, v, event.label)} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Delivery Logistics</CardTitle>
              <CardDescription>Configure queues, retries, and scheduled dispatching.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Global Rate Limit (per hour)</Label>
                <Input type="number" placeholder="5000" value={formData.NOTIFICATIONS_DELIVERY_RATE_LIMIT || 5000} onChange={(e) => handleChange("NOTIFICATIONS_DELIVERY_RATE_LIMIT", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_DELIVERY_RATE_LIMIT", "Rate Limit")} />
              </div>
              <div className="space-y-2">
                <Label>Max Retry Attempts</Label>
                <Input type="number" placeholder="3" value={formData.NOTIFICATIONS_DELIVERY_MAX_RETRIES || 3} onChange={(e) => handleChange("NOTIFICATIONS_DELIVERY_MAX_RETRIES", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_DELIVERY_MAX_RETRIES", "Max Retries")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enable Digest Emails</Label>
                  <p className="text-[10px] text-muted-foreground">Roll up multiple alerts into a single digest</p>
                </div>
                <Switch checked={formData.NOTIFICATIONS_DELIVERY_DIGESTS === "true"} onCheckedChange={(v) => handleToggle("NOTIFICATIONS_DELIVERY_DIGESTS", v, "Digest Emails")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Template Settings */}
        <TabsContent value="templates" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
              <CardDescription>Customize the textual content of default notifications.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Welcome Email Subtitle</Label>
                <Input placeholder="Welcome to ExamGuard!" value={formData.NOTIFICATIONS_TEMPLATE_WELCOME || ""} onChange={(e) => handleChange("NOTIFICATIONS_TEMPLATE_WELCOME", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_TEMPLATE_WELCOME", "Welcome Template")} />
              </div>
              <div className="space-y-2">
                <Label>OTP Verification Template</Label>
                <Input placeholder="Your OTP code is {{otp}}" value={formData.NOTIFICATIONS_TEMPLATE_OTP || ""} onChange={(e) => handleChange("NOTIFICATIONS_TEMPLATE_OTP", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_TEMPLATE_OTP", "OTP Template")} />
              </div>
              <div className="space-y-2">
                <Label>Exam Reminder Template</Label>
                <Input placeholder="Reminder: Your exam {{examName}} starts at {{time}}." value={formData.NOTIFICATIONS_TEMPLATE_EXAM_REMINDER || ""} onChange={(e) => handleChange("NOTIFICATIONS_TEMPLATE_EXAM_REMINDER", e.target.value)} onBlur={() => handleBlur("NOTIFICATIONS_TEMPLATE_EXAM_REMINDER", "Exam Reminder Template")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
