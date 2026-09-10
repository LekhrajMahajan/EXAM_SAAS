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
import { Loader2, Settings, Server, Save, RefreshCw, Scale, MapPin, Contact, Globe, Share2, Lock } from "lucide-react";
import { PasswordManagement } from "../../components/profile/PasswordManagement";
import {
  useGeneralSettings,
  useUpdateGeneralSettings,
  useResetGeneralSettings,
  useOrganizationSettings,
} from "../../hooks/system-settings.hooks";

export const GeneralSettingsPage = () => {
  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: generalData, isLoading: isLoadingGeneral } = useGeneralSettings();
  const { data: orgData, isLoading: isLoadingOrg } = useOrganizationSettings();

  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateGeneralSettings();
  const { mutateAsync: resetSettings, isPending: isResetting } = useResetGeneralSettings();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [prevGeneralData, setPrevGeneralData] = useState<any>(null);
  const [prevOrgData, setPrevOrgData] = useState<any>(null);

  if (generalData !== prevGeneralData || orgData !== prevOrgData) {
    if (generalData !== prevGeneralData) setPrevGeneralData(generalData);
    if (orgData !== prevOrgData) setPrevOrgData(orgData);
    
    const initialData: Record<string, any> = { ...formData };
    
    if (generalData?.data) {
      generalData.data.forEach((setting: any) => {
        initialData[setting.key] = setting.value;
      });
    }
    
    if (orgData?.data) {
      orgData.data.forEach((setting: any) => {
        initialData[setting.key] = setting.value;
      });
    }
    
    setFormData(initialData);
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

  const isLoadingSettings = isLoadingGeneral || isLoadingOrg;

  if (isLoadingSettings) {
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
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
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
          <TabsTrigger value="change-password">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="w-4 h-4 mr-2" />
            System Options
          </TabsTrigger>

          <TabsTrigger value="legal"><Scale className="w-4 h-4 mr-2" />Legal</TabsTrigger>
          <TabsTrigger value="address"><MapPin className="w-4 h-4 mr-2" />Address</TabsTrigger>
          <TabsTrigger value="contact"><Contact className="w-4 h-4 mr-2" />Contact</TabsTrigger>
          <TabsTrigger value="localization"><Globe className="w-4 h-4 mr-2" />Localization</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="w-4 h-4 mr-2" />Social</TabsTrigger>
        </TabsList>

        <TabsContent value="change-password" className="space-y-4">
          <PasswordManagement />
        </TabsContent>

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
                <div className="space-y-2">
                  <Label>Organization Type</Label>
                  <Select value={formData.ORG_TYPE || "educational"} onValueChange={(v) => { handleChange("ORG_TYPE", v); updateSettings({ ORG_TYPE: v }); }}>
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educational">Educational Institution</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="government">Government Agency</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label className="text-base">Company Admin Registration</Label>
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


        <TabsContent value="legal" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input placeholder="e.g. 22AAAAA0000A1Z5" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Please enter a valid 15-character GST number" value={formData.ORG_GST_NUMBER || ""} onChange={(e) => handleChange("ORG_GST_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_GST_NUMBER", "GST Number")} />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input placeholder="e.g. ABCDE1234F" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" title="Please enter a valid 10-character PAN number" value={formData.ORG_PAN_NUMBER || ""} onChange={(e) => handleChange("ORG_PAN_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_PAN_NUMBER", "PAN Number")} />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input placeholder="e.g. U74999MH2023PTC123456" value={formData.ORG_REGISTRATION_NUMBER || ""} onChange={(e) => handleChange("ORG_REGISTRATION_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_REGISTRATION_NUMBER", "Registration Number")} />
              </div>
              <div className="space-y-2">
                <Label>Tax Identification Number</Label>
                <Input placeholder="e.g. 12-3456789" value={formData.ORG_TAX_ID || ""} onChange={(e) => handleChange("ORG_TAX_ID", e.target.value)} onBlur={() => handleBlur("ORG_TAX_ID", "Tax ID")} />
              </div>
              <div className="space-y-2">
                <Label>Business License Number</Label>
                <Input placeholder="e.g. BL-2023-98765" value={formData.ORG_LICENSE_NUMBER || ""} onChange={(e) => handleChange("ORG_LICENSE_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_LICENSE_NUMBER", "Business License")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2 lg:col-span-2">
                <Label>Address Line 1</Label>
                <Input placeholder="e.g. 123 Business Park, Block A" value={formData.ORG_ADDRESS_1 || ""} onChange={(e) => handleChange("ORG_ADDRESS_1", e.target.value)} onBlur={() => handleBlur("ORG_ADDRESS_1", "Address Line 1")} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label>Address Line 2</Label>
                <Input placeholder="e.g. Floor 4, Suite 402" value={formData.ORG_ADDRESS_2 || ""} onChange={(e) => handleChange("ORG_ADDRESS_2", e.target.value)} onBlur={() => handleBlur("ORG_ADDRESS_2", "Address Line 2")} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="e.g. Mumbai" value={formData.ORG_CITY || ""} onChange={(e) => handleChange("ORG_CITY", e.target.value)} onBlur={() => handleBlur("ORG_CITY", "City")} />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input placeholder="e.g. Mumbai Suburban" value={formData.ORG_DISTRICT || ""} onChange={(e) => handleChange("ORG_DISTRICT", e.target.value)} onBlur={() => handleBlur("ORG_DISTRICT", "District")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input placeholder="e.g. Maharashtra" value={formData.ORG_STATE || ""} onChange={(e) => handleChange("ORG_STATE", e.target.value)} onBlur={() => handleBlur("ORG_STATE", "State")} />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input placeholder="e.g. India" value={formData.ORG_COUNTRY || ""} onChange={(e) => handleChange("ORG_COUNTRY", e.target.value)} onBlur={() => handleBlur("ORG_COUNTRY", "Country")} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input placeholder="e.g. 400001" pattern="^[a-zA-Z0-9\s\-]{3,10}$" title="Please enter a valid postal code" value={formData.ORG_POSTAL_CODE || ""} onChange={(e) => handleChange("ORG_POSTAL_CODE", e.target.value)} onBlur={() => handleBlur("ORG_POSTAL_CODE", "Postal Code")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Primary Contact Person</Label>
                <Input placeholder="e.g. John Doe" value={formData.ORG_CONTACT_PERSON || ""} onChange={(e) => handleChange("ORG_CONTACT_PERSON", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_PERSON", "Contact Person")} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input placeholder="e.g. HR Manager" value={formData.ORG_CONTACT_DESIGNATION || ""} onChange={(e) => handleChange("ORG_CONTACT_DESIGNATION", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_DESIGNATION", "Designation")} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="e.g. contact@company.com" value={formData.ORG_CONTACT_EMAIL || ""} onChange={(e) => handleChange("ORG_CONTACT_EMAIL", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_EMAIL", "Email")} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" placeholder="e.g. +91 9876543210" pattern="^\+?[0-9\s\-\(\)]{7,15}$" title="Please enter a valid phone number" value={formData.ORG_CONTACT_PHONE || ""} onChange={(e) => handleChange("ORG_CONTACT_PHONE", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_PHONE", "Phone")} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input type="tel" placeholder="e.g. +91 9876543211" pattern="^\+?[0-9\s\-\(\)]{7,15}$" title="Please enter a valid phone number" value={formData.ORG_EMERGENCY_CONTACT || ""} onChange={(e) => handleChange("ORG_EMERGENCY_CONTACT", e.target.value)} onBlur={() => handleBlur("ORG_EMERGENCY_CONTACT", "Emergency Contact")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select value={formData.ORG_LANGUAGE || "en"} onValueChange={(v) => { handleChange("ORG_LANGUAGE", v); updateSettings({ ORG_LANGUAGE: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select value={formData.ORG_TIMEZONE || "Asia/Kolkata"} onValueChange={(v) => { handleChange("ORG_TIMEZONE", v); updateSettings({ ORG_TIMEZONE: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Timezone" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.ORG_CURRENCY || "INR"} onValueChange={(v) => { handleChange("ORG_CURRENCY", v); updateSettings({ ORG_CURRENCY: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select value={formData.ORG_DATE_FORMAT || "DD/MM/YYYY"} onValueChange={(v) => { handleChange("ORG_DATE_FORMAT", v); updateSettings({ ORG_DATE_FORMAT: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Date Format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select value={formData.ORG_TIME_FORMAT || "12h"} onValueChange={(v) => { handleChange("ORG_TIME_FORMAT", v); updateSettings({ ORG_TIME_FORMAT: v }); }}>
                  <SelectTrigger><SelectValue placeholder="Select Time Format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input type="url" placeholder="https://facebook.com/yourcompany" value={formData.SOCIAL_FACEBOOK || ""} onChange={(e) => handleChange("SOCIAL_FACEBOOK", e.target.value)} onBlur={() => handleBlur("SOCIAL_FACEBOOK", "Facebook")} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input type="url" placeholder="https://linkedin.com/company/yourcompany" value={formData.SOCIAL_LINKEDIN || ""} onChange={(e) => handleChange("SOCIAL_LINKEDIN", e.target.value)} onBlur={() => handleBlur("SOCIAL_LINKEDIN", "LinkedIn")} />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X URL</Label>
                <Input type="url" placeholder="https://twitter.com/yourcompany" value={formData.SOCIAL_TWITTER || ""} onChange={(e) => handleChange("SOCIAL_TWITTER", e.target.value)} onBlur={() => handleBlur("SOCIAL_TWITTER", "Twitter")} />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input type="url" placeholder="https://instagram.com/yourcompany" value={formData.SOCIAL_INSTAGRAM || ""} onChange={(e) => handleChange("SOCIAL_INSTAGRAM", e.target.value)} onBlur={() => handleBlur("SOCIAL_INSTAGRAM", "Instagram")} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input type="url" placeholder="https://youtube.com/c/yourcompany" value={formData.SOCIAL_YOUTUBE || ""} onChange={(e) => handleChange("SOCIAL_YOUTUBE", e.target.value)} onBlur={() => handleBlur("SOCIAL_YOUTUBE", "YouTube")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
