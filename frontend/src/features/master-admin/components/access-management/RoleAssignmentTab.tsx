import { useState } from "react";
import { useEmployees, useAssignEmployeeRole } from "../../hooks/employee.hooks";
import { useRoles } from "../../hooks/role.hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Shield, User, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

export const RoleAssignmentTab = () => {
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const { data: employeesResponse, isLoading: loadingEmployees } = useEmployees({
    page: 1,
    limit: 50,
    search: employeeSearch || undefined,
  });

  const { data: rolesResponse, isLoading: loadingRoles } = useRoles({
    page: 1,
    limit: 100,
  });

  const { mutate: assignRole, isPending: isAssigning } = useAssignEmployeeRole();

  const selectedEmployee = employeesResponse?.data?.find(e => e._id === selectedEmployeeId);
  const selectedRole = rolesResponse?.data?.find(r => r._id === selectedRoleId);

  const handleAssign = () => {
    if (!selectedEmployeeId || !selectedRoleId) return;
    assignRole(
      { id: selectedEmployeeId, role: selectedRoleId },
      {
        onSuccess: () => {
          setSelectedEmployeeId("");
          setSelectedRoleId("");
        }
      }
    );
  };

  return (
    <div className="pt-4 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Role Assignment</h2>
        <p className="text-slate-500">
          Assign system roles to users. Select a user and a role to view effective permissions before assigning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-500" /> User Selection
              </CardTitle>
              <CardDescription>Search and select the user you want to assign a role to.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Search User</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search by name, email or employee ID..." 
                    className="pl-9"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId} disabled={loadingEmployees}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEmployees ? "Loading..." : "Select a user"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employeesResponse?.data?.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployee && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <div className="text-sm">
                    <span className="font-semibold">Current Role:</span>{" "}
                    {typeof selectedEmployee.role === 'object' && selectedEmployee.role !== null 
                      ? (selectedEmployee.role as any).displayName || (selectedEmployee.role as any).name 
                      : (selectedEmployee.role || "No Role Assigned")}
                  </div>
                  <div className="text-sm text-slate-500">
                    Email: {selectedEmployee.email} <br/>
                    Status: <Badge variant="outline" className="ml-1">{selectedEmployee.status}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-500" /> Role Selection
              </CardTitle>
              <CardDescription>Select the role you want to assign to this user.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={loadingRoles}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingRoles ? "Loading..." : "Select a role"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesResponse?.data?.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6 px-6">
              <Button 
                onClick={handleAssign} 
                disabled={!selectedEmployeeId || !selectedRoleId || isAssigning}
                className="w-full"
              >
                {isAssigning ? "Assigning..." : "Assign Role"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                Effective Permissions Preview
              </CardTitle>
              <CardDescription>
                Review the permissions granted by the selected role.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!selectedRole ? (
                <div className="flex flex-col items-center justify-center text-center p-8 h-[300px] text-slate-500">
                  <Shield className="w-12 h-12 mb-4 text-slate-200" />
                  <p>Select a role to preview its permissions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-semibold text-lg text-slate-900">{selectedRole.displayName}</h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedRole.description}</p>
                  </div>
                  
                  {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {selectedRole.permissions.map((perm: any) => {
                        const permData = typeof perm === 'object' ? perm : { _id: perm, displayName: perm, module: 'Unknown', action: 'Unknown' };
                        return (
                          <div key={permData._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-100">
                            <div>
                              <div className="font-medium text-sm">{permData.displayName || permData.name}</div>
                              <div className="text-xs text-slate-500">{permData.module}</div>
                            </div>
                            <Badge variant="outline" className="bg-white">{permData.action}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500 italic bg-slate-50 rounded-md">
                      This role has no permissions assigned.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
