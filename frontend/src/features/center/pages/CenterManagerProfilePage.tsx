import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Building2, FileText, CheckCircle2, Clock, Loader2, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { centerApi } from '@/features/company/center/api/center.api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import toast from 'react-hot-toast';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

export const CenterManagerProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [centerData, setCenterData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const centerId = user?.centerId || user?.referenceId;
      if (!centerId) {
        setIsLoading(false);
        return;
      }

      try {
        const [centerRes, onboardingRes] = await Promise.all([
          centerApi.getById(centerId).catch(() => null),
          centerApi.getOnboardingStatus(centerId).catch(() => null)
        ]);

        if (centerRes?.data) {
          setCenterData(centerRes.data);
        }

        const onboardingData = (onboardingRes?.data || onboardingRes) as any;
        if (onboardingData?.documents) {
          setDocuments(onboardingData.documents);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast.error('Failed to load profile details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!centerData) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-foreground">Profile Not Found</h2>
        <p className="text-slate-500 mt-2">Could not load center manager profile details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mt-1 shrink-0 text-[#2D3E2C] dark:text-slate-200 border-[#2D3E2C]/20 dark:border-slate-700 hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] dark:hover:border-[#E4FD97] transition-colors bg-white/50 dark:bg-slate-900/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Center Manager Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            View the details provided by the company admin and the documents you have uploaded.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details Card */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Center Details
            </CardTitle>
            <CardDescription>Information registered by the Company Admin</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Center Name</p>
                  <p className="text-muted-foreground">{centerData.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Manager Name</p>
                  <p className="text-muted-foreground">{centerData.managerName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Address</p>
                  <p className="text-muted-foreground">{centerData.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Mobile Number</p>
                  <p className="text-muted-foreground">{centerData.mobile || centerData.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-muted-foreground">
                    {[centerData.address, centerData.city, centerData.state, centerData.zipCode].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              {centerData.status && (
                <div className="flex items-start gap-3 mt-2">
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-[#2D3E2C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Account Status</p>
                    <Badge variant={centerData.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                      {centerData.status}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Uploaded Documents
            </CardTitle>
            <CardDescription>Documents provided during onboarding</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-foreground font-medium">No documents found</p>
                <p className="text-sm text-muted-foreground">You haven&apos;t uploaded any documents yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc, idx) => {
                  const docName = doc.documentType || doc.type || doc.name || doc.originalName || 'Document';
                  const docUrl = doc.fileUrl || doc.url;
                  
                  return (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 p-2 rounded-md shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="truncate">
                        <a href={docUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground hover:text-primary hover:underline truncate cursor-pointer transition-colors block">
                          {docName}
                        </a>
                        {doc.status && (
                          <Badge variant="outline" className="text-xs mt-1 capitalize font-semibold tracking-wide">
                            {doc.status.toLowerCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {docUrl && (
                      <Button variant="outline" size="sm" asChild className="shrink-0 text-[#2D3E2C] dark:text-slate-200 border-[#2D3E2C]/20 dark:border-slate-700 hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] dark:hover:border-[#E4FD97] transition-all duration-300 opacity-80 group-hover:opacity-100 font-bold">
                        <a href={docUrl} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                          Preview
                        </a>
                      </Button>
                    )}
                  </div>
                )})}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CenterManagerProfilePage;
