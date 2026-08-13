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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Mail, MessageSquare, Send, Server, Key, Lock, CheckCircle2 } from "lucide-react";
import { 
  useSmtpSettings, 
  useUpdateSmtpSettings, 
  useTestEmailGateway, 
  useSmsSettings, 
  useUpdateSmsSettings, 
  useTestSmsGateway 
} from "../../hooks/system-settings.hooks";

export const EmailSmsGatewayPage = () => {
  const { toast } = useToast();
  
  // Queries
  const { data: smtpData, isLoading: isLoadingSmtp } = useSmtpSettings();
  const { data: smsData, isLoading: isLoadingSms } = useSmsSettings();

  // Mutations
  const { mutateAsync: updateSmtp, isPending: isUpdatingSmtp } = useUpdateSmtpSettings();
  const { mutateAsync: testEmail, isPending: isTestingEmail } = useTestEmailGateway();
  const { mutateAsync: updateSms, isPending: isUpdatingSms } = useUpdateSmsSettings();
  const { mutateAsync: testSms, isPending: isTestingSms } = useTestSmsGateway();

  // Local State
  const [smtpForm, setSmtpForm] = useState<Record<string, any>>({});
  const [smsForm, setSmsForm] = useState<Record<string, any>>({});
  
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testPhoneNumber, setTestPhoneNumber] = useState("");

  const [prevSmtpData, setPrevSmtpData] = useState<any>(null);
  const [prevSmsData, setPrevSmsData] = useState<any>(null);

  // Sync state
  if (smtpData !== prevSmtpData) {
    setPrevSmtpData(smtpData);
    if (smtpData?.data) {
      const initial: Record<string, any> = {};
      smtpData.data.forEach((s: any) => initial[s.key] = s.value);
      setSmtpForm(initial);
    }
  }

  if (smsData !== prevSmsData) {
    setPrevSmsData(smsData);
    if (smsData?.data) {
      const initial: Record<string, any> = {};
      smsData.data.forEach((s: any) => initial[s.key] = s.value);
      setSmsForm(initial);
    }
  }

  const handleSmtpChange = (key: string, value: string) => setSmtpForm(prev => ({ ...prev, [key]: value }));
  const handleSmsChange = (key: string, value: string) => setSmsForm(prev => ({ ...prev, [key]: value }));

  const handleSaveSmtp = async () => {
    try {
      await updateSmtp(smtpForm);
      toast({ title: "Success", description: "SMTP Settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update SMTP settings.", variant: "destructive" });
    }
  };

  const handleTestSmtp = async () => {
    if (!testEmailAddress) {
      return toast({ title: "Validation Error", description: "Please enter a test email address.", variant: "destructive" });
    }
    try {
      await testEmail({ to: testEmailAddress });
      toast({ title: "Success", description: "Test email sent successfully! Please check your inbox." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to send test email.", variant: "destructive" });
    }
  };

  const handleSaveSms = async () => {
    try {
      await updateSms(smsForm);
      toast({ title: "Success", description: "SMS Gateway settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update SMS settings.", variant: "destructive" });
    }
  };

  const handleTestSms = async () => {
    if (!testPhoneNumber) {
      return toast({ title: "Validation Error", description: "Please enter a test phone number.", variant: "destructive" });
    }
    try {
      await testSms({ phone: testPhoneNumber });
      toast({ title: "Success", description: "Test SMS sent successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to send test SMS.", variant: "destructive" });
    }
  };

  const isLoading = isLoadingSmtp || isLoadingSms;

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Email & SMS Gateways</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure external providers for delivering emails and SMS notifications.
          </p>
        </div>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="bg-muted border border-border shadow-sm p-1 gap-1 h-auto flex-wrap">
          <TabsTrigger value="smtp" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-6">
            <Mail className="w-4 h-4 mr-2" /> Email (SMTP)
          </TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-6">
            <MessageSquare className="w-4 h-4 mr-2" /> SMS Gateway
          </TabsTrigger>
        </TabsList>

        {/* ==============================================================
            SMTP TAB
        ============================================================== */}
        <TabsContent value="smtp" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><Server className="w-5 h-5 mr-2 text-primary" /> SMTP Configuration</CardTitle>
                  <CardDescription>Configure the underlying SMTP server details for dispatching emails.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input 
                        placeholder="e.g. smtp.gmail.com" 
                        value={smtpForm["SMTP_HOST"] || ""} 
                        onChange={(e) => handleSmtpChange("SMTP_HOST", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input 
                        type="number"
                        placeholder="e.g. 587 or 465" 
                        value={smtpForm["SMTP_PORT"] || ""} 
                        onChange={(e) => handleSmtpChange("SMTP_PORT", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Username</Label>
                      <Input 
                        placeholder="e.g. user@domain.com" 
                        value={smtpForm["SMTP_USER"] || ""} 
                        onChange={(e) => handleSmtpChange("SMTP_USER", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Password</Label>
                      <Input 
                        type="password"
                        placeholder="********" 
                        value={smtpForm["SMTP_PASSWORD"] || ""} 
                        onChange={(e) => handleSmtpChange("SMTP_PASSWORD", e.target.value)} 
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-emerald-600 flex items-center">
                        <Lock className="w-3 h-3 mr-1" /> Encrypted at rest
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={handleSaveSmtp} 
                      disabled={isUpdatingSmtp} 
                      className="gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
                    >
                      {isUpdatingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save SMTP Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm border border-border bg-muted/50 text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-primary" /> Test Connection</CardTitle>
                  <CardDescription>Send a test email to verify your SMTP settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Email Address</Label>
                    <Input 
                      placeholder="test@example.com"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleTestSmtp} 
                    disabled={isTestingEmail || isUpdatingSmtp || !testEmailAddress} 
                    className="w-full gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
                  >
                    {isTestingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Test Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==============================================================
            SMS TAB
        ============================================================== */}
        <TabsContent value="sms" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><Key className="w-5 h-5 mr-2 text-primary" /> Gateway Integration</CardTitle>
                  <CardDescription>Configure API credentials for your external SMS provider.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>SMS Provider</Label>
                      <Select 
                        value={smsForm["SMS_PROVIDER"] || ""} 
                        onValueChange={(val) => handleSmsChange("SMS_PROVIDER", val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MSG91">MSG91</SelectItem>
                          <SelectItem value="TWILIO">Twilio</SelectItem>
                          <SelectItem value="AWS_SNS">AWS SNS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>API Base URL</Label>
                      <Input 
                        placeholder="e.g. https://api.msg91.com/api/v5" 
                        value={smsForm["SMS_API_URL"] || ""} 
                        onChange={(e) => handleSmsChange("SMS_API_URL", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key (Auth Key)</Label>
                      <Input 
                        placeholder="Enter API Key" 
                        value={smsForm["SMS_API_KEY"] || ""} 
                        onChange={(e) => handleSmsChange("SMS_API_KEY", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Secret (If applicable)</Label>
                      <Input 
                        type="password"
                        placeholder="********" 
                        value={smsForm["SMS_API_SECRET"] || ""} 
                        onChange={(e) => handleSmsChange("SMS_API_SECRET", e.target.value)} 
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-emerald-600 flex items-center">
                        <Lock className="w-3 h-3 mr-1" /> Encrypted at rest
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={handleSaveSms} 
                      disabled={isUpdatingSms} 
                      className="gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
                    >
                      {isUpdatingSms ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save SMS Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm border border-border bg-muted/50 text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-primary" /> Test SMS</CardTitle>
                  <CardDescription>Send a test SMS to verify your gateway integration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Phone Number</Label>
                    <Input 
                      placeholder="+1234567890"
                      value={testPhoneNumber}
                      onChange={(e) => setTestPhoneNumber(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleTestSms} 
                    disabled={isTestingSms || isUpdatingSms || !testPhoneNumber} 
                    className="w-full gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
                  >
                    {isTestingSms ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Test SMS
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};
