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
import { useConfirm } from "@/providers/ConfirmProvider";
import { Loader2, Settings, Server, Clock, Save, RefreshCw } from "lucide-react";
import {
  useGeneralSettings,
  useUpdateGeneralSettings,
  useResetGeneralSettings,
  useSystemInfo,
} from "../../hooks/system-settings.hooks";

export const GeneralSettingsPage = () => {
  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: settingsData, isLoading: isLoadingSettings } = useGeneralSettings();
  const { data: systemInfoData, isLoading: isLoadingSystemInfo } = useSystemInfo();

  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateGeneralSettings();
  const { mutateAsync: resetSettings, isPending: isResetting } = useResetGeneralSettings();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedRole, setSelectedRole] = useState<string>("COMPANY_ADMIN");
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
      toast({ title: "Success", description: "Settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    }
  };

  const handleReset = async () => {
    if (await confirm("Are you sure you want to restore default settings? This action cannot be undone.")) {
      try {
        await resetSettings();
        toast({ title: "Success", description: "Settings restored to defaults." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to restore settings.", variant: "destructive" });
      }
    }
  };

  const handleToggle = async (key: string, checked: boolean, title: string) => {
    handleChange(key, checked);
    try {
      await updateSettings({ [key]: checked });
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch (error) {
      handleChange(key, !checked);
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
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

  const cardStyle = "border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card text-card-foreground";

  if (isLoadingSettings || isLoadingSystemInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure global application settings and system behavior.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset} 
            disabled={isResetting || isUpdating}
            className="gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Restore Defaults
          </Button>
          <Button 
            variant="outline"
            onClick={handleSave} 
            disabled={isUpdating || isResetting}
            className="gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General Information
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="w-4 h-4 mr-2" />
            System Options
          </TabsTrigger>
          <TabsTrigger value="session">
            <Clock className="w-4 h-4 mr-2" />
            Session Settings
          </TabsTrigger>
          <TabsTrigger value="info">
            <Settings className="w-4 h-4 mr-2" />
            System Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Basic information about your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Name</Label>
                  <Input
                    placeholder="e.g. ExamGuard Pro"
                    value={formData.APP_NAME || ""}
                    onChange={(e) => handleChange("APP_NAME", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select
                    value={formData.DEFAULT_LANGUAGE || ""}
                    onValueChange={(value) => handleChange("DEFAULT_LANGUAGE", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (IN)</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select
                    value={formData.DEFAULT_TIMEZONE || ""}
                    onValueChange={(value) => handleChange("DEFAULT_TIMEZONE", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select
                    value={formData.DEFAULT_CURRENCY || ""}
                    onValueChange={(value) => handleChange("DEFAULT_CURRENCY", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    placeholder="e.g. support@examguard.pro"
                    value={formData.SUPPORT_EMAIL || ""}
                    onChange={(e) => handleChange("SUPPORT_EMAIL", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>System Toggles</CardTitle>
              <CardDescription>Enable or disable core system features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable access to the platform for maintenance. Only Master Admins can log in.
                  </p>
                </div>
                <Switch
                  checked={formData.MAINTENANCE_MODE || false}
                  onCheckedChange={(checked) => handleToggle("MAINTENANCE_MODE", checked, "Maintenance mode")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users and companies to register.
                  </p>
                </div>
                <Switch
                  checked={formData.REGISTRATION_ENABLED !== false}
                  onCheckedChange={(checked) => handleToggle("REGISTRATION_ENABLED", checked, "User registration")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Login Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow existing users to log into the platform.
                  </p>
                </div>
                <Switch
                  checked={formData.LOGIN_ENABLED !== false}
                  onCheckedChange={(checked) => handleToggle("LOGIN_ENABLED", checked, "Login access")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Security & Sessions</CardTitle>
                <CardDescription>Manage user session limits and timeouts.</CardDescription>
              </div>
              <div className="w-[200px]">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPANY_ADMIN">Company Admin</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="CANDIDATE">Candidate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 60"
                    value={formData[`SESSION_TIMEOUT_${selectedRole}`] || ""}
                    onChange={(e) => handleChange(`SESSION_TIMEOUT_${selectedRole}`, parseInt(e.target.value) || "")}
                    onBlur={() => handleBlur(`SESSION_TIMEOUT_${selectedRole}`, "Session Timeout")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Idle Timeout (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 15"
                    value={formData[`IDLE_TIMEOUT_${selectedRole}`] || ""}
                    onChange={(e) => handleChange(`IDLE_TIMEOUT_${selectedRole}`, parseInt(e.target.value) || "")}
                    onBlur={() => handleBlur(`IDLE_TIMEOUT_${selectedRole}`, "Idle Timeout")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5"
                    value={formData[`MAX_LOGIN_ATTEMPTS_${selectedRole}`] || ""}
                    onChange={(e) => handleChange(`MAX_LOGIN_ATTEMPTS_${selectedRole}`, parseInt(e.target.value) || "")}
                    onBlur={() => handleBlur(`MAX_LOGIN_ATTEMPTS_${selectedRole}`, "Max Login Attempts")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 90"
                    value={formData[`PASSWORD_EXPIRY_DAYS_${selectedRole}`] || ""}
                    onChange={(e) => handleChange(`PASSWORD_EXPIRY_DAYS_${selectedRole}`, parseInt(e.target.value) || "")}
                    onBlur={() => handleBlur(`PASSWORD_EXPIRY_DAYS_${selectedRole}`, "Password Expiry")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Read-only environment details.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-semibold uppercase text-muted-foreground line-clamp-2 leading-tight">Current Version</h4>
                  <p className="mt-1 text-2xl font-bold text-foreground">{systemInfoData?.data?.currentVersion || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-semibold uppercase text-muted-foreground line-clamp-2 leading-tight">Backend Version</h4>
                  <p className="mt-1 text-2xl font-bold text-foreground">{systemInfoData?.data?.backendVersion || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-semibold uppercase text-muted-foreground line-clamp-2 leading-tight">Database Version</h4>
                  <p className="mt-1 text-2xl font-bold text-foreground">{systemInfoData?.data?.databaseVersion || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-semibold uppercase text-muted-foreground line-clamp-2 leading-tight">Build Date</h4>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {systemInfoData?.data?.buildDate 
                      ? new Date(systemInfoData.data.buildDate).toLocaleString() 
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
