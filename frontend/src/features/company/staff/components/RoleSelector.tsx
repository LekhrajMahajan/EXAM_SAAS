import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import apiClient from "@/core/api/http/axios-client";
import { Copy, Plus, Loader2 } from "lucide-react";

interface RoleItem {
  _id: string;
  name: string;
  displayName?: string;
  roleCode: string;
  hierarchyLevel: number;
  description?: string;
}

export const RoleSelector = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState<string>("");

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get('/roles');
      const data = res.data?.data || [];
      setRoles(data);
    } catch {
      // Keep state clean on fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchRoles();
  };

  useEffect(() => {
    let isMounted = true;
    const loadRoles = async () => {
      try {
        const res = await apiClient.get('/roles');
        if (!isMounted) return;
        const data = res.data?.data || [];
        setRoles(data);
      } catch {
        // Ignore network errors on initial rendering
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadRoles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleClone = async (targetRole: RoleItem) => {
    if (!newRoleName.trim()) return;
    try {
      const newCode = newRoleName.trim().toUpperCase().replace(/\s+/g, "_");
      await apiClient.post(`/roles/${targetRole._id}/clone`, {
        newName: newRoleName.trim(),
        newRoleCode: newCode,
        newDescription: `Cloned from ${targetRole.displayName || targetRole.name}`,
      });
      setNewRoleName("");
      setCloningId(null);
      await fetchRoles();
    } catch {
      alert("Failed to clone role. Please ensure name and code are unique.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Enterprise Role Directory & Hierarchy</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Database-driven RBAC architecture. Clone existing system tiers to generate custom organizational roles.
          </p>
        </div>
        <Button size="sm" onClick={handleRefresh} variant="outline">
          Refresh Roles
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role) => (
              <div key={role._id} className="flex flex-col border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`role-${role._id}`}
                      checked={selectedRoleIds.includes(role._id)}
                      onCheckedChange={() => handleToggleRole(role._id)}
                    />
                    <label
                      htmlFor={`role-${role._id}`}
                      className="text-base font-semibold leading-none cursor-pointer"
                    >
                      {role.displayName || role.name}
                    </label>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    Level {role.hierarchyLevel || 10}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-7 mb-4">
                  {role.description || `Internal identifier: ${role.roleCode}`}
                </p>
                <div className="flex justify-end pt-2 border-t mt-auto">
                  {cloningId === role._id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="New Custom Role Name..."
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button size="sm" onClick={() => handleClone(role)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setCloningId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                      onClick={() => {
                        setCloningId(role._id);
                        setNewRoleName(`${role.displayName || role.name} Custom`);
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Clone Access Profile
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end border-t pt-4">
          <Button disabled={selectedRoleIds.length === 0 || loading}>
            Assign Selected Roles ({selectedRoleIds.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
