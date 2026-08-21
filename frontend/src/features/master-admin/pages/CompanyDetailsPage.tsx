import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Globe, Phone, Mail, FileText, Hash, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { useCompany } from "../hooks/company.hooks";
import { useCompanyAggregatedStats, useCompanyActivityTimeline } from "../hooks/company-details.hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

const getValidDocumentUrl = (url: string) => {
  const cleanUrl = url.split('#')[0];
  if (cleanUrl.startsWith('blob:')) {
    return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  }
  return cleanUrl;
};

export const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: companyRes, isLoading: isLoadingCompany, isError: isCompanyError } = useCompany(id!);
  const { data: stats, isLoading: isLoadingStats } = useCompanyAggregatedStats(id!);
  const { data: activityRes, isLoading: isLoadingActivity } = useCompanyActivityTimeline(id!);

  if (isLoadingCompany) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isCompanyError || !companyRes?.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load company details.</AlertDescription>
      </Alert>
    );
  }

  const company = companyRes.data;

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/master-admin/companies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.companyName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Hash className="w-4 h-4" /> {company.companyCode}</span>
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {company.email}</span>
              {company.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {company.phone}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={company.status ? "bg-[#E4FD97] text-[#2D3E2C] border-[#2D3E2C]/20" : "bg-slate-50 text-slate-700 border-slate-200"}>
              {company.status ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className={
              company.subscriptionPlan === "ENTERPRISE" ? "bg-[#E4FD97] text-[#2D3E2C] border-[#2D3E2C]/20" : 
              company.subscriptionPlan === "PROFESSIONAL" ? "bg-blue-50 text-blue-700 border-blue-200" : 
              "border-slate-200 text-slate-700 bg-slate-50"
            }>
              {company.subscriptionPlan || "FREE"} Plan
            </Badge>
            <Button onClick={() => navigate(`/master-admin/companies/${company._id}/edit`)}>Edit Details</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Centers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalCenters || 0}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Exams</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalExams || 0}</div>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalCandidates || 0}</div>}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  Company Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{company.companyType || "Enterprise"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Legal Name</p>
                    <p className="font-medium">{company.legalName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Owner Name</p>
                    <p className="font-medium">{company.ownerName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Website</p>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Visit
                      </a>
                    ) : (
                      <p className="font-medium">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registration No.</p>
                    <p className="font-medium">{company.registrationNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">GST No.</p>
                    <p className="font-medium">{company.gstNumber || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Address</p>
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-medium">
                        {[company.address, company.city, company.state, company.country, company.pincode].filter(Boolean).join(", ") || "No address provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-6 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1.5">Current Plan</p>
                      <Badge variant="outline" className={
                        company.subscriptionPlan === "ENTERPRISE" ? "bg-[#E4FD97] text-[#2D3E2C] border-[#2D3E2C]/20" : 
                        company.subscriptionPlan === "PROFESSIONAL" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                        "bg-slate-100 text-slate-800"
                      }>
                        {company.subscriptionPlan || "FREE"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1.5">Joined Date</p>
                      <p className="font-medium text-slate-900">{new Date(company.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-border p-4 rounded-xl bg-card shadow-sm">
                      <span className="text-sm font-medium text-foreground">Registration Document</span>
                      {company.registrationDocument ? (
                        <a href={getValidDocumentUrl(company.registrationDocument)} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2D3E2C] dark:text-[#E4FD97] hover:opacity-80 hover:underline">View Document</a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border border-border p-4 rounded-xl bg-card shadow-sm">
                      <span className="text-sm font-medium text-foreground">PAN Card</span>
                      {company.panCardDocument ? (
                        <a href={getValidDocumentUrl(company.panCardDocument)} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2D3E2C] dark:text-[#E4FD97] hover:opacity-80 hover:underline">View Document</a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border border-border p-4 rounded-xl bg-card shadow-sm">
                      <span className="text-sm font-medium text-foreground">GST Document</span>
                      {company.gstDocument ? (
                        <a href={getValidDocumentUrl(company.gstDocument)} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2D3E2C] dark:text-[#E4FD97] hover:opacity-80 hover:underline">View Document</a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : activityRes?.data && activityRes.data.length > 0 ? (
                <div className="relative border-l-2 border-primary/20 ml-3 space-y-6">
                  {activityRes.data.map((log: any) => (
                    <div key={log._id} className="relative pl-6">
                      <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-primary shadow-sm" />
                      <div className="flex flex-col bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <span className="text-sm font-semibold text-slate-900 capitalize">
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                        {log.details && (
                          <span className="text-sm text-slate-700 mt-1">
                            {log.details}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground mt-2">
                          {new Date(log.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No activity found for this company.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
