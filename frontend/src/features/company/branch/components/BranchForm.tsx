import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema } from "../schemas/branch.schema";
import type { BranchFormData } from "../schemas/branch.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useCreateBranch, useUpdateBranch } from "../hooks/branch.hooks";
import { Loader2, Building2, UserCheck, MapPin, Monitor } from "lucide-react";

interface BranchFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
}

const FACILITY_OPTIONS = [
  { id: "cctv", label: "CCTV Surveillance" },
  { id: "backup_power", label: "Backup Power / UPS" },
  { id: "ac_labs", label: "Air-Conditioned Labs" },
  { id: "biometric", label: "Biometric Access Control" },
  { id: "waiting_area", label: "Candidate Waiting Lounge" },
  { id: "parking", label: "Parking Facility" },
  { id: "drinking_water", label: "RO Drinking Water" },
  { id: "high_speed_internet", label: "High-Speed Lease Line" },
  { id: "wheelchair", label: "Wheelchair Accessible" },
];

export const BranchForm = ({ initialData, isEdit = false }: BranchFormProps) => {
  const navigate = useNavigate();
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch(initialData?._id || "");
  
  const form = useForm<BranchFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(branchSchema) as any,
    defaultValues: {
      companyId: initialData?.companyId || undefined,
      branchType: initialData?.branchType || "Branch",
      branchName: initialData?.branchName || "",
      branchCode: initialData?.branchCode || "",
      examCenterCode: initialData?.examCenterCode || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      alternatePhone: initialData?.alternatePhone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "India",
      postalCode: initialData?.postalCode || "",
      managerName: initialData?.managerName || "",
      totalLabs: initialData?.totalLabs ?? 0,
      totalSystems: initialData?.totalSystems ?? 0,
      facilities: initialData?.facilities || [],
      status: initialData?.status || "ACTIVE",
    },
  });

  const onSubmit = (data: BranchFormData) => {
    const payload = { ...data } as BranchFormData & Record<string, unknown>;
    if (!payload.companyId) {
      delete payload.companyId;
    }
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" && key !== "email" && key !== "branchName" && key !== "branchCode") {
        delete payload[key];
      }
    });
    if (isEdit) {
      updateMutation.mutate(payload, {
        onSuccess: () => navigate("/company/branches"),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate("/company/branches"),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Branch Overview Section */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#2D3E2C]/10 dark:bg-[#E4FD97]/15 text-[#2D3E2C] dark:text-[#E4FD97]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Branch Overview
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Configure primary identification, category type, and exam center codes for this location.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Branch Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. North Zone Technology Hub / Main Delhi Campus" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Branch Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "Branch"}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Branch">Standard Branch</SelectItem>
                      <SelectItem value="Examination Center">Dedicated Exam Center</SelectItem>
                      <SelectItem value="Regional Office">Regional Office</SelectItem>
                      <SelectItem value="Franchise Partner">Franchise Partner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Branch Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BR-DEL-01" className="h-11 uppercase font-mono border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examCenterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Exam Center Code <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CTR-89012" className="h-11 font-mono border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/50 mt-1">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Operational Status
                    </FormLabel>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {field.value === "ACTIVE" ? "Ready for assessments" : "Inactivating pauses scheduling"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "ACTIVE"}
                      onCheckedChange={(checked) => field.onChange(checked ? "ACTIVE" : "INACTIVE")}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact & Administration */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#2D3E2C]/10 dark:bg-[#E4FD97]/15 text-[#2D3E2C] dark:text-[#E4FD97]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Contact &amp; Administration
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Assign branch head or center manager details for administrative communications.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="managerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Contact Person / Manager Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter primary contact name" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Official Branch Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="branch.delhi@company.com" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Primary Contact Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +91 9876543210" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternatePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Alternate Number <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Landline or Secondary mobile" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#2D3E2C]/10 dark:bg-[#E4FD97]/15 text-[#2D3E2C] dark:text-[#E4FD97]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Location &amp; Address Details
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Provide accurate street address and regional coordinates for candidates and audit compliance.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Street Address &amp; Landmarks <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Building name, plot number, road, nearby landmark..." className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    City / Town <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
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
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    State / Province <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state name" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    PIN Code / Postal Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="6-digit PIN" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                    Country <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="India" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Infrastructure & Facilities */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#2D3E2C]/10 dark:bg-[#E4FD97]/15 text-[#2D3E2C] dark:text-[#E4FD97]">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Infrastructure &amp; Amenities
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Specify examination lab capacities and available facilities at this location.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalLabs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                      Total Computer Labs / Testing Halls
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSystems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                      Total Working Computer Systems (Capacity)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-900 dark:text-white">
                    Available Facilities &amp; Security Measures
                  </FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {FACILITY_OPTIONS.map((item) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      const checked = currentValues.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (checked) {
                              field.onChange(currentValues.filter((val) => val !== item.id));
                            } else {
                              field.onChange([...currentValues, item.id]);
                            }
                          }}
                          className={`flex flex-row items-center space-x-3.5 rounded-xl border p-3.5 cursor-pointer transition-all ${
                            checked
                              ? "border-[#2D3E2C]/50 dark:border-[#E4FD97]/50 bg-[#2D3E2C]/5 dark:bg-[#E4FD97]/10 shadow-2xs"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Checkbox
                            checked={checked}
                            className="pointer-events-none data-[state=checked]:bg-[#2D3E2C] data-[state=checked]:text-white data-[state=checked]:dark:bg-[#E4FD97] data-[state=checked]:dark:text-slate-900 border-slate-300 dark:border-slate-700"
                          />
                          <span className="font-medium text-sm text-slate-800 dark:text-slate-200 select-none">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/company/branches")}
            disabled={isPending}
            className="w-full sm:w-auto px-6 h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-semibold"
          >
            Cancel &amp; Return
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-8 h-11 bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-white dark:bg-[#E4FD97] dark:text-[#2D3E2C] dark:hover:bg-[#E4FD97]/90 rounded-lg font-bold shadow-sm transition-all"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Update Branch Settings" : "Save & Register Branch"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
