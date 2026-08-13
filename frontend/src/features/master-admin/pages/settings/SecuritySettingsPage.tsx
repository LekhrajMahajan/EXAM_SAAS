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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Shield, Key, Lock, Globe, Server, UserCheck } from "lucide-react";
import { useSecuritySettings, useUpdateSecuritySettings } from "../../hooks/system-settings.hooks";

export const SecuritySettingsPage = () => {
  const { toast } = useToast();
  const { data: settingsData, isLoading: isLoadingSettings } = useSecuritySettings();
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSecuritySettings();

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
      toast({ title: "Success", description: "Security settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update security settings.", variant: "destructive" });
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Security Policies</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage global security policies, access controls, and compliance settings.
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

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList className="bg-muted border border-border shadow-sm p-1 gap-1 h-auto flex-wrap">
          <TabsTrigger value="password" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Key className="w-4 h-4 mr-2" />Password</TabsTrigger>
          <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><UserCheck className="w-4 h-4 mr-2" />Login & Session</TabsTrigger>
          <TabsTrigger value="mfa" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Shield className="w-4 h-4 mr-2" />MFA & 2FA</TabsTrigger>
          <TabsTrigger value="ip" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Globe className="w-4 h-4 mr-2" />IP & Geolocation</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Server className="w-4 h-4 mr-2" />API Security</TabsTrigger>
          <TabsTrigger value="exam" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Lock className="w-4 h-4 mr-2" />Exam Security</TabsTrigger>
        </TabsList>

        {/* Password Policy */}
        <TabsContent value="password" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Enforce strict password requirements for all users.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Minimum Password Length</Label>
                <Input type="number" value={formData.MIN_PASSWORD_LENGTH || 8} onChange={(e) => handleChange("MIN_PASSWORD_LENGTH", e.target.value)} onBlur={() => handleBlur("MIN_PASSWORD_LENGTH", "Minimum Length")} />
              </div>
              <div className="space-y-2">
                <Label>Maximum Password Length</Label>
                <Input type="number" value={formData.MAX_PASSWORD_LENGTH || 128} onChange={(e) => handleChange("MAX_PASSWORD_LENGTH", e.target.value)} onBlur={() => handleBlur("MAX_PASSWORD_LENGTH", "Maximum Length")} />
              </div>
              <div className="space-y-2">
                <Label>Password Expiry (Days, 0 to disable)</Label>
                <Input type="number" value={formData.PASSWORD_EXPIRY_DAYS || 90} onChange={(e) => handleChange("PASSWORD_EXPIRY_DAYS", e.target.value)} onBlur={() => handleBlur("PASSWORD_EXPIRY_DAYS", "Password Expiry")} />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Uppercase Letter</Label>
                  <p className="text-[10px] text-muted-foreground">Must contain at least one uppercase letter [A-Z]</p>
                </div>
                <Switch checked={formData.REQUIRE_UPPERCASE === "true"} onCheckedChange={(v) => handleToggle("REQUIRE_UPPERCASE", v, "Uppercase Requirement")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Lowercase Letter</Label>
                  <p className="text-[10px] text-muted-foreground">Must contain at least one lowercase letter [a-z]</p>
                </div>
                <Switch checked={formData.REQUIRE_LOWERCASE === "true"} onCheckedChange={(v) => handleToggle("REQUIRE_LOWERCASE", v, "Lowercase Requirement")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Numbers</Label>
                  <p className="text-[10px] text-muted-foreground">Must contain at least one number [0-9]</p>
                </div>
                <Switch checked={formData.REQUIRE_NUMBERS === "true"} onCheckedChange={(v) => handleToggle("REQUIRE_NUMBERS", v, "Number Requirement")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Special Characters</Label>
                  <p className="text-[10px] text-muted-foreground">Must contain at least one special character</p>
                </div>
                <Switch checked={formData.REQUIRE_SPECIAL_CHARACTERS === "true"} onCheckedChange={(v) => handleToggle("REQUIRE_SPECIAL_CHARACTERS", v, "Special Character Requirement")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Prevent Password Reuse</Label>
                  <p className="text-[10px] text-muted-foreground">Do not allow reusing previous passwords</p>
                </div>
                <Switch checked={formData.PREVENT_PASSWORD_REUSE === "true"} onCheckedChange={(v) => handleToggle("PREVENT_PASSWORD_REUSE", v, "Prevent Password Reuse")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login & Session */}
        <TabsContent value="login" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Login & Session Limits</CardTitle>
              <CardDescription>Configure account lockouts and session timeouts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md lg:col-span-3">
                <div className="space-y-0.5">
                  <Label>Global Login Enabled</Label>
                  <p className="text-[10px] text-muted-foreground">Allow users to log in to the system. Turn off to temporarily disable logins.</p>
                </div>
                <Switch checked={formData.LOGIN_ENABLED !== "false"} onCheckedChange={(v) => handleToggle("LOGIN_ENABLED", v, "Global Login")} />
              </div>
              
              <div className="space-y-2">
                <Label>Max Failed Login Attempts</Label>
                <Input type="number" value={formData.MAX_FAILED_LOGIN_ATTEMPTS || 5} onChange={(e) => handleChange("MAX_FAILED_LOGIN_ATTEMPTS", e.target.value)} onBlur={() => handleBlur("MAX_FAILED_LOGIN_ATTEMPTS", "Max Failed Logins")} />
              </div>
              <div className="space-y-2">
                <Label>Account Lock Duration (Minutes)</Label>
                <Input type="number" value={formData.ACCOUNT_LOCK_DURATION || 15} onChange={(e) => handleChange("ACCOUNT_LOCK_DURATION", e.target.value)} onBlur={() => handleBlur("ACCOUNT_LOCK_DURATION", "Account Lock Duration")} />
              </div>
              <div className="space-y-2">
                <Label>JWT Access Expiry (e.g., 1h, 15m)</Label>
                <Input value={formData.JWT_ACCESS_EXPIRY || "1h"} onChange={(e) => handleChange("JWT_ACCESS_EXPIRY", e.target.value)} onBlur={() => handleBlur("JWT_ACCESS_EXPIRY", "JWT Access Expiry")} />
              </div>
              <div className="space-y-2">
                <Label>JWT Refresh Expiry (e.g., 7d)</Label>
                <Input value={formData.JWT_REFRESH_EXPIRY || "7d"} onChange={(e) => handleChange("JWT_REFRESH_EXPIRY", e.target.value)} onBlur={() => handleBlur("JWT_REFRESH_EXPIRY", "JWT Refresh Expiry")} />
              </div>
              <div className="space-y-2">
                <Label>Max Concurrent Sessions Per User</Label>
                <Input type="number" value={formData.MAX_CONCURRENT_SESSIONS || 1} onChange={(e) => handleChange("MAX_CONCURRENT_SESSIONS", e.target.value)} onBlur={() => handleBlur("MAX_CONCURRENT_SESSIONS", "Max Concurrent Sessions")} />
              </div>

              <div className="space-y-2">
                <Label>Candidate Session Timeout (Minutes)</Label>
                <Input type="number" value={formData.SESSION_TIMEOUT_CANDIDATE || 60} onChange={(e) => handleChange("SESSION_TIMEOUT_CANDIDATE", e.target.value)} onBlur={() => handleBlur("SESSION_TIMEOUT_CANDIDATE", "Candidate Timeout")} />
              </div>
              <div className="space-y-2">
                <Label>Admin Session Timeout (Minutes)</Label>
                <Input type="number" value={formData.SESSION_TIMEOUT_COMPANY_ADMIN || 120} onChange={(e) => handleChange("SESSION_TIMEOUT_COMPANY_ADMIN", e.target.value)} onBlur={() => handleBlur("SESSION_TIMEOUT_COMPANY_ADMIN", "Admin Timeout")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MFA */}
        <TabsContent value="mfa" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
              <CardDescription>Configure global MFA requirements and policies.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enforce MFA Globally</Label>
                  <p className="text-[10px] text-muted-foreground">Force all users to configure MFA</p>
                </div>
                <Switch checked={formData.ENFORCE_MFA_GLOBALLY === "true"} onCheckedChange={(v) => handleToggle("ENFORCE_MFA_GLOBALLY", v, "Enforce MFA Globally")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Enforce MFA for Admins</Label>
                  <p className="text-[10px] text-muted-foreground">Force all administrative accounts to use MFA</p>
                </div>
                <Switch checked={formData.ENFORCE_MFA_ADMINS === "true"} onCheckedChange={(v) => handleToggle("ENFORCE_MFA_ADMINS", v, "Enforce MFA for Admins")} />
              </div>
              <div className="space-y-2">
                <Label>Allowed MFA Methods</Label>
                <Select value={formData.ALLOWED_MFA_METHODS || "all"} onValueChange={(v) => { handleChange("ALLOWED_MFA_METHODS", v); updateSettings({ ALLOWED_MFA_METHODS: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Allowed Methods" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Email & Authenticator App</SelectItem>
                    <SelectItem value="authenticator">Authenticator App Only</SelectItem>
                    <SelectItem value="email">Email OTP Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MFA Remember Device (Days)</Label>
                <Input type="number" value={formData.MFA_REMEMBER_DEVICE_DAYS || 30} onChange={(e) => handleChange("MFA_REMEMBER_DEVICE_DAYS", e.target.value)} onBlur={() => handleBlur("MFA_REMEMBER_DEVICE_DAYS", "Remember Device Duration")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IP & Geolocation */}
        <TabsContent value="ip" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>IP & Geolocation Whitelisting</CardTitle>
              <CardDescription>Restrict access based on networks and geographic locations.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md max-w-xl">
                <div className="space-y-0.5">
                  <Label>Enable IP Whitelisting for Admins</Label>
                  <p className="text-[10px] text-muted-foreground">Only allow admin logins from specified IP ranges</p>
                </div>
                <Switch checked={formData.ENABLE_ADMIN_IP_WHITELIST === "true"} onCheckedChange={(v) => handleToggle("ENABLE_ADMIN_IP_WHITELIST", v, "Admin IP Whitelist")} />
              </div>
              <div className="space-y-2">
                <Label>Admin Whitelisted IPs (Comma separated)</Label>
                <Input placeholder="192.168.1.1, 10.0.0.0/24" value={formData.ADMIN_WHITELISTED_IPS || ""} onChange={(e) => handleChange("ADMIN_WHITELISTED_IPS", e.target.value)} onBlur={() => handleBlur("ADMIN_WHITELISTED_IPS", "Whitelisted IPs")} />
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md max-w-xl mt-4">
                <div className="space-y-0.5">
                  <Label>Block Tor/VPN/Proxy Networks</Label>
                  <p className="text-[10px] text-muted-foreground">Automatically block known anonymous networks</p>
                </div>
                <Switch checked={formData.BLOCK_ANONYMOUS_NETWORKS === "true"} onCheckedChange={(v) => handleToggle("BLOCK_ANONYMOUS_NETWORKS", v, "Block Anonymous Networks")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Security */}
        <TabsContent value="api" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>API Rate Limiting & Throttling</CardTitle>
              <CardDescription>Configure protective measures for your API endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md lg:col-span-3">
                <div className="space-y-0.5">
                  <Label>Enable API Rate Limiting</Label>
                  <p className="text-[10px] text-muted-foreground">Enforce limits on the number of requests a client can make</p>
                </div>
                <Switch checked={formData.API_RATE_LIMIT_ENABLED === "true"} onCheckedChange={(v) => handleToggle("API_RATE_LIMIT_ENABLED", v, "API Rate Limiting")} />
              </div>
              
              <div className="space-y-2">
                <Label>Max Requests Per Window</Label>
                <Input type="number" value={formData.API_RATE_LIMIT_MAX || 100} onChange={(e) => handleChange("API_RATE_LIMIT_MAX", e.target.value)} onBlur={() => handleBlur("API_RATE_LIMIT_MAX", "Max API Requests")} />
              </div>
              <div className="space-y-2">
                <Label>Time Window (Minutes)</Label>
                <Input type="number" value={formData.API_RATE_LIMIT_WINDOW || 1} onChange={(e) => handleChange("API_RATE_LIMIT_WINDOW", e.target.value)} onBlur={() => handleBlur("API_RATE_LIMIT_WINDOW", "Time Window")} />
              </div>
              <div className="space-y-2">
                <Label>CORS Origin Whitelist (Comma separated)</Label>
                <Input placeholder="https://example.com, https://app.example.com" value={formData.CORS_ORIGIN_WHITELIST || ""} onChange={(e) => handleChange("CORS_ORIGIN_WHITELIST", e.target.value)} onBlur={() => handleBlur("CORS_ORIGIN_WHITELIST", "CORS Origins")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Security */}
        <TabsContent value="exam" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Global Exam Security Restrictions</CardTitle>
              <CardDescription>Default restrictions applied to examinations.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Prevent Copy/Paste</Label>
                  <p className="text-[10px] text-muted-foreground">Disable clipboard operations during exams</p>
                </div>
                <Switch checked={formData.EXAM_PREVENT_COPY_PASTE === "true"} onCheckedChange={(v) => handleToggle("EXAM_PREVENT_COPY_PASTE", v, "Prevent Copy Paste")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Force Fullscreen</Label>
                  <p className="text-[10px] text-muted-foreground">Require exams to run in fullscreen mode</p>
                </div>
                <Switch checked={formData.EXAM_FORCE_FULLSCREEN === "true"} onCheckedChange={(v) => handleToggle("EXAM_FORCE_FULLSCREEN", v, "Force Fullscreen")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Detect Tab Switching</Label>
                  <p className="text-[10px] text-muted-foreground">Warn or auto-submit if candidate switches tabs</p>
                </div>
                <Switch checked={formData.EXAM_DETECT_TAB_SWITCH === "true"} onCheckedChange={(v) => handleToggle("EXAM_DETECT_TAB_SWITCH", v, "Detect Tab Switching")} />
              </div>
              <div className="space-y-2">
                <Label>Max Tab Switches Allowed</Label>
                <Input type="number" value={formData.EXAM_MAX_TAB_SWITCHES || 3} onChange={(e) => handleChange("EXAM_MAX_TAB_SWITCHES", e.target.value)} onBlur={() => handleBlur("EXAM_MAX_TAB_SWITCHES", "Max Tab Switches")} />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label>Require Proctoring By Default</Label>
                  <p className="text-[10px] text-muted-foreground">All new exams will require camera/mic access</p>
                </div>
                <Switch checked={formData.EXAM_REQUIRE_PROCTORING === "true"} onCheckedChange={(v) => handleToggle("EXAM_REQUIRE_PROCTORING", v, "Require Proctoring")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
