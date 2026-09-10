import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { useAuth } from "@/features/auth/hooks";
import { useCompany } from "@/features/master-admin/hooks/company.hooks";
import { Loader2, Building2, MapPin, Phone, Mail, Globe, Briefcase, FileText, ExternalLink } from "lucide-react";

export const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { data: response, isLoading } = useCompany(user?.companyId as string);
  const company = response?.data;

  const documents = company ? [
    { label: "Registration Document", url: company.registrationDocument },
    { label: "MOU Document", url: company.mouDocument },
    { label: "PAN Card", url: company.panCardDocument },
    { label: "GST Document", url: company.gstDocument },
    { label: "Aadhar Card", url: company.aadharCardDocument },
    { label: "MSME Certificate", url: company.msmeCertificateDocument },
  ].filter(doc => doc.url) : [];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <DashboardHeader 
        title="Company Profile" 
        description="View your company's registration details and profile information." 
        showBack={true}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !company ? (
        <Card>
          <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
            Profile data not found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company Name</p>
                <p className="font-medium text-foreground">{company.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Organization Type</p>
                <p className="font-medium text-foreground">{company.companyType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subscription Plan</p>
                <p className="font-medium text-foreground">{company.subscriptionPlan}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                <p className="font-medium text-foreground">{company.ownerName}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-foreground">{company.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-foreground">{company.phone}</p>
              </div>
              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
                    {company.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm md:col-span-2">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sm:col-span-2 lg:col-span-4">
                <p className="text-sm text-muted-foreground mb-1">Address Line 1</p>
                <p className="font-medium text-foreground">{company.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">City</p>
                <p className="font-medium text-foreground">{company.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">State</p>
                <p className="font-medium text-foreground">{company.state}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pincode</p>
                <p className="font-medium text-foreground">{company.pincode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Country</p>
                <p className="font-medium text-foreground">{company.country}</p>
              </div>
            </CardContent>
          </Card>

          {documents.length > 0 && (
            <Card className="shadow-sm md:col-span-2">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {documents.map((doc, idx) => (
                    <a 
                      key={idx} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="font-medium text-sm text-foreground">{doc.label}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
