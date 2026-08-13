import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { useRole, useAssignPermissions } from "../hooks/role.hooks";
import { usePermissions } from "../hooks/permission.hooks";
import { useState, useEffect, useMemo } from "react";
import { PermissionMatrix } from "../components/permissions/PermissionMatrix";

export const AssignPermissionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: roleResponse, isLoading: isLoadingRole, isError: isRoleError } = useRole(id || "");
  const role = roleResponse?.data;

  // Fetch all permissions to build the matrix
  const { data: permissionsResponse, isLoading: isLoadingPermissions } = usePermissions({ limit: 1000 });
  const allPermissions = useMemo(() => permissionsResponse?.data || [], [permissionsResponse]);

  const { mutateAsync: assignPermissions, isPending: isAssigning } = useAssignPermissions();

  // State to hold currently selected permission IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(new Set());

  // Initialize selected IDs from the role's existing permissions
  useEffect(() => {
    if (role?.permissions && allPermissions.length > 0) {
      // role.permissions might be an array of strings (IDs) or objects if populated
      const currentIds = new Set(
        role.permissions.map((p: string | { _id: string }) => (typeof p === 'object' ? p._id : p))
      );
      // eslint-disable-next-line
      setSelectedIds(currentIds);
      // eslint-disable-next-line
      setInitialSelectedIds(currentIds);
    }
  }, [role, allPermissions]);

  if (isLoadingRole || isLoadingPermissions) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <Skeleton className="h-24 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isRoleError || !role) {
    return (
      <div className="max-w-7xl mx-auto space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>We couldn&apos;t fetch the role details at this time.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSelectionChange = (newSelected: Set<string>) => {
    setSelectedIds(newSelected);
  };

  const handleSave = async () => {
    try {
      await assignPermissions({ id: role._id, permissions: Array.from(selectedIds) });
      navigate(`/master-admin/access-management/roles/${role._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const addedCount = Array.from(selectedIds).filter(id => !initialSelectedIds.has(id)).length;
  const removedCount = Array.from(initialSelectedIds).filter(id => !selectedIds.has(id)).length;
  const hasChanges = addedCount > 0 || removedCount > 0;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/master-admin/access-management/roles/${role._id}`)}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assign Permissions</h1>
              {role.isSystem && (
                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                  <ShieldAlert className="w-3 h-3 mr-1" /> System Role
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1 text-sm">
              Managing permissions for <span className="font-semibold text-slate-700">{role.displayName}</span> ({role.roleCode})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/master-admin/access-management/roles/${role._id}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isAssigning || role.isSystem}>
            <Save className="w-4 h-4 mr-2" />
            {isAssigning ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {role.isSystem && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>System Role Protected</AlertTitle>
          <AlertDescription>
            You cannot modify permissions for system roles as they are critical for the platform&apos;s operation.
          </AlertDescription>
        </Alert>
      )}

      {hasChanges && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-blue-600" />
          <div className="flex-1 text-sm">
            You have unsaved changes to this role&apos;s permissions.
          </div>
          <div className="flex gap-2">
            {addedCount > 0 && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                +{addedCount} Added
              </Badge>
            )}
            {removedCount > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                -{removedCount} Removed
              </Badge>
            )}
          </div>
        </div>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Select the granular actions this role can perform across different modules.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Total Selected:</span>
              <Badge variant="secondary" className="px-3 py-1 text-sm">{selectedIds.size} / {allPermissions.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <PermissionMatrix
            allPermissions={allPermissions}
            selectedIds={selectedIds}
            onChange={handleSelectionChange}
            isReadonly={role.isSystem}
          />
        </CardContent>
      </Card>
    </div>
  );
};
