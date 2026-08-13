import { Edit, Loader2, FileText, CheckCircle2, ExternalLink, Building2, MapPin, Monitor, Phone, Clock, User, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BranchStatusBadge } from "../components/BranchStatusBadge";
import { useBranch } from "../hooks/branch.hooks";
import { Card } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

const COMPLIANCE_DOCS = [
  { type: 'PAN_CARD', title: 'Pan Card' },
  { type: 'AADHAAR_CARD', title: 'Adharcard' },
  { type: 'CANCELLED_CHEQUE', title: 'Cancellation Check' },
  { type: 'GSTIN_CERTIFICATE', title: 'GSTIN Certificate' },
];

const FACILITY_OPTIONS: Record<string, string> = {
  cctv: "CCTV Surveillance",
  backup_power: "Backup Power / UPS",
  ac_labs: "Air-Conditioned Labs",
  biometric: "Biometric Access Control",
  waiting_area: "Candidate Waiting Lounge",
  parking: "Parking Facility",
  drinking_water: "RO Drinking Water",
  high_speed_internet: "High-Speed Lease Line",
  wheelchair: "Wheelchair Accessible",
};

export const BranchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBranch(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const branch = (data?.data || data) as Record<string, unknown> | undefined;
  const branchCode = (branch?.branchCode || branch?.code || 'Branch') as string;
  const status = ((branch?.status as string) === 'Active' || (branch?.status as string) === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE') as 'ACTIVE' | 'INACTIVE';

  // Dynamic values mapped directly from Branch Form details
  const branchName = String(branch?.branchName || branch?.name || 'N/A');
  const branchType = String(branch?.branchType || 'Standard Branch');
  const examCenterCode = String(branch?.examCenterCode || 'Not specified');
  const companyName = String(branch?.company || 'ExamGuard Pro');
  
  const managerName = String(branch?.managerName || branch?.contactPerson || branch?.headName || 'N/A');
  const email = String(branch?.email || branch?.contactEmail || branch?.headEmail || 'N/A');
  const phone = String(branch?.phone || branch?.contactMobile || branch?.headMobile || 'N/A');
  const alternatePhone = String(branch?.alternatePhone || branch?.alternateNumber || 'Not specified');

  const address = String(branch?.address || 'N/A');
  const city = String(branch?.city || 'N/A');
  const state = String(branch?.state || 'N/A');
  const postalCode = String(branch?.postalCode || branch?.pincode || 'N/A');
  const country = String(branch?.country || 'India');

  const totalLabs = Number(branch?.totalLabs !== undefined ? branch.totalLabs : 0);
  const totalSystems = Number(branch?.totalSystems !== undefined ? branch.totalSystems : 0);
  const facilities = (Array.isArray(branch?.facilities) ? branch.facilities : []) as string[];

  const createdAtDate = branch?.createdAt ? new Date(String(branch.createdAt)).toLocaleString() : 'Recently';
  const updatedAtDate = branch?.updatedAt ? new Date(String(branch.updatedAt)).toLocaleString() : 'Recently';

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header section matching website theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            Branch Details
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Detailed view and configuration management for <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{branchCode}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <BranchStatusBadge status={status} />
          <Link to={`/company/branches/${id}/edit`}>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-700 font-semibold px-4 py-2 h-9">
              <Edit className="h-4 w-4 mr-2" />
              Edit Branch
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg font-semibold text-xs px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white shadow-xs transition-all">
            General Information
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg font-semibold text-xs px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white shadow-xs transition-all">
            Contact Details
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg font-semibold text-xs px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white shadow-xs transition-all">
            Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg font-semibold text-xs px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white shadow-xs transition-all">
            Activity Log
          </TabsTrigger>
        </TabsList>
        
        {/* TAB 1: GENERAL INFORMATION */}
        <TabsContent value="general" className="space-y-6">
          {/* Branch Overview Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Branch Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Primary identification, category type, and exam center codes for this location.
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch Name</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">{branchName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch Type</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">{branchType}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch Code</dt>
                <dd className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md inline-block border border-slate-200 dark:border-slate-700/60">{branchCode}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Center Code</dt>
                <dd className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{examCenterCode}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organization / Company</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">{companyName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operational Status</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-slate-700 dark:bg-slate-300' : 'bg-slate-400'}`}></span>
                    {status === 'ACTIVE' ? 'Ready for assessments' : 'Inactive / Paused'}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Location & Address Details Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Location & Address Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accurate street address and regional geographical coordinates for audit compliance.
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sm:col-span-2 space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Street Address & Landmarks</dt>
                <dd className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">{address}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">City / Town</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">{city}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">State / Province</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">{state}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PIN Code / Postal Code</dt>
                <dd className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{postalCode}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Country</dt>
                <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">{country}</dd>
              </div>
            </dl>
          </Card>

          {/* Infrastructure & Amenities Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Infrastructure & Amenities
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Examination lab capacities, total computer systems, and available security measures.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Computer Labs / Testing Halls</dt>
                <dd className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{totalLabs}</span> <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Testing Halls</span>
                </dd>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Working Computer Systems</dt>
                <dd className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{totalSystems}</span> <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Working Machines</span>
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Available Facilities & Security Measures</dt>
              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {facilities.map((facId) => (
                    <div key={facId} className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{FACILITY_OPTIONS[facId] || facId}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No security measures or facilities explicitly selected.</p>
              )}
            </div>
          </Card>
        </TabsContent>
        
        {/* TAB 2: CONTACT DETAILS */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Contact & Administration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assigned branch head and center manager details for administrative communications and urgent escalation.
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Person / Manager Name</dt>
                <dd className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" /> {managerName}
                </dd>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Official Branch Email</dt>
                <dd className="text-base font-semibold text-slate-800 dark:text-slate-200 font-mono">{email}</dd>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Primary Contact Number</dt>
                <dd className="text-base font-bold text-slate-900 dark:text-white font-mono">{phone}</dd>
              </div>
              <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alternate Number</dt>
                <dd className="text-base font-medium text-slate-700 dark:text-slate-300 font-mono">{alternatePhone}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Branch Head Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified executive profile directing operation schedules and staff roster suites at this center.
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Head Name</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">{managerName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Head Mobile</dt>
                <dd className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{phone}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Head Email</dt>
                <dd className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{email}</dd>
              </div>
            </dl>
          </Card>
        </TabsContent>
        
        {/* TAB 3: DOCUMENTS */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Branch Compliance & Legal Documents
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mandatory KYC and operational compliance documentation verified for examination auditing.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {COMPLIANCE_DOCS.map((doc) => {
                const legalDocs = (branch?.legalDocuments as Array<{ documentType: string; url?: string; uploadedAt?: string | Date }>) || [];
                const foundDoc = legalDocs.find((d) => d.documentType === doc.type);
                return (
                  <div key={doc.type} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between space-y-6 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-base text-slate-900 dark:text-white block">{doc.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">{doc.type}</span>
                      </div>
                      {foundDoc ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300/60 dark:border-slate-700">
                          Pending Upload
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                      {foundDoc?.url ? (
                        <a
                          href={foundDoc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-700 shadow-xs"
                        >
                          View Document <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 italic text-xs font-medium">Awaiting Branch Manager upload</span>
                      )}
                      {foundDoc?.uploadedAt && (
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(foundDoc.uploadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
        
        {/* TAB 4: ACTIVITY LOG */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Branch Activity & Audit Log
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chronological trail of configuration updates, onboarding transitions, and administrative actions.
                </p>
              </div>
            </div>

            <div className="relative pl-6 space-y-8 border-l-2 border-slate-200 dark:border-slate-800 my-4 ml-3">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-slate-200 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{updatedAtDate}</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded text-[10px] font-sans font-bold">PROFILE_SYNCHRONIZED</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Branch configuration and compliance data verified</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Current capacity registered as {totalLabs} testing halls and {totalSystems} computer systems with active compliance tracking.
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{createdAtDate}</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded text-[10px] font-sans font-bold">ADMIN_ASSIGNED</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Administrative executive designated</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {managerName} ({email}) assigned as Primary Manager / Branch Head for official administrative communications.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{createdAtDate}</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded text-[10px] font-sans font-bold">BRANCH_CREATED</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Branch location initialized in ExamGuard Pro</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Location profile created under branch code {branchCode} in {city}, {state}.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};



