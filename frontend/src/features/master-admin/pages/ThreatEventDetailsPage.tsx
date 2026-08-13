import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  MonitorSmartphone, 
  User as UserIcon,
  Activity,
  AlertTriangle,
  Info,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { PageLoader } from "@/shared/components/loading/LoadingComponents";
import { 
  useSecurityEventDetails, 
  useUpdateSecurityEventStatus,
  useAssignSecurityEvent
} from '../hooks/security.hooks';
import { EventSeverity, EventStatus } from '../types/security.types';

import { useAuth } from '@/features/auth/hooks';

export const ThreatEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Current logged-in user to assign to self

  const { data: eventData, isLoading } = useSecurityEventDetails(id as string);
  const updateStatusMutation = useUpdateSecurityEventStatus();
  const assignMutation = useAssignSecurityEvent();

  const event = eventData?.data;

  const handleStatusChange = (newStatus: EventStatus) => {
    if (!id) return;
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleAssignToMe = () => {
    if (!id || !user) return;
    assignMutation.mutate({ id, userId: user.id });
  };

  if (isLoading) return <PageLoader />;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The security event you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/master-admin/security/events')}>Back to Dashboard</Button>
      </div>
    );
  }

  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case EventSeverity.CRITICAL: return "bg-red-100 text-red-800 border-red-200";
      case EventSeverity.HIGH: return "bg-orange-100 text-orange-800 border-orange-200";
      case EventSeverity.MEDIUM: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case EventSeverity.LOW: return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: EventSeverity) => {
    switch (severity) {
      case EventSeverity.CRITICAL: return <AlertOctagon className="w-5 h-5 text-red-600" />;
      case EventSeverity.HIGH: return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case EventSeverity.MEDIUM: return <Activity className="w-5 h-5 text-yellow-600" />;
      case EventSeverity.LOW: return <Info className="w-5 h-5 text-blue-600" />;
      default: return <ShieldAlert className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.OPEN: return "bg-red-50 text-red-700 border-red-200";
      case EventStatus.INVESTIGATING: return "bg-amber-50 text-amber-700 border-amber-200";
      case EventStatus.RESOLVED: return "bg-green-50 text-green-700 border-green-200";
      case EventStatus.DISMISSED: return "bg-gray-50 text-gray-700 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/master-admin/security/events')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {getSeverityIcon(event.severity)}
            Event: {event.eventId}
          </h1>
          <p className="text-muted-foreground mt-1">
            Detected on {new Date(event.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge variant="outline" className={`px-3 py-1 ${getSeverityColor(event.severity)}`}>
            {event.severity} Risk
          </Badge>
          <Badge variant="outline" className={`px-3 py-1 ${getStatusColor(event.status)}`}>
            {event.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{event.eventType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-medium">{event.category}</div>
                </div>
                {event.recommendedAction && (
                  <div className="col-span-2 bg-blue-50/50 p-3 border border-blue-100 rounded-md">
                    <div className="text-sm text-blue-700 font-semibold mb-1 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Recommended Action
                    </div>
                    <div className="text-sm text-blue-800">{event.recommendedAction}</div>
                  </div>
                )}
              </div>

              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Technical Metadata</div>
                  <pre className="bg-gray-950 text-gray-50 p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident Management</CardTitle>
              <CardDescription>Manage response and resolution for this threat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium mb-1">Assigned To</div>
                  {event.assignedTo ? (
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      {event.assignedTo.firstName} {event.assignedTo.lastName} ({event.assignedTo.email})
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">Unassigned</div>
                  )}
                </div>
                {!event.assignedTo && event.status !== EventStatus.RESOLVED && (
                  <Button variant="outline" size="sm" onClick={handleAssignToMe} disabled={assignMutation.isPending}>
                    Assign to Me
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-3">Update Status</div>
                <div className="flex gap-2">
                  <Select 
                    value={event.status} 
                    onValueChange={(v) => handleStatusChange(v as EventStatus)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={EventStatus.INVESTIGATING}>Investigating</SelectItem>
                      <SelectItem value={EventStatus.RESOLVED}>Resolved</SelectItem>
                      <SelectItem value={EventStatus.DISMISSED}>Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Context & Actor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.userId && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.userId.firstName} {event.userId.lastName}</div>
                    <div className="text-xs text-muted-foreground">{event.userId.email}</div>
                    {event.userId.role && <Badge variant="secondary" className="mt-1 text-[10px]">{event.userId.role}</Badge>}
                  </div>
                </div>
              )}
              {event.companyId && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.companyId.name}</div>
                    <div className="text-xs text-muted-foreground">Company Context</div>
                  </div>
                </div>
              )}
              {event.ipAddress && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.ipAddress}</div>
                    <div className="text-xs text-muted-foreground">{event.location || 'Unknown Location'}</div>
                  </div>
                </div>
              )}
              {(event.device || event.browser || event.operatingSystem) && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-full">
                    <MonitorSmartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.device || 'Unknown Device'}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.browser || 'Unknown'} on {event.operatingSystem || 'Unknown'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
