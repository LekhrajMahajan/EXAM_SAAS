import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CreateRoleForm } from "../components/CreateRoleForm";
import { useRole, useUpdateRole } from "../hooks/role.hooks";
import type { CreateRoleFormValues } from "../schemas/role.schema";
import type { UpdateRolePayload } from "../api/role.api";

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: roleResponse, isLoading, isError } = useRole(id || "");
  const { mutate: updateRole, isPending } = useUpdateRole();

  const handleCancel = () => {
    navigate("/master-admin/access-management?tab=roles");
  };

  const handleSubmit = (values: CreateRoleFormValues) => {
    if (!id) return;

    const payload: UpdateRolePayload = {
      name: values.name,
      displayName: values.displayName,
      roleCode: values.roleCode,
      description: values.description,
      parentRole: values.parentRole === "none" ? null : values.parentRole,
      hierarchyLevel: values.hierarchyLevel,
      isSystem: values.isSystem,
      status: values.status,
    };

    updateRole({ id, payload }, {
      onSuccess: () => {
        // Success toast is handled by the hook itself
        navigate("/master-admin/access-management?tab=roles");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !roleResponse?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h2 className="text-xl font-semibold">Failed to load role</h2>
          <p className="text-slate-500">The role you are trying to edit could not be found.</p>
        </div>
        <Button onClick={handleCancel} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const role = roleResponse.data;

  // READ ONLY Display for certain fields
  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Role</h1>
          <p className="text-slate-500 mt-1">
            Modify the role details and hierarchy. System roles have restricted editing.
          </p>
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex gap-3 text-sm text-slate-600">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-slate-700 mb-1">Role Information</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <div><span className="text-slate-500">Role ID:</span> <span className="font-mono">{role._id}</span></div>
            <div><span className="text-slate-500">Created By:</span> {role.createdBy || 'System'}</div>
            <div><span className="text-slate-500">Created Date:</span> {new Date(role.createdAt).toLocaleDateString()}</div>
            <div>
              <span className="text-slate-500">Type:</span> 
              {role.isSystem ? (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  System Role
                </span>
              ) : (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Custom Role
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateRoleForm 
        onSubmit={handleSubmit} 
        isSubmitting={isPending} 
        onCancel={handleCancel} 
        isEditing={true}
        initialData={{
          ...role,
          parentRole: (role.parentRole as { _id?: string })?._id || role.parentRole || "none",
        }}
      />
    </div>
  );
};
