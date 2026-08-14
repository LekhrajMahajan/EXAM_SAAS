import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { centerSchema, type CenterFormValues } from "../schemas/center.schema";
import { useCreateCenter, useUpdateCenter } from "../hooks/center.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useBranches } from "../../branch/hooks/branch.hooks";
import { 
  Loader2, 
  Plus, 
  X, 
  Upload, 
  Building2, 
  MapPin, 
  Users, 
  MonitorSmartphone, 
  Clock, 
  CheckSquare, 
  Square,
  Sparkles
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import apiClient from '@/core/api/http/axios-client';

interface CenterFormProps {
  initialValues?: Partial<CenterFormValues>;
  isEditing?: boolean;
}

const AVAILABLE_FACILITIES = [
  "CCTV Surveillance",
  "Backup Power / UPS",
  "Air Conditioned Labs",
  "Biometric Access Control",
  "Candidate Waiting Lounge",
  "Parking Facility",
  "RO Drinking Water",
  "High-Speed Lease Line",
  "Wheelchair Accessible",
];

interface ShiftItem {
  name: string;
  timings: string;
  price: string;
}

export const CenterForm = ({ initialValues, isEditing }: CenterFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Interactive state matching design with Pricing / Rates
  const [shifts, setShifts] = useState<ShiftItem[]>(
    isEditing && ((initialValues as any)?.commercialAgreement?.length > 0 || (initialValues as any)?.shiftRates?.length > 0)
      ? ((initialValues as any).commercialAgreement || (initialValues as any).shiftRates).map((ca: any) => ({
          name: ca.shiftName || ca.name || "Standard Shift",
          timings: ca.specialNotes?.replace("Slot timings: ", "") || ca.timings || "09:00 AM - 12:00 PM",
          price: String(ca.pricePerCandidate || ca.price || 250)
        }))
      : []
  );
  const [newShiftName, setNewShiftName] = useState("Morning Shift");
  const [shiftStartTime, setShiftStartTime] = useState("09:00");
  const [shiftEndTime, setShiftEndTime] = useState("12:00");
  const [newShiftPrice, setNewShiftPrice] = useState("250");
  const [showAddShift, setShowAddShift] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    isEditing && (initialValues as any)?.facilities?.length > 0 
      ? (initialValues as any).facilities 
      : ["CCTV Surveillance", "Backup Power / UPS", "Biometric Access Control", "High-Speed Lease Line"]
  );
  const [mouFile, setMouFile] = useState<File | null>(null);
  // Show previously uploaded MOU filename when editing
  const existingMouName: string = isEditing ? ((initialValues as any)?.mouFileName || (initialValues as any)?.mouFile || '') : '';

  const createMutation = useCreateCenter();
  const updateMutation = useUpdateCenter((initialValues as unknown as Record<string, string>)?._id || "");
  const { data: branchResp } = useBranches({ limit: 100 });

  const branches = useMemo(() => {
    if (!branchResp) return [];
    if (Array.isArray(branchResp.data)) return branchResp.data;
    const resAny = branchResp as unknown as Record<string, unknown>;
    const dataObj = resAny?.data as Record<string, unknown>;
    if (dataObj?.branches) return dataObj.branches as Array<Record<string, string>>;
    if (resAny?.branches) return resAny.branches as Array<Record<string, string>>;
    return [];
  }, [branchResp]);
  
  const form = useForm({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      centerName: initialValues?.centerName || "",
      centerCode: initialValues?.centerCode || "",
      branch: initialValues?.branch || "",
      centerType: (initialValues as unknown as Record<string, string>)?.centerType || "Standard Center",
      state: initialValues?.state || "",
      city: initialValues?.city || "",
      address: initialValues?.address || "",
      pincode: initialValues?.pincode || "",
      googleMapUrl: initialValues?.googleMapUrl || "",
      headName: initialValues?.headName || "",
      headEmail: initialValues?.headEmail || "",
      headMobile: initialValues?.headMobile || "",
      emergencyContact: initialValues?.emergencyContact || "",
      maxCandidates: initialValues?.maxCandidates || 100,
      maxRooms: initialValues?.maxRooms || 5,
      maxSystems: initialValues?.maxSystems || 100,
      status: initialValues?.status || "Active",
    },
  });

  const handleToggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const formatTimeToAmPm = (timeStr: string) => {
    if (!timeStr) return "N/A";
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h)) return timeStr;
    const period = h >= 12 ? "PM" : "AM";
    const hours12 = h % 12 || 12;
    const mins = m !== undefined && !isNaN(m) ? (m < 10 ? `0${m}` : m) : "00";
    return `${hours12}:${mins} ${period}`;
  };

  const handleAddShift = () => {
    if (newShiftName.trim()) {
      const formattedTiming = `${formatTimeToAmPm(shiftStartTime)} - ${formatTimeToAmPm(shiftEndTime)}`;
      setShifts([...shifts, {
        name: newShiftName.trim(),
        timings: formattedTiming,
        price: newShiftPrice.trim() || "250"
      }]);
      setNewShiftName("Morning Shift");
      setShiftStartTime("09:00");
      setShiftEndTime("12:00");
      setNewShiftPrice("250");
      setShowAddShift(false);
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    // Debug: log what was submitted
    console.warn('[CenterForm] onSubmit fired', { isEditing });
    // Resolve branchId: use selected branch, or fallback to first branch in list.
    // In edit mode, if branch is empty string, omit branchId so the existing value is preserved in DB.
    const resolvedBranchId = (data.branch as string) ||
      (branches && branches.length > 0
        ? ((branches[0] as unknown as Record<string, string>)._id || (branches[0] as unknown as Record<string, string>).id)
        : '');

    const payload: Record<string, unknown> = {
      ...data,
      capacity: Number(data.maxCandidates) || Number(data.maxSystems) || 100,
      availableCapacity: Number(data.maxCandidates) || Number(data.maxSystems) || 100,
      managerName: data.headName,
      email: data.headEmail,
      phone: data.headMobile,
      country: "India",
      centerType: "PRIVATE",
      centerCategory: data.centerType || "Standard Center",
      displayCenterType: data.centerType || "Standard Center",
      status: data.status === "Inactive" ? "INACTIVE" : "ACTIVE",
      totalLabs: Number(data.maxRooms) || 5,
      totalSystems: Number(data.maxSystems) || 100,
      shifts: shifts.map(s => `${s.name} (${s.timings}) - ₹${s.price}/seat`),
      shiftRates: shifts,
      commercialAgreement: shifts.map(s => ({
        shiftName: s.name || "Standard Shift",
        pricePerCandidate: Number(s.price) || 250,
        candidateCapacity: Number(data.maxCandidates) || Number(data.maxSystems) || 100,
        maximumCapacity: Number(data.maxCandidates) || Number(data.maxSystems) || 100,
        specialNotes: `Slot timings: ${s.timings || "Standard Hours"}`
      })),
      facilities: selectedFacilities,
      mouFileName: existingMouName,
      mouPdfUrl: (initialValues as any)?.mouPdfUrl || undefined,
    } as any;

    if (resolvedBranchId && resolvedBranchId !== "[object Object]") {
      payload.branchId = resolvedBranchId;
    } else {
      // Remove branch if empty string or invalid object representation
      delete payload.branch;
      delete payload.branchId;
    }

    if (payload.branch === "[object Object]") delete payload.branch;
    if (payload.branchId === "[object Object]") delete payload.branchId;

    if (mouFile) {
      try {
        const formData = new FormData();
        formData.append("file", mouFile);
        const uploadRes = await apiClient.post('/centers/mou/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data?.success) {
          payload.mouPdfUrl = uploadRes.data.data.url;
          payload.mouFileName = mouFile.name;
        }
      } catch (err) {
        console.error("MOU Upload error:", err);
        alert("Failed to upload MOU PDF. Proceeding without it.");
      }
    }

    console.warn('[CenterForm] Final Payload:', JSON.stringify(payload, null, 2));

    const initialRecord = initialValues as unknown as Record<string, string>;
    if (isEditing && initialRecord?._id) {
      updateMutation.mutate(payload as unknown as Partial<CenterFormValues>, {
        onSuccess: async () => {
          queryClient.removeQueries({ queryKey: ["centers"] });
          alert("Center updated successfully");
          navigate("/company/centers");
        },
        onError: (error: any) => {
          console.error("Center update error:", error);
          alert(`Update Failed: ${error.response?.data?.message || error.message || "Unknown error"}`);
        }
      });
    } else {
      createMutation.mutate(payload as unknown as CenterFormValues, {
        onSuccess: async () => {
          queryClient.removeQueries({ queryKey: ["centers"] });
          alert("Center created successfully and credentials sent.");
          navigate("/company/centers");
        },
        onError: (error: any) => {
          console.error("Center creation error:", error);
          alert(`Creation Failed: ${error.response?.data?.message || error.message || "Unknown error"}`);
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error('[CenterForm] Validation errors:', errors);
        })}
        className="space-y-6 text-slate-100"
      >

        {/* CARD 1: CENTER OVERVIEW */}
        <div className="bg-[#0E1422] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#172033] border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white tracking-wide">Center Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure primary identification, branch assignment, and exam center codes for this location.
              </p>
            </div>
            {/* Operational Status toggle indicator matching image 2 */}
            <div className="hidden sm:flex items-center gap-3 bg-[#131B2E] border border-slate-800 rounded-xl px-4 py-2">
              <div>
                <p className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">Operational Status</p>
                <p className="text-[10px] text-slate-400">Ready for assessments</p>
              </div>
              <div 
                onClick={() => form.setValue("status", form.watch("status") === "Active" ? "Inactive" : "Active")}
                className="w-11 h-6 bg-emerald-500 rounded-full flex items-center justify-end p-0.5 cursor-pointer shadow-md transition-colors"
              >
                <div className="w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <FormField
                control={form.control}
                name="centerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">Center Name <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. North Zone Technology Hub / Main Delhi Campus" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-5">
              <FormField
                control={form.control}
                name="centerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">Center Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0A0E18] border-slate-800 text-slate-200 h-11 rounded-xl text-sm focus:ring-indigo-500/30">
                          <SelectValue placeholder="Standard Center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111726] border-slate-800 text-white rounded-xl shadow-2xl py-1">
                        <SelectItem value="Standard Center" className="hover:bg-slate-800 cursor-pointer text-sm py-2.5">
                          Standard Center
                        </SelectItem>
                        <SelectItem value="Dedicated Exam Center" className="hover:bg-slate-800 cursor-pointer text-sm py-2.5">
                          Dedicated Exam Center
                        </SelectItem>
                        <SelectItem value="Regional Office" className="hover:bg-slate-800 cursor-pointer text-sm py-2.5">
                          Regional Office
                        </SelectItem>
                        <SelectItem value="Franchise Partner" className="hover:bg-slate-800 cursor-pointer text-sm py-2.5">
                          Franchise Partner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="centerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">Center Code <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CTR-DEL-01" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300">Exam Center Code <span className="text-slate-500 text-[11px] font-normal">(Optional)</span></FormLabel>
                <Input placeholder="e.g. CTR-89012" defaultValue="CTR-89012" className="bg-[#0A0E18] border-slate-800 text-slate-300 h-11 rounded-xl text-sm" />
              </FormItem>
            </div>
          </div>
        </div>

        {/* CARD 2: CONTACT & ADMINISTRATION */}
        <div className="bg-[#0E1422] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#172033] border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Contact & Administration</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assign center head or manager details for administrative communications and automated login credentials.
                </p>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 text-xs text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/25 px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Credentials will be auto-generated & emailed to Contact Email
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="headName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Contact Person / Manager Name <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter primary contact name" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="headEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Official Center Email <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="center.delhi@company.com" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Primary Contact Number <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +91 9876543210" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Alternate Number <span className="text-slate-500 text-[11px] font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Landline or Secondary mobile" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* CARD 3: LOCATION & ADDRESS DETAILS */}
        <div className="bg-[#0E1422] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#172033] border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Location & Address Details</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Provide accurate street address and regional coordinates for candidates and audit compliance.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Street Address & Landmarks <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Building name, plot number, road, nearby landmark..." className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">City / Town <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city name" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">State / Province <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state name" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-300">PIN Code / Postal Code <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit PIN" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300">Country <span className="text-rose-500">*</span></FormLabel>
                <Input value="India" readOnly className="bg-[#101726] border-slate-800 text-slate-300 font-semibold h-11 rounded-xl text-sm cursor-not-allowed" />
              </FormItem>
            </div>
          </div>
        </div>

        {/* CARD 4: EXAM SHIFTS & SCHEDULING WITH PRICE/RATES */}
        <div className="bg-[#0E1422] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#172033] border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Exam Shifts (Rates & Timings)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define operational examination shift slots and associated per-seat rate cards supported at this testing location.
                </p>
              </div>
            </div>

            {!showAddShift && (
              <button
                type="button"
                onClick={() => setShowAddShift(true)}
                className="px-4 py-2.5 rounded-xl bg-[#172033] hover:bg-[#1f2b46] border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Plus className="h-4 w-4 text-indigo-400" />
                Add Shift & Rate
              </button>
            )}
          </div>

          {/* Interactive Form for Adding Shift & Price */}
          {showAddShift && (
            <div className="mb-6 p-5 rounded-2xl bg-[#0A0E18] border border-indigo-500/50 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4" /> Configure New Exam Shift & Rate Card
                </span>
                <button type="button" onClick={() => setShowAddShift(false)} className="text-slate-400 hover:text-rose-400 p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-6">
                  <label htmlFor="new-shift-name" className="block text-[11px] font-semibold text-slate-300 mb-1.5">Shift Name <span className="text-rose-500">*</span></label>
                  <Select
                    value={newShiftName}
                    onValueChange={(val) => {
                      setNewShiftName(val);
                      if (val === "Morning Shift") {
                        setShiftStartTime("09:00");
                        setShiftEndTime("12:00");
                        setNewShiftPrice("250");
                      } else if (val === "Afternoon Shift") {
                        setShiftStartTime("14:00");
                        setShiftEndTime("17:00");
                        setNewShiftPrice("300");
                      } else if (val === "Evening Shift") {
                        setShiftStartTime("17:30");
                        setShiftEndTime("20:30");
                        setNewShiftPrice("350");
                      }
                    }}
                  >
                    <SelectTrigger id="new-shift-name" className="w-full h-10 bg-[#111726] border-slate-700 text-slate-200 rounded-xl text-xs focus:ring-indigo-500/30">
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111726] border-slate-800 text-white rounded-xl shadow-2xl py-1">
                      <SelectItem value="Morning Shift" className="hover:bg-slate-800 cursor-pointer text-xs py-2">
                        Morning Shift
                      </SelectItem>
                      <SelectItem value="Afternoon Shift" className="hover:bg-slate-800 cursor-pointer text-xs py-2">
                        Afternoon Shift
                      </SelectItem>
                      <SelectItem value="Evening Shift" className="hover:bg-slate-800 cursor-pointer text-xs py-2">
                        Evening Shift
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="md:col-span-6">
                  <label htmlFor="new-shift-price" className="block text-[11px] font-semibold text-slate-300 mb-1.5">Price / Rate (in ₹) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      id="new-shift-price"
                      type="number"
                      placeholder="e.g. 350"
                      value={newShiftPrice}
                      onChange={(e) => setNewShiftPrice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddShift())}
                      className="w-full h-10 bg-[#111726] border border-slate-700 rounded-xl pl-7 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-semibold text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddShift(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddShift}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Save Shift Rate
                </button>
              </div>
            </div>
          )}

          {/* Rendered Shift Cards with Price Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shifts.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#0A0E18] border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-wide">{s.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{s.timings}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-3 border-l border-slate-800 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate Card</div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      ₹{s.price} <span className="text-[11px] font-normal text-slate-400">/ seat</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShifts(shifts.filter((_, i) => i !== idx))}
                    className="w-7 h-7 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 flex items-center justify-center transition-colors shadow-xs"
                    title="Remove shift"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: INFRASTRUCTURE & AMENITIES */}
        <div className="bg-[#0E1422] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#172033] border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <MonitorSmartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Infrastructure & Amenities</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Specify examination lab capacities, hardware resources, statutory agreement, and available security facilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="maxRooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Total Computer Labs / Testing Halls</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} value={field.value as number | string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSystems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Total Working Computer Systems (Capacity)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} value={field.value as number | string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCandidates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-300">Candidate Seating Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" className="bg-[#0A0E18] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600 h-11 rounded-xl text-sm" {...field} value={field.value as number | string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* MOU PDF Upload Section */}
          <div className="p-4 rounded-xl bg-[#0A0E18]/80 border border-slate-800/80 space-y-2">
            <FormLabel className="text-xs font-semibold text-slate-200 block">MOU PDF / Center Agreement Document <span className="text-rose-500">*</span></FormLabel>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-[#172033] hover:bg-[#1f2b46] border border-slate-700 text-slate-200 px-4 py-2 rounded-xl font-semibold text-xs transition-colors shadow-xs flex items-center gap-2">
                <Upload className="h-4 w-4 text-indigo-400" />
                Browse File...
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setMouFile(f);
                  }}
                />
              </label>
              <span className="text-xs text-slate-400 truncate flex-1 font-medium bg-[#0A0D14] px-3.5 py-2.5 rounded-xl border border-slate-800/60">
                {mouFile
                  ? <span className="text-emerald-400 font-semibold">{mouFile.name}</span>
                  : existingMouName
                    ? <span className="text-emerald-400 font-semibold">{existingMouName} <span className="text-slate-500 font-normal">(existing)</span></span>
                    : "No file selected."}
              </span>
              {mouFile && (
                <button type="button" onClick={() => setMouFile(null)} className="p-2 text-slate-400 hover:text-rose-400">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Upload draft Memorandum of Understanding (MOU) to be signed & stamped by the Center Manager upon first login.</p>
          </div>

          {/* Available Facilities & Security Measures Grid matching Image 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Available Facilities & Security Measures</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {AVAILABLE_FACILITIES.map((fac) => {
                const isSelected = selectedFacilities.includes(fac);
                return (
                  <div
                    key={fac}
                    onClick={() => handleToggleFacility(fac)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3.5 cursor-pointer select-none transition-all ${
                      isSelected 
                        ? "bg-indigo-600/15 border-indigo-500/80 text-indigo-200 shadow-sm" 
                        : "bg-[#0A0E18] border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-indigo-400 shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600 shrink-0" />
                    )}
                    <span className="text-xs font-semibold tracking-wide">{fac}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS FOOTER MATCHING DESIGN */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Button
            type="button"
            onClick={() => navigate("/company/centers")}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold px-7 py-2.5 h-12 rounded-xl transition-all text-sm shadow-md"
          >
            Cancel & Return
          </Button>

          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-[#E4FD97] hover:bg-[#d4f378] text-slate-950 font-bold px-8 py-2.5 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 text-sm flex items-center gap-2 cursor-pointer"
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                {isEditing ? "Updating Center..." : "Registering Center..."}
              </>
            ) : (
              isEditing ? "Save & Update Center" : "Save & Register Center"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
