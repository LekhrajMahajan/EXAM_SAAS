import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, type StaffFormValues } from "../schemas/staff.schema";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { staffApi } from "../api/staff.api";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { examApi } from "@/features/exam-manager/api/exam.api";
import { apiClient } from '@/core/api/http/axios-client';



const ROLES = [
  { label: "Exam Manager", value: "EXAM_MANAGER" },
  { label: "Paper Setter", value: "PAPER_SETTER" },
  { label: "Biometric Verifier", value: "BIOMETRIC_VERIFIER" },
  { label: "Entry Checker", value: "ENTRY_CHECKER" },
  { label: "Observer", value: "OBSERVER" },
  { label: "Govt Authority", value: "GOVT_AUTHORITY" },
  { label: "Technical Manager", value: "TECHNICAL_MANAGER" },
  { label: "State Manager", value: "STATE_MANAGER" },
  { label: "City Manager", value: "CITY_MANAGER" },
];

const STATES = ["Maharashtra", "Gujarat", "Delhi", "Karnataka", "Tamil Nadu"];
const CITIES: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
};

interface StaffFormProps {
  initialValues?: any;
  isEditing?: boolean;
  fixedRole?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const StaffForm = ({ initialValues, isEditing, fixedRole, onSuccess, onCancel }: StaffFormProps = {}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      role: initialValues?.role || "",
      state: initialValues?.state || "",
      city: initialValues?.city || "",
      examId: initialValues?.examId || "",
    },
  });

  const selectedRole = form.watch("role");
  const selectedState = form.watch("state");

  useEffect(() => {
    if (selectedRole === "PAPER_SETTER") {
      const fetchExams = async () => {
        try {
          const res = await examApi.getAll({ limit: 100 });
          if (res.success) {
            setExams(res.data.exams || []);
          }
        } catch (error) {
          console.error('Failed to fetch exams', error);
        }
      };
      fetchExams();

      if (!isEditing && initialValues?.examId) {
        form.setValue("examId", initialValues.examId);
      }

      if (isEditing && initialValues) {
        const staffId = initialValues.id || initialValues._id;
        if (staffId) {
          // assignment fetch removed
        }
      }
    }
  }, [selectedRole, isEditing, initialValues, form]);

  const onSubmit = async (data: StaffFormValues) => {
    try {
      setIsSubmitting(true);
      // Construct payload according to backend API requirements
      const payload = {
        employeeCode: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
        phone: "9999999999",
        department: data.role.replace("_", " "),
        designation: data.role.replace("_", " "),
        joiningDate: new Date().toISOString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        state: (data.role === "STATE_MANAGER" || data.role === "CITY_MANAGER") ? data.state : undefined,
        city: data.role === "CITY_MANAGER" ? data.city : undefined,
        examId: data.role === "PAPER_SETTER" ? data.examId : undefined,
      };

      const staffId = isEditing ? (initialValues?.id || initialValues?._id) : null;
      if (staffId) {
        await staffApi.update(staffId, payload);
        
        if (data.role === "PAPER_SETTER" && data.examId) {
          try {
            await apiClient.post('/staff-assignments/create', {
              examId: data.examId,
              role: data.role,
              employeeId: staffId,
              status: 'PUBLISHED'
            });
          } catch (e) {
            console.error('Failed to update assignment', e);
          }
        }

        toast({
          title: "Role Updated",
          description: "Staff role updated successfully and email notification sent.",
          variant: "success",
        });
      } else {
        const createRes = await staffApi.create(payload);
        
        if (data.role === "PAPER_SETTER" && data.examId && createRes.data) {
          try {
            await apiClient.post('/staff-assignments/create', {
              examId: data.examId,
              role: data.role,
              employeeId: (createRes.data as any)._id || (createRes.data as any).id,
              status: 'PUBLISHED'
            });
          } catch (e) {
            console.error('Failed to create assignment', e);
          }
        }

        toast({
          title: "Role Created",
          description: "Staff role assigned successfully and email with credentials sent.",
          variant: "success",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/company/staff");
      }
    } catch (error: unknown) {
      const err = error as any;
      toast({
        title: isEditing ? "Update Failed" : "Creation Failed",
        description: err.response?.data?.message || (isEditing ? "Failed to update role" : "Failed to create role"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/company/staff");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle>{isEditing ? 'Update Role' : 'Assign New Role'}</CardTitle>
            <CardDescription>{isEditing ? 'Update staff details and their role.' : 'Enter staff details and assign their role.'}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} className="bg-slate-900 border-slate-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} className="bg-slate-900 border-slate-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="staff@example.com" {...field} className="bg-slate-900 border-slate-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("state", "");
                    form.setValue("city", "");
                  }} defaultValue={field.value} disabled={fixedRole}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.filter(r => !fixedRole ? (r.value !== "PAPER_SETTER" || initialValues?.role === "PAPER_SETTER") : r.value === initialValues?.role).map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRole === "PAPER_SETTER" && (
              <FormField
                control={form.control}
                name="examId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Assign Exam</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing && !!initialValues?.examId}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select an exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam._id} value={exam._id}>
                            {exam.examTitle || exam.examCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(selectedRole === "STATE_MANAGER" || selectedRole === "CITY_MANAGER") && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("city", "");
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedRole === "CITY_MANAGER" && (
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedState && CITIES[selectedState] ? CITIES[selectedState].map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        )) : (
                          <SelectItem value="none" disabled>Select State first</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel} className="border-slate-700 hover:bg-slate-800">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
