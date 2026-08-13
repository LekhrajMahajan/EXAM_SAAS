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
import { useConfirm } from "@/providers/ConfirmProvider";
import { Loader2, Building, Scale, MapPin, Contact, Palette, Globe, Share2, Trash2, Save } from "lucide-react";
import {
  useOrganizationSettings,
  useUpdateOrganizationSettings,
  useUploadOrganizationLogo,
  useDeleteOrganizationLogo,
} from "../../hooks/system-settings.hooks";

export const OrganizationSettingsPage = () => {
  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: settingsData, isLoading: isLoadingSettings } = useOrganizationSettings();
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateOrganizationSettings();
  const { mutateAsync: uploadLogo } = useUploadOrganizationLogo();
  const { mutateAsync: deleteLogo } = useDeleteOrganizationLogo();

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
      toast({ title: "Success", description: "Organization settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update organization settings.", variant: "destructive" });
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

  const handleFileUpload = async (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "File size exceeds 2MB.", variant: "destructive" });
      return;
    }

    try {
      const res = await uploadLogo({ key, file });
      handleChange(key, res.data.url);
      toast({ title: "Success", description: "Logo uploaded successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload logo.", variant: "destructive" });
    }
  };

  const handleDeleteLogo = async (key: string) => {
    if (await confirm("Are you sure you want to remove this logo?")) {
      try {
        await deleteLogo(key);
        handleChange(key, "");
        toast({ title: "Success", description: "Logo removed successfully." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to remove logo.", variant: "destructive" });
      }
    }
  };

  const cardStyle = "border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card text-card-foreground";

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderLogoUpload = (key: string, label: string) => (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {formData[key] ? (
          <div className="relative w-24 h-24 border rounded overflow-hidden group">
            <img src={formData[key]} alt={label} className="w-full h-full object-contain bg-muted/50" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteLogo(key)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 border border-dashed border-border rounded bg-muted/50 flex items-center justify-center text-muted-foreground text-xs text-center p-2">
            No Image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Input 
            type="file" 
            accept="image/png, image/jpeg, image/svg+xml"
            onChange={(e) => handleFileUpload(key, e)}
            className="w-full max-w-xs"
          />
          <span className="text-xs text-slate-500">Max 2MB (PNG, JPG, SVG)</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage global organization profile, branding, and legal information.
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted border border-border shadow-sm p-1 gap-1 h-auto flex-wrap">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Building className="w-4 h-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Scale className="w-4 h-4 mr-2" />Legal</TabsTrigger>
          <TabsTrigger value="address" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><MapPin className="w-4 h-4 mr-2" />Address</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Contact className="w-4 h-4 mr-2" />Contact</TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Palette className="w-4 h-4 mr-2" />Branding</TabsTrigger>
          <TabsTrigger value="localization" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Globe className="w-4 h-4 mr-2" />Localization</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md py-2 px-4"><Share2 className="w-4 h-4 mr-2" />Social</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input value={formData.ORG_NAME || ""} onChange={(e) => handleChange("ORG_NAME", e.target.value)} onBlur={() => handleBlur("ORG_NAME", "Organization Name")} />
              </div>
              <div className="space-y-2">
                <Label>Short Name</Label>
                <Input value={formData.ORG_SHORT_NAME || ""} onChange={(e) => handleChange("ORG_SHORT_NAME", e.target.value)} onBlur={() => handleBlur("ORG_SHORT_NAME", "Short Name")} />
              </div>
              <div className="space-y-2">
                <Label>Organization Code</Label>
                <Input value={formData.ORG_CODE || ""} onChange={(e) => handleChange("ORG_CODE", e.target.value)} onBlur={() => handleBlur("ORG_CODE", "Organization Code")} />
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
              <div className="space-y-2 lg:col-span-2">
                <Label>Description</Label>
                <Input value={formData.ORG_DESCRIPTION || ""} onChange={(e) => handleChange("ORG_DESCRIPTION", e.target.value)} onBlur={() => handleBlur("ORG_DESCRIPTION", "Description")} />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input type="url" value={formData.ORG_WEBSITE || ""} onChange={(e) => handleChange("ORG_WEBSITE", e.target.value)} onBlur={() => handleBlur("ORG_WEBSITE", "Website")} />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={formData.ORG_SUPPORT_EMAIL || ""} onChange={(e) => handleChange("ORG_SUPPORT_EMAIL", e.target.value)} onBlur={() => handleBlur("ORG_SUPPORT_EMAIL", "Support Email")} />
              </div>
              <div className="space-y-2">
                <Label>Support Phone</Label>
                <Input type="tel" value={formData.ORG_SUPPORT_PHONE || ""} onChange={(e) => handleChange("ORG_SUPPORT_PHONE", e.target.value)} onBlur={() => handleBlur("ORG_SUPPORT_PHONE", "Support Phone")} />
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
                <Input value={formData.ORG_GST_NUMBER || ""} onChange={(e) => handleChange("ORG_GST_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_GST_NUMBER", "GST Number")} />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input value={formData.ORG_PAN_NUMBER || ""} onChange={(e) => handleChange("ORG_PAN_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_PAN_NUMBER", "PAN Number")} />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input value={formData.ORG_REGISTRATION_NUMBER || ""} onChange={(e) => handleChange("ORG_REGISTRATION_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_REGISTRATION_NUMBER", "Registration Number")} />
              </div>
              <div className="space-y-2">
                <Label>Tax Identification Number</Label>
                <Input value={formData.ORG_TAX_ID || ""} onChange={(e) => handleChange("ORG_TAX_ID", e.target.value)} onBlur={() => handleBlur("ORG_TAX_ID", "Tax ID")} />
              </div>
              <div className="space-y-2">
                <Label>Business License Number</Label>
                <Input value={formData.ORG_LICENSE_NUMBER || ""} onChange={(e) => handleChange("ORG_LICENSE_NUMBER", e.target.value)} onBlur={() => handleBlur("ORG_LICENSE_NUMBER", "Business License")} />
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
                <Input value={formData.ORG_ADDRESS_1 || ""} onChange={(e) => handleChange("ORG_ADDRESS_1", e.target.value)} onBlur={() => handleBlur("ORG_ADDRESS_1", "Address Line 1")} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label>Address Line 2</Label>
                <Input value={formData.ORG_ADDRESS_2 || ""} onChange={(e) => handleChange("ORG_ADDRESS_2", e.target.value)} onBlur={() => handleBlur("ORG_ADDRESS_2", "Address Line 2")} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.ORG_CITY || ""} onChange={(e) => handleChange("ORG_CITY", e.target.value)} onBlur={() => handleBlur("ORG_CITY", "City")} />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={formData.ORG_DISTRICT || ""} onChange={(e) => handleChange("ORG_DISTRICT", e.target.value)} onBlur={() => handleBlur("ORG_DISTRICT", "District")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={formData.ORG_STATE || ""} onChange={(e) => handleChange("ORG_STATE", e.target.value)} onBlur={() => handleBlur("ORG_STATE", "State")} />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={formData.ORG_COUNTRY || ""} onChange={(e) => handleChange("ORG_COUNTRY", e.target.value)} onBlur={() => handleBlur("ORG_COUNTRY", "Country")} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={formData.ORG_POSTAL_CODE || ""} onChange={(e) => handleChange("ORG_POSTAL_CODE", e.target.value)} onBlur={() => handleBlur("ORG_POSTAL_CODE", "Postal Code")} />
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
                <Input value={formData.ORG_CONTACT_PERSON || ""} onChange={(e) => handleChange("ORG_CONTACT_PERSON", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_PERSON", "Contact Person")} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={formData.ORG_CONTACT_DESIGNATION || ""} onChange={(e) => handleChange("ORG_CONTACT_DESIGNATION", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_DESIGNATION", "Designation")} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.ORG_CONTACT_EMAIL || ""} onChange={(e) => handleChange("ORG_CONTACT_EMAIL", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_EMAIL", "Email")} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" value={formData.ORG_CONTACT_PHONE || ""} onChange={(e) => handleChange("ORG_CONTACT_PHONE", e.target.value)} onBlur={() => handleBlur("ORG_CONTACT_PHONE", "Phone")} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input type="tel" value={formData.ORG_EMERGENCY_CONTACT || ""} onChange={(e) => handleChange("ORG_EMERGENCY_CONTACT", e.target.value)} onBlur={() => handleBlur("ORG_EMERGENCY_CONTACT", "Emergency Contact")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Branding Assets</CardTitle>
              <CardDescription>Upload logos to be used throughout the platform.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 pt-0">
              {renderLogoUpload("LOGO_PRIMARY", "Primary Organization Logo")}
              {renderLogoUpload("LOGO_FAVICON", "Favicon")}
              {renderLogoUpload("LOGO_DARK", "Dark Mode Logo")}
              {renderLogoUpload("LOGO_LIGHT", "Light Mode Logo")}
              {renderLogoUpload("LOGO_LOGIN", "Login Screen Logo")}
              {renderLogoUpload("LOGO_PDF", "PDF Export Logo")}
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
                <Input type="url" value={formData.SOCIAL_FACEBOOK || ""} onChange={(e) => handleChange("SOCIAL_FACEBOOK", e.target.value)} onBlur={() => handleBlur("SOCIAL_FACEBOOK", "Facebook")} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input type="url" value={formData.SOCIAL_LINKEDIN || ""} onChange={(e) => handleChange("SOCIAL_LINKEDIN", e.target.value)} onBlur={() => handleBlur("SOCIAL_LINKEDIN", "LinkedIn")} />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X URL</Label>
                <Input type="url" value={formData.SOCIAL_TWITTER || ""} onChange={(e) => handleChange("SOCIAL_TWITTER", e.target.value)} onBlur={() => handleBlur("SOCIAL_TWITTER", "Twitter")} />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input type="url" value={formData.SOCIAL_INSTAGRAM || ""} onChange={(e) => handleChange("SOCIAL_INSTAGRAM", e.target.value)} onBlur={() => handleBlur("SOCIAL_INSTAGRAM", "Instagram")} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input type="url" value={formData.SOCIAL_YOUTUBE || ""} onChange={(e) => handleChange("SOCIAL_YOUTUBE", e.target.value)} onBlur={() => handleBlur("SOCIAL_YOUTUBE", "YouTube")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
