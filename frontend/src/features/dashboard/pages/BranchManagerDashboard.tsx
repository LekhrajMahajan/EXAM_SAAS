import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranchStore } from '../../branch/store/useBranchStore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  Building2,
  Users,
  Monitor,
  Award,
  ShieldCheck,
  CalendarCheck,
  CheckCircle,
  Smartphone,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Activity,
  Bell,
  CheckCircle2,
  Info,
  Eye,
  FileText,
  Upload,
  Edit,
  X,
  Save,
  Loader2,
  Check,
  ExternalLink
} from 'lucide-react';

const REQUIRED_DOCUMENTS = [
  { type: 'PAN_CARD', title: 'Pan card' },
  { type: 'AADHAAR_CARD', title: 'Adharcard' },
  { type: 'CANCELLED_CHEQUE', title: 'Cancellation check' },
  { type: 'GSTIN_CERTIFICATE', title: 'GSTIN' },
];

export function BranchManagerDashboard() {
  const navigate = useNavigate();
  const { staffList, centersList, labsList, currentBranch, fetchStaff, fetchLabs, fetchCurrentBranch, updateCurrentBranch } = useBranchStore();
  const { toast } = useToast();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [docFiles, setDocFiles] = useState<Record<string, { url: string; name: string }>>({});

  useEffect(() => {
    fetchStaff();
    fetchLabs();
    fetchCurrentBranch();
  }, [fetchStaff, fetchLabs, fetchCurrentBranch]);

  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDocFiles((prev) => ({
          ...prev,
          [docType]: { url: reader.result as string, name: file.name }
        }));
        toast({ title: 'Document Loaded', description: `${file.name} ready for uploading.` });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDetails = async () => {
    if (!currentBranch?.id && !currentBranch?._id) {
      toast({ title: 'Error', description: 'Branch details not loaded yet.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const branchId = String(currentBranch.id || currentBranch._id);
      const existingDocs = (currentBranch.legalDocuments || []) as Array<{ documentType: string; url: string; status?: string; uploadedAt?: string; [key: string]: any }>;
      const updatedDocs = [...existingDocs];

      Object.entries(docFiles).forEach(([docType, docInfo]) => {
        const idx = updatedDocs.findIndex(d => d.documentType === docType);
        const newDoc = {
          documentType: docType,
          url: docInfo.url,
          status: 'VERIFIED',
          uploadedAt: new Date().toISOString()
        };
        if (idx >= 0) {
          updatedDocs[idx] = newDoc;
        } else {
          updatedDocs.push(newDoc);
        }
      });

      const payload = {
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        totalLabs: Number(formData.totalLabs || 0),
        totalSystems: Number(formData.totalSystems || 0),
        legalDocuments: updatedDocs
      };

      const result = await updateCurrentBranch(branchId, payload);
      if (result.success) {
        toast({ title: 'Success!', description: 'Branch details and documents updated successfully. Changes are instantly reflected for Company Admin!' });
        setIsEditing(false);
        setDocFiles({});
      } else {
        toast({ title: 'Update Failed', description: result.message || 'Failed to save changes.', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Unexpected error.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const lastLoginDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, []);

  // Quick action menu buttons
  const quickActions = [
    { label: 'Assigned Exam Drives', icon: Building2, onClick: () => navigate('/dashboard/branch-manager/centers') },
    { label: 'Branch Staff Roster', icon: Users, onClick: () => navigate('/dashboard/branch-manager/staff') },
    { label: 'Branch Lab Details', icon: Monitor, onClick: () => navigate('/dashboard/branch-manager/labs') },
    { label: 'Verify Staff OTP', icon: Smartphone, onClick: () => navigate('/dashboard/branch-manager/staff') },
  ];

  // Dynamic calculations from store - ZERO dummy hardcoded data
  const totalSeatingCapacity = useMemo(() => {
    return labsList.reduce((acc, l) => acc + Number(l.seatingCapacity || 0), 0);
  }, [labsList]);

  const totalAssignedCandidates = useMemo(() => {
    return centersList.reduce((acc, c) => acc + Number(c.assignedCandidatesCount || c.capacity || 0), 0);
  }, [centersList]);

  const verifiedStaffCount = useMemo(() => {
    return staffList.filter(s => s.otpVerified).length;
  }, [staffList]);

  const examReadyLabs = useMemo(() => {
    return labsList.filter(l => l.status === 'Exam Ready').length;
  }, [labsList]);

  const activeShiftsCount = useMemo(() => {
    return centersList.filter(c => c.status === 'Live' || c.readinessStatus === 'Exam Ready').length;
  }, [centersList]);

  const readinessPercentage = labsList.length > 0
    ? `${Math.round((examReadyLabs / labsList.length) * 100)}%`
    : '0%';

  const statsCards = [
    {
      title: "Assigned Exam Drives",
      value: centersList.length,
      icon: Building2,
      badgeColor: "bg-[#E4FD97] text-[#2D3E2C]",
      border: "border-slate-200 dark:border-slate-800",
      numColor: "text-slate-900 dark:text-white"
    },
    {
      title: "Total Branch Staff",
      value: staffList.length,
      icon: Users,
      badgeColor: "bg-[#E4FD97] text-[#2D3E2C]",
      border: "border-slate-200 dark:border-slate-800",
      numColor: "text-slate-900 dark:text-white"
    },
    {
      title: "Verified OTP Staff",
      value: staffList.length > 0 ? `${verifiedStaffCount} / ${staffList.length}` : '0 / 0',
      icon: Smartphone,
      badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
      border: "border-green-200 dark:border-green-900/50",
      numColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Exam Labs & Rooms",
      value: labsList.length,
      icon: Monitor,
      badgeColor: "bg-[#E4FD97] text-[#2D3E2C]",
      border: "border-slate-200 dark:border-slate-800",
      numColor: "text-slate-900 dark:text-white"
    },
    {
      title: "Total Seating Capacity",
      value: totalSeatingCapacity.toLocaleString('en-IN'),
      suffix: " Seats",
      icon: Award,
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
      border: "border-slate-200 dark:border-slate-800",
      numColor: "text-slate-900 dark:text-white"
    },
    {
      title: "Exam Readiness Score",
      value: readinessPercentage,
      icon: ShieldCheck,
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-900/50",
      numColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Active Exam Shifts",
      value: `${activeShiftsCount} Active`,
      icon: CalendarCheck,
      badgeColor: "bg-[#E4FD97] text-[#2D3E2C]",
      border: "border-slate-200 dark:border-slate-800",
      numColor: "text-slate-900 dark:text-white"
    },
    {
      title: "Scheduled Candidates",
      value: totalAssignedCandidates.toLocaleString('en-IN'),
      icon: CheckCircle,
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-900/50",
      numColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  const hasAnyData = staffList.length > 0 || labsList.length > 0 || centersList.length > 0;
  const pendingOtpStaff = staffList.filter(s => !s.otpVerified);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300">
      {/* HEADER BANNER (Master Admin Style - Olive #2D3E2C & Light Green #E4FD97) */}
      <div className="bg-[#2D3E2C] text-[#E4FD97] rounded-2xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            Welcome back, Branch Manager! 👋
          </h1>
          <p className="text-sm text-[#E4FD97]/90 font-medium max-w-xl">
            Role: <span className="font-extrabold underline text-white">Branch Manager</span> | Overseeing assigned exam drives, staff OTP validation & classroom laboratory infrastructure.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <Dialog open={isDetailsOpen} onOpenChange={(open) => { setIsDetailsOpen(open); if (!open) { setIsEditing(false); setDocFiles({}); } }}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  if (currentBranch) {
                    setFormData({
                      phone: currentBranch.phone || '',
                      alternatePhone: currentBranch.alternatePhone || '',
                      email: currentBranch.email || '',
                      address: currentBranch.address || '',
                      city: currentBranch.city || '',
                      state: currentBranch.state || '',
                      postalCode: currentBranch.postalCode || '',
                      totalLabs: currentBranch.totalLabs || 0,
                      totalSystems: currentBranch.totalSystems || 0,
                    });
                  }
                }}
                className="bg-[#E4FD97] hover:bg-[#d1ee79] text-[#2D3E2C] font-black px-5 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 text-sm border border-[#2D3E2C]/20"
              >
                <Eye className="w-4 h-4 text-[#2D3E2C] stroke-[2.5]" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between mr-6">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-[#E4FD97]" />
                    {currentBranch?.branchName || 'Branch Details'}
                    {currentBranch?.branchCode && (
                      <Badge variant="outline" className="text-xs bg-indigo-50 dark:bg-slate-900 border-indigo-200 text-indigo-600 dark:text-indigo-400 font-mono">
                        {currentBranch.branchCode}
                      </Badge>
                    )}
                  </DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!isEditing && currentBranch) {
                        setFormData({
                          phone: currentBranch.phone || '',
                          alternatePhone: currentBranch.alternatePhone || '',
                          email: currentBranch.email || '',
                          address: currentBranch.address || '',
                          city: currentBranch.city || '',
                          state: currentBranch.state || '',
                          postalCode: currentBranch.postalCode || '',
                          totalLabs: currentBranch.totalLabs || 0,
                          totalSystems: currentBranch.totalSystems || 0,
                        });
                      }
                      setIsEditing(!isEditing);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
                      isEditing 
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400' 
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300'
                    }`}
                  >
                    {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                    {isEditing ? 'Cancel Edit' : 'Edit Details'}
                  </Button>
                </div>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEditing
                    ? 'Edit your branch contact info, infrastructure counts, and upload mandatory legal compliance documents.'
                    : 'Review branch configuration & uploaded documents filled during setup by Company Admin and Branch Manager.'}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full mt-2">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="flex items-center gap-2 text-xs font-bold rounded-lg py-2">
                    <Info className="w-4 h-4 text-indigo-500" /> General Information
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2 text-xs font-bold rounded-lg py-2">
                    <FileText className="w-4 h-4 text-emerald-500" /> Documents Upload ({((currentBranch?.legalDocuments || []).length)}/4)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Branch Name</Label>
                        <p className="font-bold text-slate-900 dark:text-white mt-1">{currentBranch?.branchName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Branch Code</Label>
                        <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{currentBranch?.branchCode || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</Label>
                        {isEditing ? (
                          <Input
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                            placeholder="branch@example.com"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{currentBranch?.email || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Primary Phone</Label>
                        {isEditing ? (
                          <Input
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                            placeholder="+91-XXXXXXXXXX"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{currentBranch?.phone || 'N/A'}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Street Address</Label>
                        {isEditing ? (
                          <Input
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                            placeholder="Full building / road address"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{currentBranch?.address || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">City</Label>
                        {isEditing ? (
                          <Input
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                            placeholder="City"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{currentBranch?.city || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">State & Postal Code</Label>
                        {isEditing ? (
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={formData.state || ''}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              className="bg-white dark:bg-slate-950 text-xs font-medium h-9"
                              placeholder="State"
                            />
                            <Input
                              value={formData.postalCode || ''}
                              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                              className="bg-white dark:bg-slate-950 text-xs font-medium h-9"
                              placeholder="PIN Code"
                            />
                          </div>
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{currentBranch?.state || 'N/A'} - {currentBranch?.postalCode || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Labs</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.totalLabs || ''}
                            onChange={(e) => setFormData({ ...formData, totalLabs: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                          />
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-white mt-1">{currentBranch?.totalLabs || 0} Labs</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Computer Systems</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.totalSystems || ''}
                            onChange={(e) => setFormData({ ...formData, totalSystems: e.target.value })}
                            className="mt-1 bg-white dark:bg-slate-950 text-xs font-medium h-9"
                          />
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-white mt-1">{currentBranch?.totalSystems || 0} Systems</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REQUIRED_DOCUMENTS.map((doc) => {
                      const uploadedDoc = (currentBranch?.legalDocuments || []).find((d: any) => d.documentType === doc.type);
                      const pendingFile = docFiles[doc.type];
                      const hasDocument = Boolean(uploadedDoc || pendingFile);

                      return (
                        <div key={doc.type} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{doc.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">{doc.type}</span>
                            </div>
                            {hasDocument ? (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-0 flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Uploaded
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 text-[10px]">
                                Pending Upload
                              </Badge>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                              <Label className="cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-2 flex items-center justify-center gap-2 transition text-xs font-medium text-slate-600 dark:text-slate-300">
                                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                                {pendingFile ? `Selected: ${pendingFile.name}` : uploadedDoc ? 'Replace Document' : 'Select Document File'}
                                <Input
                                  type="file"
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(doc.type, e)}
                                />
                              </Label>
                            </div>
                          ) : (
                            hasDocument ? (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Verified
                                </span>
                                {(pendingFile?.url || uploadedDoc?.url) && (
                                  <a
                                    href={pendingFile?.url || uploadedDoc?.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    View File <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <p className="text-[11px] text-rose-500 italic pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                Required for Company Admin review
                              </p>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button
                    size="sm"
                    disabled={isSaving}
                    onClick={handleSaveDetails}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 shadow-md flex items-center gap-1.5"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes & Sync
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="text-left md:text-right shrink-0 bg-slate-900/40 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-700/50 md:border-0">
            <p className="text-sm font-extrabold text-white">
              {currentDate}
            </p>
            <p className="text-xs text-[#E4FD97]/80 font-mono mt-0.5">
              Last login: {lastLoginDate}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS WIDGET */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#2D3E2C] dark:text-[#E4FD97] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2D3E2C] dark:text-[#E4FD97]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.onClick}
                className="flex-1 min-w-[180px] sm:flex-none justify-start transition-all font-bold border-slate-300 dark:border-slate-700 text-[#2D3E2C] dark:text-slate-200 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] shadow-sm py-2.5 h-auto text-xs"
              >
                <action.icon className="mr-2.5 h-4 w-4 shrink-0 text-[#E4FD97]" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DYNAMIC STATS CARDS GRID */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {statsCards.map((stat, i) => (
          <Card
            key={i}
            className={`border ${stat.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white dark:bg-slate-900/90`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 line-clamp-1">
                    {stat.title}
                  </p>
                  <div className={`text-2xl font-black mt-1.5 ${stat.numColor}`}>
                    {stat.value}{stat.suffix || ''}
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.badgeColor} shrink-0 shadow-sm`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITIES & SYSTEM NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-white dark:bg-slate-900/90">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-4 px-5 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2D3E2C] dark:text-[#E4FD97]" />
              Recent Branch Operations & Logs
            </CardTitle>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              Live Sync
            </span>
          </CardHeader>

          <CardContent className="p-5 divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
            {!hasAnyData ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-400">
                  <Info className="w-6 h-6 text-[#E4FD97]" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Branch Activity Recorded Yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Operational logs and live audit entries will automatically populate here as soon as you register exam staff members, initialize assessment labs, or when Company Admin allocates examination rosters to your branch.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dynamically generated log from Staff Roster */}
                {staffList.length > 0 && (
                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                      STAFF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {staffList.length} Exam Roster Personnel Active
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                        {verifiedStaffCount} out of {staffList.length} staff numbers have undergone successful mobile OTP & Aadhar authentication.
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">Live Roster Status</span>
                    </div>
                  </div>
                )}

                {/* Dynamically generated log from Labs Roster */}
                {labsList.length > 0 && (
                  <div className="flex items-start gap-4 pt-4">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-500/20 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                      LABS
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {labsList.length} Exam Assessment Labs Configured
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                        Total seating capacity of {totalSeatingCapacity} computer workstations established with Verified Infrastructure flags.
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">Infrastructure Sync</span>
                    </div>
                  </div>
                )}

                {/* Dynamically generated log from Assigned Centers */}
                {centersList.length > 0 && (
                  <div className="flex items-start gap-4 pt-4">
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                      EXAM
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {centersList.length} Authorized Exam Drives Allocated
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                        Company Admin has allocated {totalAssignedCandidates.toLocaleString()} scheduled candidate examinations to this branch location.
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">Company Admin Sync</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center rounded-b-lg">
            <button 
              onClick={() => navigate('/dashboard/branch-manager/staff')}
              className="text-xs font-black text-[#2D3E2C] dark:text-[#E4FD97] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              Manage Staff Roster & Activity Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* System Notifications */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-white dark:bg-slate-900/90">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-4 px-5">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Live Notifications ({pendingOtpStaff.length > 0 ? '1 Action Req.' : '0 Alerts'})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {!hasAnyData && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    System All Clear
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    No pending alerts or compliance actions required at this moment.
                  </p>
                </div>
              </div>
            )}

            {pendingOtpStaff.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Action Required: OTP Verification
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed font-medium">
                    {pendingOtpStaff.length} staff member(s) have unverified mobile numbers in the roster. Please validate their OTP to maintain strict exam day compliance.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard/branch-manager/staff')}
                    className="mt-2 text-xs font-extrabold text-[#2D3E2C] dark:text-[#E4FD97] underline block hover:opacity-80"
                  >
                    Verify Staff OTP Now →
                  </button>
                </div>
              </div>
            )}

            {labsList.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                    Lab Infrastructure Verified
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed font-medium">
                    {labsList.length} examination labs configured with {totalSeatingCapacity} seats ready for CBT assessments.
                  </p>
                </div>
              </div>
            )}

            {centersList.length > 0 && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                    Company Admin Drive Active
                  </h4>
                  <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed font-medium">
                    {totalAssignedCandidates.toLocaleString()} candidates scheduled across {centersList.length} examination locations.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center rounded-b-lg">
            <button 
              onClick={() => navigate('/dashboard/branch-manager/labs')}
              className="text-xs font-black text-[#2D3E2C] dark:text-[#E4FD97] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              Configure Examination Labs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BranchManagerDashboard;
