import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Activity, Settings, History, Info, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useRole } from "../hooks/role.hooks";
import { usePermissions } from "../hooks/permission.hooks";
import { useEffect } from "react";

export const RoleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: roleResponse, isLoading: isLoadingRole, isError, refetch } = useRole(id || "");
  const role = roleResponse?.data;

  const { data: permissionsRes } = usePermissions({ page: 1, limit: 500 });
  const allPermissions = permissionsRes?.data || [];
  
  const rolePermissions = allPermissions.filter(p => role?.permissions?.includes(p._id));
  const groupedPermissions = rolePermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>);
  
  // Simulate Audit log
  useEffect(() => {
    if (role) {
      console.warn(`[AUDIT] Role Viewed: ${role.name} by CurrentUser at ${new Date().toISOString()}`);
    }
  }, [role]);

  if (isLoadingRole) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <Skeleton className="h-24 w-1/2" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="max-w-7xl mx-auto space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error Loading Role</AlertTitle>
          <AlertDescription>We couldn&apos;t fetch the role details at this time.</AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">Retry</Button>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{role.displayName}</h1>
              {role.isSystem && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <ShieldCheck className="w-3 h-3 mr-1" /> System Role
                </Badge>
              )}
              <Badge variant={role.status === "ACTIVE" ? "default" : "secondary"}>
                {role.status}
              </Badge>
            </div>
            <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700">{role.roleCode}</span>
              <span>•</span>
              <span>Level {role.hierarchyLevel}</span>

            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 mb-6 border w-full justify-start h-auto flex-wrap">
          <TabsTrigger value="overview" className="py-2.5 px-4"><Info className="w-4 h-4 mr-2"/> Overview</TabsTrigger>
          <TabsTrigger value="permissions" className="py-2.5 px-4"><ShieldCheck className="w-4 h-4 mr-2"/> Permissions</TabsTrigger>
          <TabsTrigger value="activity" className="py-2.5 px-4"><Activity className="w-4 h-4 mr-2"/> Activity Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Role Name (Internal)</div>
                <div className="text-slate-900 font-medium">{role.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Display Name</div>
                <div className="text-slate-900 font-medium">{role.displayName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Role Code</div>
                <div className="text-slate-900 font-medium font-mono">{role.roleCode}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Role Type</div>
                <div className="text-slate-900 font-medium">{role.isSystem ? 'System Protected' : 'Custom'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-slate-500 mb-1">Description</div>
                <div className="text-slate-900 bg-slate-50 p-4 rounded-md border text-sm">
                  {role.description || "No description provided."}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Created Date</div>
                <div className="text-slate-900 font-medium">{new Date(role.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Created By</div>
                <div className="text-slate-900 font-medium">{role.createdBy || 'System'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Last Updated</div>
                <div className="text-slate-900 font-medium">{new Date(role.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Updated By</div>
                <div className="text-slate-900 font-medium">{role.updatedBy || '—'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Permissions associated with this role, grouped by module.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedPermissions).length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-md border border-dashed">
                  No permissions assigned to this role yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([module, perms]) => (
                    <div key={module} className="border rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b font-semibold text-slate-700 capitalize">
                        {module.replace(/_/g, ' ')} Module
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {perms.map(perm => (
                          <div key={perm._id} className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-slate-800">{perm.displayName}</div>
                              <div className="text-xs text-slate-500">{perm.action}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Recent changes and events related to this role.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <History className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900">Role Created</div>
                      <time className="text-xs font-medium text-slate-500">{new Date(role.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-sm text-slate-600">Role was initially created by {role.createdBy || 'System'}.</div>
                  </div>
                </div>

                {role.updatedAt !== role.createdAt && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900">Role Updated</div>
                        <time className="text-xs font-medium text-slate-500">{new Date(role.updatedAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-sm text-slate-600">Role configurations were modified.</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => navigate(`/master-admin/activity-logs?search=${encodeURIComponent(role.displayName)}`)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
