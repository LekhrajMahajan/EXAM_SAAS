import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreateUserForm } from "../components/system-users/CreateUserForm";
import { useCreateEmployee } from "../hooks/employee.hooks";
import type { CreateUserFormValues } from "../schemas/user.schema";

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createUser, isPending } = useCreateEmployee();

  const handleCancel = () => {
    navigate("/master-admin/access-management?tab=users");
  };

  const handleSubmit = (values: CreateUserFormValues) => {
    // The backend uses employee API to create system users (since they are essentially employees)
    // Map our form values to the CreateEmployeePayload format expected by the backend
    const payload = {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      alternateMobile: values.alternateMobile,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      employeeCode: values.employeeCode,
      companyId: values.companyId,
      branchId: values.branchId,
      department: values.department,
      designation: values.designation,
      joiningDate: values.joiningDate,
      role: values.role, // the schema maps this to role
      status: values.status,
      username: values.username,
      password: values.password,
      gender: values.gender,
      dob: values.dob,
      profileImage: values.profileImage,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createUser(payload as any, {
      onSuccess: () => {
        toast({
          title: "User Created",
          description: "System user was successfully created.",
          variant: "default",
        });
        navigate("/master-admin/access-management?tab=users");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Failed to create user. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create System User</h1>
          <p className="text-slate-500 mt-1">
            Add a new user, specify their details, and assign access roles.
          </p>
        </div>
      </div>

      <CreateUserForm 
        onSubmit={handleSubmit} 
        isSubmitting={isPending} 
        onCancel={handleCancel} 
      />
    </div>
  );
};
