import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Loader2 } from "lucide-react";
import { createUserSchema, editUserSchema, type CreateUserFormValues, type EditUserFormValues } from "../../schemas/user.schema";
import { useCompanies } from "../../hooks/company.hooks";
import { useBranches } from "../../hooks/branch.hooks";
import { useRoles } from "../../hooks/role.hooks";

interface CreateUserFormProps {
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  isEdit?: boolean;
  initialData?: any;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit, isSubmitting, onCancel, isEdit = false, initialData }) => {
  const form = useForm<any>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: initialData || {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      alternateMobile: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      employeeCode: "",
      companyId: "",
      branchId: "",
      department: "",
      designation: "",
      joiningDate: new Date().toISOString().split("T")[0],
      role: "",
      status: "ACTIVE",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: companiesResponse, isLoading: isLoadingCompanies } = useCompanies({ page: 1, limit: 100 });
  const companies = companiesResponse?.data || [];

  const selectedCompanyId = form.watch("companyId");
  
  const { data: branchesResponse, isLoading: isLoadingBranches } = useBranches({ 
    page: 1,
    limit: 100,
    companyId: selectedCompanyId || undefined 
  });
  const branches = Array.isArray(branchesResponse?.data) ? branchesResponse.data : ((branchesResponse?.data as any)?.data || []);

  const { data: rolesResponse, isLoading: isLoadingRoles } = useRoles({ page: 1, limit: 50 });
  const roles = rolesResponse?.data || [];

  // Reset branch if company changes
  useEffect(() => {
    const subscription = form.watch((_, { name, type }) => {
      if (name === "companyId" && type === "change") {
        form.setValue("branchId", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Personal Information */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Personal Information</CardTitle>
            <CardDescription>Basic details of the user.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="William" {...field} />
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
                  <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Contact Information</CardTitle>
            <CardDescription>How the user can be reached.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Login ID) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                  <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" maxLength={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543211" maxLength={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
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
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Maharashtra" {...field} />
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
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="400001" maxLength={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Employment */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Employment Details</CardTitle>
            <CardDescription>Company mapping and job specifics.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="employeeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="EMP001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCompanies}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCompanies ? "Loading..." : "Select Company"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={!selectedCompanyId || isLoadingBranches}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedCompanyId ? "Select Company First" : isLoadingBranches ? "Loading..." : "Select Branch"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joiningDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Access & Security */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Access & Security</CardTitle>
            <CardDescription>Authentication and permissions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRoles}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRoles ? "Loading..." : "Select Role"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role._id} value={role.name}>
                          {role.displayName || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to login via email only.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden md:block"></div>
            {!isEdit && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Update System User" : "Create System User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
