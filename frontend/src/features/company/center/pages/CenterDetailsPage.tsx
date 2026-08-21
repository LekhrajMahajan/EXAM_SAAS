import React, { useState, useEffect } from 'react';
import { CenterHeader } from "../components/CenterHeader";
import { CenterStatusBadge } from "../components/CenterStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, User, FileCheck, Eye, FileText, AlertCircle, CheckCircle2, XCircle, Building2, Clock, MonitorSmartphone, CheckSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../hooks/center.hooks";
import { Loader2 } from "lucide-react";
import { centerApi } from '@/features/company/center/api/center.api';

export const CenterDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useCenter(id || "");
  const center: any = data?.data || data;

  const [documents, setDocuments] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!id) return;
      try {
        // Documents are stored in CenterOnboarding, not in Center model.
        // getOnboardingStatus returns { documents: [...] } from the CenterOnboarding record.
        const res = await centerApi.getOnboardingStatus(id);
        const onboardingData = res?.data || res;
        setDocuments((onboardingData as any)?.documents || []);
      } catch {
        setDocuments([]);
      } finally {
        setDocsLoading(false);
      }
    };
    fetchDocs();
  }, [id]);

  if (isLoading || !center) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'REJECTED') return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'APPROVED') return <CheckCircle2 className="h-4 w-4" />;
    if (status === 'REJECTED') return <XCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header — edit button removed (available in center list actions) */}
      <div className="flex items-center gap-4">
        <Link to="/company/centers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CenterHeader
            title={center.centerName}
            description={`Code: ${center.centerCode} | Branch: ${center.branch || 'N/A'} | Type: ${center.centerType || 'Standard Center'}`}
            actions={
              <>
                <CenterStatusBadge status={center.status} />
              </>
            }
          />
        </div>
      </div>

      {/* Center Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Center Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Center Name</div>
              <div className="font-medium">{center.centerName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Center Type</div>
              <div className="font-medium">{center.centerType || center.centerCategory || 'Standard Center'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Center Code</div>
              <div className="font-medium">{center.centerCode}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Exam Center Code</div>
              <div className="font-medium">{center.examCenterCode || 'Not provided'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Address</div>
              <div className="font-medium">{center.address}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">City</div>
                <div className="font-medium">{center.city}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">State</div>
                <div className="font-medium">{center.state}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pincode</div>
                <div className="font-medium">{center.pincode || center.postalCode}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Country</div>
                <div className="font-medium">{center.country || 'India'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Google Map URL</div>
                <div className="font-medium text-primary">
                  {center.googleMapUrl || center?.profileExtension?.googleMapUrl ? (
                    <a href={center.googleMapUrl || center?.profileExtension?.googleMapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {center.googleMapUrl || center?.profileExtension?.googleMapUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Person
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Center Head / Manager Name</div>
              <div className="font-medium">{center.headName || center.managerName}</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Official Center Email</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{center.headEmail || center.email}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Primary Contact Number</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{center.headMobile || center.phone}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Alternate Number</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className={center.emergencyContact || center.alternatePhone ? "" : "text-muted-foreground"}>
                    {center.emergencyContact || center.alternatePhone || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Exam Shifts (Rates & Timings)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {center.shiftRates && center.shiftRates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {center.shiftRates.map((shift: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="font-semibold text-sm mb-1">{shift.name || shift.shiftName}</div>
                  <div className="text-xs text-muted-foreground mb-3">{shift.timings || shift.specialNotes?.replace('Slot timings: ', '') || 'N/A'}</div>
                  <div className="text-sm font-bold text-emerald-500">
                    ₹{shift.price || shift.pricePerCandidate || 250} <span className="text-xs font-normal text-muted-foreground">/ seat</span>
                  </div>
                </div>
              ))}
            </div>
          ) : center.commercialAgreement && center.commercialAgreement.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {center.commercialAgreement.map((ca: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="font-semibold text-sm mb-1">{ca.shiftName || ca.name}</div>
                  <div className="text-xs text-muted-foreground mb-3">{ca.specialNotes?.replace('Slot timings: ', '') || ca.timings || 'N/A'}</div>
                  <div className="text-sm font-bold text-emerald-500">
                    ₹{ca.pricePerCandidate || ca.price || 250} <span className="text-xs font-normal text-muted-foreground">/ seat</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-sm text-muted-foreground py-4 text-center border rounded-xl border-dashed">
               No shifts configured for this center.
             </div>
          )}
        </CardContent>
      </Card>

      {/* Infrastructure & Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5" />
            Infrastructure & Amenities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Total Computer Labs</div>
              <div className="text-2xl font-bold">{center.totalLabs ?? center.maxRooms ?? 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Total Working Systems</div>
              <div className="text-2xl font-bold">{center.totalSystems ?? center.maxSystems ?? 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Candidate Capacity</div>
              <div className="text-2xl font-bold">{center.availableCapacity || center.capacity || 0}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-foreground mb-3">Available Facilities & Security Measures</div>
            {center.facilities && center.facilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {center.facilities.map((fac: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs font-medium">
                    <CheckSquare className="h-3 w-3 mr-1.5 text-primary" />
                    {fac}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No specific facilities indicated.</div>
            )}
          </div>
          
          <div>
             <div className="text-sm font-bold text-foreground mb-3">MOU / Center Agreement</div>
             {center.mouFileName || center.mouFile || center.mouPdfUrl ? (
                <div className="flex items-center gap-2 p-3 border rounded-xl bg-muted/30 w-fit pr-6">
                   <FileCheck className="h-5 w-5 text-primary" />
                   <span className="text-sm font-medium">{center.mouFileName || center.mouFile || center.mouPdfUrl}</span>
                </div>
             ) : (
                <div className="text-sm text-muted-foreground">No MOU document uploaded.</div>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Documents — read-only viewer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Center Documents
            </CardTitle>
            {documents.length > 0 && (
              <Badge variant={documents.some(d => d.status === 'APPROVED') ? 'default' : 'secondary'}>
                {documents.filter(d => d.status === 'APPROVED').length} / {documents.length} Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {docsLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground gap-3">
              <FileText className="h-10 w-10 opacity-40" />
              <div>
                <p className="font-medium">No documents uploaded yet</p>
                <p className="text-sm">The center manager has not uploaded any documents.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc: any) => (
                <div
                  key={doc._id || doc.id}
                  className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="font-semibold text-sm leading-tight">{doc.documentType || doc.type}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColor(doc.status)}`}>
                      <StatusIcon status={doc.status} />
                      {doc.status === 'APPROVED' ? 'Verified' : doc.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  {doc.fileName && (
                    <p className="text-xs text-muted-foreground truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                  )}

                  {doc.status === 'REJECTED' && doc.rejectionReason && (
                    <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-2.5 py-1.5 border border-rose-500/20">
                      <strong>Reason:</strong> {doc.rejectionReason}
                    </p>
                  )}

                  {doc.fileUrl ? (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="mt-auto">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View Document
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full gap-2 opacity-50" disabled>
                      <FileText className="h-4 w-4" />
                      Not Uploaded
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
