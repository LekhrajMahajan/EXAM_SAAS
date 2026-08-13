import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { PageLoader } from "@/shared/components/loading/LoadingComponents";
import { Shield, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { useGetAuthPolicies, useUpdateAuthPolicies, useResetAuthPolicies } from '../hooks/security.hooks';
import type { IAuthPolicy } from '../types/security.types';

export const AuthPoliciesPage = () => {
  const { data: policiesData, isLoading } = useGetAuthPolicies();
  const updateMutation = useUpdateAuthPolicies();
  const resetMutation = useResetAuthPolicies();

  const [formData, setFormData] = useState<Partial<IAuthPolicy> | null>(null);
  const [originalData, setOriginalData] = useState<Partial<IAuthPolicy> | null>(null);
  const [prevData, setPrevData] = useState<Partial<IAuthPolicy> | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sync state during render instead of using an Effect to avoid cascading renders.
  // This is the React-recommended way to adjust state based on prop/query changes.
  if (policiesData?.data && policiesData.data !== prevData) {
    setPrevData(policiesData.data);
    setFormData(policiesData.data);
    setOriginalData(policiesData.data);
  }

  if (isLoading || !formData || !originalData) {
    return <PageLoader />;
  }

  const handleNestedChange = (section: keyof IAuthPolicy, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const computeChanges = () => {
    const changes: any[] = [];
    const sections: (keyof IAuthPolicy)[] = [
      'passwordPolicy', 'accountLockout', 'loginPolicy', 
      'tokenPolicy', 'examSecurity', 'authenticationSettings', 'passwordReset'
    ];

    sections.forEach(section => {
      const originalSection = (originalData as any)[section] || {};
      const currentSection = (formData as any)[section] || {};
      
      Object.keys(currentSection).forEach(key => {
        if (originalSection[key] !== currentSection[key]) {
          changes.push({
            section,
            field: key,
            old: originalSection[key],
            new: currentSection[key]
          });
        }
      });
    });

    return changes;
  };

  const handleSave = () => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsPreviewOpen(false);
      }
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all policies to system defaults? This cannot be undone.")) {
      resetMutation.mutate();
    }
  };

  const changedFields = computeChanges();
  const hasChanges = changedFields.length > 0;

  const renderNumberInput = (section: keyof IAuthPolicy, field: string, label: string, min = 0) => (
    <div className="grid gap-2">
      <Label htmlFor={`${section}-${field}`}>{label}</Label>
      <Input 
        id={`${section}-${field}`} 
        type="number" 
        min={min}
        value={(formData as any)[section]?.[field] ?? ''}
        onChange={(e) => handleNestedChange(section, field, parseInt(e.target.value))}
      />
    </div>
  );

  const renderSwitch = (section: keyof IAuthPolicy, field: string, label: string, description?: string) => (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">{label}</Label>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      <Switch 
        checked={!!(formData as any)[section]?.[field]}
        onCheckedChange={(checked) => handleNestedChange(section, field, checked)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Authentication Policies</h1>
          <p className="text-muted-foreground">Manage global security policies for user authentication.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleReset} disabled={resetMutation.isPending}>
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button className="gap-2" disabled={!hasChanges || updateMutation.isPending} onClick={() => setIsPreviewOpen(true)}>
            <Save className="w-4 h-4" />
            Save Policies
          </Button>
        </div>
      </div>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="lockout">Account Lockout</TabsTrigger>
          <TabsTrigger value="login">Login Policy</TabsTrigger>
          <TabsTrigger value="token">Token</TabsTrigger>
          <TabsTrigger value="exam">Exam Security</TabsTrigger>
          <TabsTrigger value="settings">Auth Settings</TabsTrigger>
          <TabsTrigger value="reset">Password Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Configure rules for strong passwords.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('passwordPolicy', 'minLength', 'Minimum Length', 1)}
                {renderNumberInput('passwordPolicy', 'maxLength', 'Maximum Length', 8)}
                {renderNumberInput('passwordPolicy', 'passwordExpiryDays', 'Expiry Days')}
                {renderNumberInput('passwordPolicy', 'minimumPasswordAgeDays', 'Min Age Days')}
                {renderNumberInput('passwordPolicy', 'passwordHistoryCount', 'History Count')}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('passwordPolicy', 'requireUppercase', 'Require Uppercase', 'Password must contain at least one uppercase letter.')}
                {renderSwitch('passwordPolicy', 'requireLowercase', 'Require Lowercase', 'Password must contain at least one lowercase letter.')}
                {renderSwitch('passwordPolicy', 'requireNumbers', 'Require Numbers', 'Password must contain at least one numeric character.')}
                {renderSwitch('passwordPolicy', 'requireSpecialCharacters', 'Require Special Characters', 'Password must contain at least one special character.')}
                {renderSwitch('passwordPolicy', 'preventUsernameInPassword', 'Prevent Username', 'Do not allow the username to be part of the password.')}
                {renderSwitch('passwordPolicy', 'preventCommonPasswords', 'Prevent Common Passwords', 'Check against a list of commonly used passwords.')}
                {renderSwitch('passwordPolicy', 'preventSequentialPasswords', 'Prevent Sequential Characters', 'Disallow sequences like "123" or "abc".')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lockout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Lockout</CardTitle>
              <CardDescription>Protect against brute-force attacks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('accountLockout', 'failedLoginAttempts', 'Failed Attempts')}
                {renderNumberInput('accountLockout', 'lockoutDurationMinutes', 'Lockout Duration (Mins)')}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('accountLockout', 'permanentLockOption', 'Permanent Lock Option', 'Allow manual permanent locking of suspicious accounts.')}
                {renderSwitch('accountLockout', 'autoUnlock', 'Auto Unlock', 'Automatically unlock accounts after the duration expires.')}
                {renderSwitch('accountLockout', 'manualUnlock', 'Manual Unlock', 'Allow administrators to manually unlock accounts.')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Login Policy</CardTitle>
              <CardDescription>Manage active sessions and concurrency.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('loginPolicy', 'maxConcurrentSessions', 'Max Concurrent Sessions', 1)}
                {renderNumberInput('loginPolicy', 'sessionTimeoutMinutes', 'Session Timeout (Mins)')}
                {renderNumberInput('loginPolicy', 'idleTimeoutMinutes', 'Idle Timeout (Mins)')}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('loginPolicy', 'allowMultipleDevices', 'Allow Multiple Devices', 'Users can log in from mobile and desktop simultaneously.')}
                {renderSwitch('loginPolicy', 'allowMultipleBrowsers', 'Allow Multiple Browsers', 'Users can log in from different browsers on the same device.')}
                {renderSwitch('loginPolicy', 'forceLogoutAfterPasswordChange', 'Force Logout on Password Change', 'Terminate all sessions when a user changes their password.')}
                {renderSwitch('loginPolicy', 'rememberDevice', 'Remember Device', 'Allow users to save devices as trusted.')}
                {renderSwitch('loginPolicy', 'rememberBrowser', 'Remember Browser', 'Allow users to stay logged in across browser restarts.')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="token" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Policy</CardTitle>
              <CardDescription>Manage JWTs and refresh tokens.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('tokenPolicy', 'jwtExpiryMinutes', 'JWT Expiry (Mins)', 1)}
                {renderNumberInput('tokenPolicy', 'refreshTokenExpiryDays', 'Refresh Token Expiry (Days)', 1)}
                {renderNumberInput('tokenPolicy', 'maxActiveRefreshTokens', 'Max Active Refresh Tokens', 1)}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('tokenPolicy', 'refreshTokenRotation', 'Refresh Token Rotation', 'Issue a new refresh token whenever one is used.')}
                {renderSwitch('tokenPolicy', 'forceTokenRevocation', 'Force Token Revocation', 'Maintain a blacklist of revoked tokens.')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exam" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Security Policy</CardTitle>
              <CardDescription>Login behavior specifically during examinations.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('examSecurity', 'loginCutoffBeforeExamMinutes', 'Login Cutoff Before Exam (Mins)')}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('examSecurity', 'allowLoginBeforeExam', 'Allow Login Before Exam', 'Candidates can log in before their scheduled slot.')}
                {renderSwitch('examSecurity', 'autoLogoutAfterExam', 'Auto Logout After Exam', 'Force logout immediately upon exam submission.')}
                {renderSwitch('examSecurity', 'restrictLoginDuringExam', 'Restrict Login During Exam', 'Prevent new sessions from starting during an active exam window.')}
                {renderSwitch('examSecurity', 'singleActiveExamSession', 'Single Active Exam Session', 'Only one session can take the exam, instantly revoking others.')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure allowed login methods.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch('authenticationSettings', 'emailLogin', 'Email Login', 'Allow users to log in using their email address.')}
                {renderSwitch('authenticationSettings', 'employeeIdLogin', 'Employee ID Login', 'Allow staff to log in using their Employee ID.')}
                {renderSwitch('authenticationSettings', 'usernameLogin', 'Username Login', 'Allow login using a custom username.')}
                {renderSwitch('authenticationSettings', 'mobileLogin', 'Mobile Login', 'Allow login using a registered phone number.')}
                {renderSwitch('authenticationSettings', 'caseSensitiveUsername', 'Case Sensitive Username', 'Enforce case sensitivity on usernames.')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Reset Policy</CardTitle>
              <CardDescription>Configure rules for self-service password recovery.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberInput('passwordReset', 'otpExpiryMinutes', 'OTP Expiry (Mins)', 1)}
                {renderNumberInput('passwordReset', 'resetLinkExpiryHours', 'Reset Link Expiry (Hours)', 1)}
                {renderNumberInput('passwordReset', 'maxResetRequestsPerDay', 'Max Reset Requests / Day', 1)}
                {renderNumberInput('passwordReset', 'cooldownPeriodMinutes', 'Cooldown Period (Mins)', 1)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Policy Changes</DialogTitle>
            <DialogDescription>
              Please review the following changes before applying them to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {changedFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">No changes detected.</p>
            ) : (
              <div className="space-y-4">
                {changedFields.map((change, idx) => (
                  <div key={idx} className="flex flex-col space-y-1 bg-muted p-3 rounded-md">
                    <span className="text-sm font-semibold text-foreground">
                      {change.section} &rarr; {change.field}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-destructive">
                        <span className="font-medium">Old:</span> {String(change.old)}
                      </div>
                      <div className="text-green-600">
                        <span className="font-medium">New:</span> {String(change.new)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 text-amber-900 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">These changes will be audited and may affect active user sessions.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Applying..." : "Apply Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
