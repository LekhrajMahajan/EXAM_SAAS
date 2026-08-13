import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  useGetMfaSettings,
  useUpdateMfaSettings,
  useGetMfaStatistics,
  useGetMfaUsers,
  useDisableMfaUser,
  useResetMfaUser,
  useGenerateRecoveryCodes,
} from "../hooks/security.hooks";
import { PageLoader } from "@/shared/components/loading/LoadingComponents";
import { ShieldCheck, Users, Lock, KeyRound, Smartphone, AlertTriangle } from "lucide-react";

export const MfaManagementPage: React.FC = () => {
  const { data: settingsData, isLoading: isSettingsLoading } = useGetMfaSettings();
  const { data: statsData, isLoading: isStatsLoading } = useGetMfaStatistics();
  const updateSettingsMutation = useUpdateMfaSettings();

  const [activeTab, setActiveTab] = useState("dashboard");

  if (isSettingsLoading || isStatsLoading) return <PageLoader />;

  const settings = settingsData?.data;
  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Factor Authentication</h2>
          <p className="text-muted-foreground mt-1">
            Manage global MFA policies, monitor adoption, and support user access.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="dashboard" className="rounded-md">Dashboard</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md">Global Policies</TabsTrigger>
          <TabsTrigger value="users" className="rounded-md">User Enrollment</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <MfaDashboard stats={stats} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {settings && (
            <MfaSettingsForm settings={settings} onSave={(updates) => updateSettingsMutation.mutate(updates)} isSaving={updateSettingsMutation.isPending} />
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <MfaUsersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Dashboard Component ---
const MfaDashboard = ({ stats }: { stats: any }) => {
  if (!stats) return null;
  const cards = [
    { title: "MFA Enabled Users", value: stats.mfaEnabledUsers, icon: <ShieldCheck className="h-5 w-5 text-green-500" /> },
    { title: "Pending Enrollment", value: stats.pendingEnrollment, icon: <Users className="h-5 w-5 text-amber-500" /> },
    { title: "Locked Accounts", value: stats.lockedAccounts, icon: <Lock className="h-5 w-5 text-red-500" /> },
    { title: "Recovery Codes Generated", value: stats.recoveryCodesGenerated, icon: <KeyRound className="h-5 w-5 text-blue-500" /> },
    { title: "Failed MFA Attempts", value: stats.failedMfaAttempts, icon: <AlertTriangle className="h-5 w-5 text-destructive" /> },
    { title: "Trusted Devices", value: stats.trustedDevices, icon: <Smartphone className="h-5 w-5 text-indigo-500" /> },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((c, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
            {c.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// --- Settings Form ---
const MfaSettingsForm = ({ settings, onSave, isSaving }: { settings: any; onSave: (d: any) => void; isSaving: boolean }) => {
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Supported Methods</CardTitle>
          <CardDescription>Select which MFA methods are allowed for users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Authenticator App (TOTP)</Label>
              <p className="text-sm text-muted-foreground">Highest security recommendation.</p>
            </div>
            <Switch
              checked={formData.supportedMethods.totp}
              onCheckedChange={(c) => setFormData({ ...formData, supportedMethods: { ...formData.supportedMethods, totp: c } })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Email OTP</Label>
              <p className="text-sm text-muted-foreground">Standard email delivery.</p>
            </div>
            <Switch
              checked={formData.supportedMethods.emailOtp}
              onCheckedChange={(c) => setFormData({ ...formData, supportedMethods: { ...formData.supportedMethods, emailOtp: c } })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Backup Recovery Codes</Label>
              <p className="text-sm text-muted-foreground">Provide fallback codes if device is lost.</p>
            </div>
            <Switch
              checked={formData.supportedMethods.backupCodes}
              onCheckedChange={(c) => setFormData({ ...formData, supportedMethods: { ...formData.supportedMethods, backupCodes: c } })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Enforcement</CardTitle>
          <CardDescription>Determine MFA requirements by user role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.roleEnforcements.map((enf: any, idx: number) => (
            <div key={enf.role} className="flex items-center justify-between">
              <Label className="capitalize">{enf.role.replace("_", " ").toLowerCase()}</Label>
              <Select
                value={enf.requirement}
                onValueChange={(val) => {
                  const newEnf = [...formData.roleEnforcements];
                  newEnf[idx].requirement = val;
                  setFormData({ ...formData, roleEnforcements: newEnf });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Required">Required</SelectItem>
                  <SelectItem value="Optional">Optional</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Flow Settings</CardTitle>
          <CardDescription>Configure how often users are prompted for MFA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Require MFA on every login</Label>
            <Switch
              checked={formData.loginFlowSettings.requireEveryLogin}
              onCheckedChange={(c) => setFormData({ ...formData, loginFlowSettings: { ...formData.loginFlowSettings, requireEveryLogin: c } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Require MFA on new device detection</Label>
            <Switch
              checked={formData.loginFlowSettings.requireOnNewDevice}
              onCheckedChange={(c) => setFormData({ ...formData, loginFlowSettings: { ...formData.loginFlowSettings, requireOnNewDevice: c } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Require MFA after password change</Label>
            <Switch
              checked={formData.loginFlowSettings.requireAfterPasswordChange}
              onCheckedChange={(c) => setFormData({ ...formData, loginFlowSettings: { ...formData.loginFlowSettings, requireAfterPasswordChange: c } })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Policies"}
        </Button>
      </div>
    </div>
  );
};

// --- Users Table Component ---
const MfaUsersTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMfaUsers(page, 10);
  const disableMutation = useDisableMfaUser();
  const resetMutation = useResetMfaUser();
  const recoveryMutation = useGenerateRecoveryCodes();

  if (isLoading) return <PageLoader />;
  const users = data?.data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Enrollment Status</CardTitle>
        <CardDescription>Manage individual user MFA settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 font-medium">User</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Method</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="p-3"><Badge variant="outline">{u.role}</Badge></td>
                  <td className="p-3">
                    {u.isMfaEnabled ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Not Enrolled</Badge>
                    )}
                  </td>
                  <td className="p-3 capitalize">{u.currentMethod || "N/A"}</td>
                  <td className="p-3 text-right space-x-2">
                    {u.isMfaEnabled && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Generate new recovery codes for this user? Old codes will be invalidated.")) {
                              recoveryMutation.mutate(u._id);
                            }
                          }}
                        >
                          Codes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Reset MFA enrollment? The user will have to set up MFA again.")) {
                              resetMutation.mutate(u._id);
                            }
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Disable MFA? This removes MFA protection from the account.")) {
                              disableMutation.mutate(u._id);
                            }
                          }}
                        >
                          Disable
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
