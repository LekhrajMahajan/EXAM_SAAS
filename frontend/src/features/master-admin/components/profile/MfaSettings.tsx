import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ShieldAlert, ShieldCheck, Smartphone, Key, Fingerprint } from "lucide-react";

export const MfaSettings: React.FC = () => {
  // In a real implementation, this would fetch from an MFA status endpoint
  const mfaEnabled = false;

  return (
    <Card className="border-0 shadow-sm max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </div>
          <Badge variant={mfaEnabled ? "default" : "outline"} className={mfaEnabled ? "bg-emerald-500" : "text-muted-foreground"}>
            {mfaEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-xl border flex items-start gap-4 ${mfaEnabled ? 'bg-emerald-50/50 border-emerald-100' : 'bg-muted/50 border-border'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mfaEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-background border shadow-sm text-muted-foreground'}`}>
            {mfaEnabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">
              {mfaEnabled ? "Your account is protected with MFA" : "MFA is not configured for your account"}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {mfaEnabled 
                ? "You will be prompted for a verification code when signing in from an untrusted device."
                : "Multi-factor authentication (MFA) enhances your account's security by requiring a second step of verification."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer">
            <Smartphone className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-medium mb-1">Authenticator App</h4>
            <p className="text-sm text-muted-foreground mb-4">Use an app like Google Authenticator to get verification codes.</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </div>
          <div className="border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer opacity-70">
            <Key className="w-6 h-6 text-muted-foreground mb-3" />
            <h4 className="font-medium mb-1">Security Key</h4>
            <p className="text-sm text-muted-foreground mb-4">Use a hardware security key via USB, NFC, or Bluetooth.</p>
            <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 border-t rounded-b-xl flex justify-between items-center py-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Recovery Codes:</span> Not generated
        </div>
        <Button variant="secondary" size="sm" disabled>Generate Codes</Button>
      </CardFooter>
    </Card>
  );
};
