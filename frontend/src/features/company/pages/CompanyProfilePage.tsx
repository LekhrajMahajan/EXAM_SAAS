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
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
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
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Building2 className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-white">
              <div>
                <p className="text-sm text-slate-500 mb-1">Company Name</p>
                <p className="font-medium text-slate-900">{company.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Organization Type</p>
                <p className="font-medium text-slate-900">{company.companyType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Subscription Plan</p>
                <p className="font-medium text-slate-900">{company.subscriptionPlan}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Briefcase className="h-5 w-5 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-white">
              <div>
                <p className="text-sm text-slate-500 mb-1">Contact Person</p>
                <p className="font-medium text-slate-900">{company.ownerName}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <p className="font-medium text-slate-900">{company.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <p className="font-medium text-slate-900">{company.phone}</p>
              </div>
              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-[#2D3E2C] hover:text-secondary transition-colors">
                    {company.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 md:col-span-2">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <MapPin className="h-5 w-5 text-primary" />
                Address Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
              <div>
                <p className="text-sm text-slate-500 mb-1">Address Line 1</p>
                <p className="font-medium text-slate-900">{company.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">City</p>
                  <p className="font-medium text-slate-900">{company.city}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">State</p>
                  <p className="font-medium text-slate-900">{company.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Pincode</p>
                  <p className="font-medium text-slate-900">{company.pincode}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Country</p>
                  <p className="font-medium text-slate-900">{company.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {documents.length > 0 && (
            <Card className="shadow-sm border-slate-200 md:col-span-2">
              <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-primary" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {documents.map((doc, idx) => (
                    <a 
                      key={idx} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="font-medium text-sm text-slate-700 group-hover:text-slate-900">{doc.label}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
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
