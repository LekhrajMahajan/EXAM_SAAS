import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Shield, Briefcase, Mail, MapPin, Phone, Activity, History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useEmployee, useEmployeeLoginHistory, useEmployeeActivity } from "../hooks/employee.hooks";
import { useEffect, useState } from "react";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";

export const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employeeRes, isLoading, isError, refetch } = useEmployee(id!);


  const [activityPage, setActivityPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);

  const { data: loginHistoryRes } = useEmployeeLoginHistory(id!, { page: loginPage, limit: 10 });
  const { data: activityRes } = useEmployeeActivity(id!, { page: activityPage, limit: 10 });

  // Audit log mock-up / execution side effect
  useEffect(() => {
    if (employeeRes?.data) {
      // e.g. auditLogApi.log({ action: 'VIEW', target: id })
    }
  }, [employeeRes, id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-1/3" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !employeeRes?.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/master-admin/access-management?tab=users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to System Users
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error Loading User</AlertTitle>
          <AlertDescription>We couldn&apos;t fetch the user details at this time.</AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">Retry</Button>
      </div>
    );
  }

  const employee = employeeRes.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userObj: any = employee.userId || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyObj: any = employee.companyId || {};

  const firstName = employee.firstName || userObj.firstName || '';
  const lastName = employee.lastName || userObj.lastName || '';
  const middleName = employee.middleName || userObj.middleName || '';
  const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();
  const email = employee.email || userObj.email || 'N/A';
  const phone = employee.phone || userObj.mobileNumber || 'N/A';
  const role = userObj.role || employee.role || 'N/A';
  const status = employee.status || userObj.status || 'UNKNOWN';
  const profileImage = employee.profileImage || userObj.profileImage;

  const getInitials = (fName: string, lName: string) => {
    return `${fName?.[0] || ""}${lName?.[0] || ""}`.toUpperCase();
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-[#E4FD97] text-[#2D3E2C] border-[#E4FD97]";
      case "INACTIVE": return "bg-gray-100 text-gray-800 border-gray-200";
      case "SUSPENDED": return "bg-red-100 text-red-800 border-red-200";
      case "TERMINATED": return "bg-zinc-100 text-zinc-800 border-zinc-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/master-admin/access-management?tab=users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User Details</h2>
            <p className="text-muted-foreground">View complete system user profile and access controls.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/master-admin/access-management/users/${id}/activity`)}>
            <History className="mr-2 h-4 w-4" />
            Activity Logs
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-muted">
              <AvatarImage src={profileImage} />
              <AvatarFallback className="text-2xl">{getInitials(firstName, lastName)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{fullName || 'Unknown User'}</h3>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  ID: {employee.employeeCode}
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Role: {role}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {email}
                </div>
              </div>
            </div>

            <div className="text-sm text-right space-y-1">
              <div>
                <span className="text-muted-foreground">Company: </span>
                <span className="font-medium">{companyObj.companyName || companyObj.legalName || (typeof employee.companyId === 'string' ? employee.companyId : 'N/A')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Department: </span>
                <span className="font-medium">{employee.department || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created: </span>
                <span className="font-medium">{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Overview</TabsTrigger>
          <TabsTrigger value="employment" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Employment</TabsTrigger>
          <TabsTrigger value="contact" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Contact</TabsTrigger>
          <TabsTrigger value="access" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Access Controls</TabsTrigger>
          <TabsTrigger value="permissions" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Permissions</TabsTrigger>
          <TabsTrigger value="loginHistory" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Login History</TabsTrigger>
          <TabsTrigger value="activity" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3">Recent Activities</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* OVERVIEW */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                  <div className="font-medium">{fullName || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gender</div>
                  <div className="font-medium">{employee.gender || 'Not Specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date of Birth</div>
                  <div className="font-medium">{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'Not Specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Profile Photo</div>
                  <div className="font-medium">{profileImage ? 'Uploaded' : 'No Photo'}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMPLOYMENT */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Company</div>
                  <div className="font-medium">{companyObj.companyName || companyObj.legalName || (typeof employee.companyId === 'string' ? employee.companyId : 'N/A')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Branch</div>
                  <div className="font-medium">{typeof employee.branchId === 'object' ? (employee.branchId as Record<string, unknown>)?.name as string : employee.branchId || 'Head Office'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Department</div>
                  <div className="font-medium">{employee.department || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Designation</div>
                  <div className="font-medium">{employee.designation || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Employee ID</div>
                  <div className="font-medium">{employee.employeeCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Joining Date</div>
                  <div className="font-medium">{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Reporting Manager</div>
                  <div className="font-medium">{employee.reportingManager || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Primary Email</div>
                  <div className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {email}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Primary Mobile</div>
                  <div className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {phone}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Alternate Mobile</div>
                  <div className="font-medium">{employee.alternateMobile || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Address</div>
                  <div className="font-medium">{employee.address || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">City</div>
                  <div className="font-medium">{employee.city || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">State</div>
                  <div className="font-medium">{employee.state || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Country</div>
                  <div className="font-medium">{employee.country || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">PIN Code</div>
                  <div className="font-medium">{employee.pincode || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACCESS */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  System Access
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Username</div>
                  <div className="font-medium">{employee.username || userObj.username || 'Not configured'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Login Email</div>
                  <div className="font-medium">{email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Account Status</div>
                  <div className="font-medium">{status}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">System Role</div>
                  <div className="font-medium">{role}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Login</div>
                  <div className="font-medium">{userObj.lastLoginAt ? new Date(userObj.lastLoginAt).toLocaleString() : 'Never'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Password Last Changed</div>
                  <div className="font-medium">N/A</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PERMISSIONS */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  Role & Permissions Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="text-sm text-muted-foreground mb-1">Assigned Role</div>
                    <div className="text-xl font-bold">{role}</div>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="text-sm text-muted-foreground mb-1">Inherited Permissions</div>
                    <div className="text-xl font-bold">Standard</div>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="text-sm text-muted-foreground mb-1">Permission Count</div>
                    <div className="text-xl font-bold">Dynamic</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGIN HISTORY */}
          <TabsContent value="loginHistory">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <GenericDataTable
                    columns={[
                      { id: "device", header: "Device", accessorKey: "device" },
                      { id: "ipAddress", header: "IP Address", accessorKey: "ipAddress" },
                      { 
                        id: "loginAt", 
                        header: "Login Time", 
                        accessorKey: "loginAt",
                        cell: ({ row }) => new Date(row.loginAt).toLocaleString()
                      },
                      { 
                        id: "status", 
                        header: "Status", 
                        accessorKey: "status",
                        cell: ({ row }) => <Badge variant={row.status === 'SUCCESS' ? 'default' : 'destructive'}>{row.status}</Badge>
                      }
                    ]}
                    data={loginHistoryRes?.data || []}
                    keyExtractor={(item: any) => item._id}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RECENT ACTIVITIES */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <GenericDataTable
                    columns={[
                      { id: "action", header: "Action", accessorKey: "action" },
                      { id: "module", header: "Module", accessorKey: "module" },
                      { id: "description", header: "Description", accessorKey: "description" },
                      { 
                        id: "createdAt", 
                        header: "Date", 
                        accessorKey: "createdAt",
                        cell: ({ row }) => new Date(row.createdAt).toLocaleString()
                      }
                    ]}
                    data={activityRes?.data || []}
                    keyExtractor={(item: any) => item._id}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

    </div>
  );
};
