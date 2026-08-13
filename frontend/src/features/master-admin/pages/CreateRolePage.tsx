import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CreateRoleForm } from "../components/CreateRoleForm";
import { useCreateRole } from "../hooks/role.hooks";
import type { CreateRoleFormValues } from "../schemas/role.schema";
import type { CreateRolePayload } from "../api/role.api";

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const { mutate: createRole, isPending } = useCreateRole();

  const handleCancel = () => {
    navigate("/master-admin/access-management?tab=roles");
  };

  const handleSubmit = (values: CreateRoleFormValues) => {
    const payload: CreateRolePayload = {
      name: values.name,
      displayName: values.displayName,
      roleCode: values.roleCode,
      description: values.description,
      parentRole: values.parentRole,
      hierarchyLevel: values.hierarchyLevel,
      isSystem: values.isSystem,
      status: values.status,
    };

    createRole(payload, {
      onSuccess: () => {
        // Success toast is handled by the hook itself
        navigate("/master-admin/access-management?tab=roles");
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Role</h1>
          <p className="text-slate-500 mt-1">
            Add a new role to the system, define its hierarchy and configure base settings.
          </p>
        </div>
      </div>

      <CreateRoleForm 
        onSubmit={handleSubmit} 
        isSubmitting={isPending} 
        onCancel={handleCancel} 
      />
    </div>
  );
};
