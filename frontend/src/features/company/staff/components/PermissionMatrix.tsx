import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import apiClient from "@/core/api/http/axios-client";
import { Loader2, ShieldCheck } from "lucide-react";

interface PermissionDoc {
  _id: string;
  name: string;
  displayName?: string;
  module: string;
  action: string;
  description?: string;
}

interface RoleDoc {
  _id: string;
  name: string;
  displayName?: string;
  roleCode: string;
}

export const PermissionMatrix = () => {
  const [roles, setRoles] = useState<RoleDoc[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [permissions, setPermissions] = useState<PermissionDoc[]>([]);
  const [assignedPermIds, setAssignedPermIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          apiClient.get('/roles'),
          apiClient.get('/permissions')
        ]);
        if (!isMounted) return;
        const loadedRoles = rolesRes.data?.data || [];
        const loadedPerms = permsRes.data?.data || [];
        setRoles(loadedRoles);
        setPermissions(loadedPerms);
        if (loadedRoles.length > 0) {
          setSelectedRoleId((prev) => prev || loadedRoles[0]._id);
        }
      } catch {
        // Ignore network errors on initial rendering
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    let isMounted = true;
    const loadPermissions = async () => {
      try {
        const res = await apiClient.get(`/roles/${selectedRoleId}/permissions`);
        if (!isMounted) return;
        const assigned = res.data?.data || [];
        const ids = assigned.map((p: Record<string, string>) => p._id || p.permissionId);
        setAssignedPermIds(ids);
      } catch {
        if (isMounted) setAssignedPermIds([]);
      }
    };
    loadPermissions();
    return () => {
      isMounted = false;
    };
  }, [selectedRoleId]);

  const handleToggle = (permId: string) => {
    setAssignedPermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      await apiClient.post(`/roles/${selectedRoleId}/permissions/assign`, {
        permissionIds: assignedPermIds,
      });
      alert("Permission matrix saved and RBAC cache invalidated successfully!");
    } catch {
      alert("Error saving permissions.");
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by module
  const modules = Array.from(new Set(permissions.map((p) => p.module))).sort();
  const actions = ["VIEW", "CREATE", "UPDATE", "DELETE", "MANAGE"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            Dynamic Access & Permission Matrix
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure fine-grained module permissions per role. Changes take effect instantly in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Target Role:</span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="px-3 py-1.5 border rounded-md text-sm bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.displayName || r.name} ({r.roleCode})
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-6 border rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow>
                    <TableHead className="w-[220px] font-bold">Module / Domain</TableHead>
                    {actions.map((act) => (
                      <TableHead key={act} className="text-center font-bold">{act}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((moduleName) => (
                    <TableRow key={moduleName}>
                      <TableCell className="font-semibold py-3 bg-slate-50/50 dark:bg-slate-900/50">
                        {moduleName}
                      </TableCell>
                      {actions.map((act) => {
                        const targetPerm = permissions.find(
                          (p) => p.module === moduleName && p.action === act
                        );
                        if (!targetPerm) {
                          return <TableCell key={act} className="text-center text-slate-300">—</TableCell>;
                        }
                        const isChecked = assignedPermIds.includes(targetPerm._id);
                        return (
                          <TableCell key={act} className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Checkbox
                                id={`matrix-${targetPerm._id}`}
                                checked={isChecked}
                                onCheckedChange={() => handleToggle(targetPerm._id)}
                              />
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {targetPerm.name}
                              </span>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground">
                Assigned: <strong>{assignedPermIds.length}</strong> of {permissions.length} granular permissions
              </span>
              <Button onClick={handleSave} disabled={saving || !selectedRoleId}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Permission Matrix
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
