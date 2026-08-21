import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreateUserForm } from "../components/system-users/CreateUserForm";
import { useEmployee, useUpdateEmployee } from "../hooks/employee.hooks";
import type { EditUserFormValues } from "../schemas/user.schema";

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: employeeResponse, isLoading, isError, refetch } = useEmployee(id as string);
  const { mutate: updateUser, isPending } = useUpdateEmployee();

  const employee = employeeResponse?.data;

  const handleCancel = () => {
    navigate("/master-admin/access-management?tab=users");
  };

  const handleSubmit = (values: EditUserFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      ...values,
    };

    updateUser({ id: id as string, payload }, {
      onSuccess: () => {
        toast({
          title: "User Updated",
          description: "System user was successfully updated.",
          variant: "default",
        });
        navigate("/master-admin/access-management?tab=users");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Failed to update user. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Failed to load user details.</div>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  // Pre-fill initial data
  const initialData = {
    firstName: employee.firstName || "",
    middleName: employee.middleName || "",
    lastName: employee.lastName || "",
    email: employee.email || "",
    phone: employee.phone || "",
    alternateMobile: employee.alternateMobile || "",
    address: employee.address || "",
    city: employee.city || "",
    state: employee.state || "",
    country: employee.country || "India",
    pincode: employee.pincode || "",
    employeeCode: employee.employeeCode || "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    companyId: typeof employee.companyId === 'object' ? (employee.companyId as any)._id : employee.companyId || "",
    department: employee.department || "",
    designation: employee.designation || "",
    joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    role: (employee.userId as any)?.role || employee.role || "",
    status: employee.status || "ACTIVE",
    username: employee.username || "",
    gender: employee.gender || "",
    dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : "",
    profileImage: employee.profileImage || "",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit System User</h2>
            <p className="text-muted-foreground">
              Modify the details of the system user.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CreateUserForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            onCancel={handleCancel}
            isEdit={true}
            initialData={initialData}
          />
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 font-semibold">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                Read Only Details
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium">{employee._id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Created Date</span>
                  <span className="font-medium">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
