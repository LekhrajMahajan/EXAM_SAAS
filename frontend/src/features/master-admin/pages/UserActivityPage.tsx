import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Clock, History, Search } from "lucide-react";
import { useEmployee, useEmployeeLoginHistory, useEmployeeActivity } from "../hooks/employee.hooks";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { GenericTimeline } from "@/shared/components/timeline/GenericTimeline";
import type { TableColumn } from "@/shared/types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";

export const UserActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login-history");
  
  // Login History State
  const [loginPage, setLoginPage] = useState(0);
  const [loginPageSize, setLoginPageSize] = useState(10);
  const [loginFilters] = useState<any>({});

  // Activity Timeline State
  const [activityPage, setActivityPage] = useState(0);
  const [activityPageSize, setActivityPageSize] = useState(10);
  const [activityFilters] = useState<any>({});

  const { data: employeeData, isLoading: isLoadingUser } = useEmployee(id!);
  const employee = employeeData?.data;

  const { data: loginHistoryRes, isLoading: isLoadingLogin } = useEmployeeLoginHistory(id!, {
    page: loginPage + 1,
    limit: loginPageSize,
    ...loginFilters
  });

  const { data: activityRes, isLoading: isLoadingActivity } = useEmployeeActivity(id!, {
    page: activityPage + 1,
    limit: activityPageSize,
    ...activityFilters
  });

  const loginColumns: TableColumn<any>[] = [
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <Badge variant={row.action === "LOGIN" ? "default" : "secondary"}>
          {row.action}
        </Badge>
      )
    },
    {
      id: "timestamp",
      header: "Date & Time",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      )
    },
    {
      id: "ip",
      header: "IP Address",
      accessorKey: "ipAddress",
      cell: ({ row }) => <span className="text-sm font-mono text-slate-500">{row.ipAddress || "N/A"}</span>
    },
    {
      id: "device",
      header: "Device / OS",
      accessorKey: "deviceType",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {row.deviceType || "Unknown"} / {row.operatingSystem || "Unknown"}
        </span>
      )
    },
    {
      id: "browser",
      header: "Browser",
      accessorKey: "browser",
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.browser || "Unknown"}</span>
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge variant={row.status === "SUCCESS" ? "default" : "destructive"}>
          {row.status}
        </Badge>
      )
    }
  ];

  const mapToTimeline = (logs: any[]) => {
    return logs.map(log => {
      let icon = "Activity";
      let status: any = "default";
      
      switch (log.action) {
        case "LOGIN": icon = "LogIn"; status = "success"; break;
        case "LOGOUT": icon = "LogOut"; status = "default"; break;
        case "PASSWORD_CHANGE": icon = "Key"; status = "warning"; break;
        case "UPDATE": icon = "Edit"; status = "info"; break;
        case "CREATE": icon = "Plus"; status = "success"; break;
      }

      if (log.status === "FAILED") status = "error";

      return {
        id: log._id,
        title: log.action,
        description: log.description,
        timestamp: new Date(log.createdAt).toLocaleString(),
        icon,
        status,
        metadata: {
          IP: log.ipAddress || "N/A",
          Module: log.module,
          Status: log.status
        }
      };
    });
  };

  if (isLoadingUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Activity</h1>
          <p className="text-slate-500 mt-1">
            Viewing history for {(employee?.userId as any)?.firstName || employee?.firstName} {(employee?.userId as any)?.lastName || employee?.lastName} ({employee?.employeeCode})
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="login-history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Login History
          </TabsTrigger>
          <TabsTrigger value="activity-timeline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login-history">
          <Card>
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
              <CardDescription>A complete history of authentication events for this user.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogin ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : (
                <>
                  <GenericDataTable
                    data={loginHistoryRes?.data || []}
                    columns={loginColumns}
                    keyExtractor={(item) => item._id}
                  />
                  {loginHistoryRes?.pagination && loginHistoryRes.pagination.total > 0 ? (
                    <div className="mt-4">
                      <GenericPagination
                        pageIndex={loginPage}
                        pageSize={loginPageSize}
                        totalCount={loginHistoryRes.pagination.total}
                        onPageChange={setLoginPage}
                        onPageSizeChange={(size) => { setLoginPageSize(size); setLoginPage(0); }}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity-timeline">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Chronological timeline of actions performed by this user.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                activityRes?.data?.length ? (
                  <>
                    <GenericTimeline items={mapToTimeline(activityRes.data)} />
                    {activityRes?.pagination && activityRes.pagination.total > activityPageSize && (
                      <div className="mt-6 flex justify-center">
                        <GenericPagination
                          pageIndex={activityPage}
                          pageSize={activityPageSize}
                          totalCount={activityRes.pagination.total}
                          onPageChange={setActivityPage}
                          onPageSizeChange={(size) => { setActivityPageSize(size); setActivityPage(0); }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No Activity Found</h3>
                    <p>There are no activity logs available for this user.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
