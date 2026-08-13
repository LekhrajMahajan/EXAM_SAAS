import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  Activity,
  AlertOctagon,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { MasterAdminStatCard } from "../components/cards/MasterAdminStatCard";
import { PageLoader } from "@/shared/components/loading/LoadingComponents";
import { useSecurityEvents, useSecurityEventStatistics } from '../hooks/security.hooks';
import { useNavigate } from 'react-router-dom';
import { EventSeverity, EventStatus } from '../types/security.types';
import type { ISecurityEventFilters, ISecurityEvent } from '../types/security.types';


export const ThreatDashboardPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ISecurityEventFilters>({
    severity: 'All',
    status: 'All',
    category: 'All',
    search: ''
  });

  const { data: statsData, isLoading: isStatsLoading } = useSecurityEventStatistics();
  const { data: eventsData, isLoading: isEventsLoading } = useSecurityEvents(filters, page, 20);

  const stats = statsData?.data;
  const events = eventsData?.data?.data || [];
  const pagination = eventsData?.data?.pagination;

  const handleFilterChange = (key: keyof ISecurityEventFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // reset to first page on filter change
  };

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
      case EventSeverity.CRITICAL: return <AlertOctagon className="w-4 h-4 mr-1 text-red-600" />;
      case EventSeverity.HIGH: return <AlertTriangle className="w-4 h-4 mr-1 text-orange-600" />;
      case EventSeverity.MEDIUM: return <Activity className="w-4 h-4 mr-1 text-yellow-600" />;
      case EventSeverity.LOW: return <Info className="w-4 h-4 mr-1 text-blue-600" />;
      default: return <Shield className="w-4 h-4 mr-1 text-gray-600" />;
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

  if (isStatsLoading) return <PageLoader />;

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Threat Detection</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and respond to security events, anomalies, and active threats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MasterAdminStatCard
          title="Critical Alerts"
          value={stats?.criticalAlerts || 0}
          icon={ShieldAlert}
          accent="red"
          description="Requires immediate attention"
        />
        
        <MasterAdminStatCard
          title="Active Threats"
          value={stats?.activeThreats || 0}
          icon={Activity}
          accent="amber"
          description="Open and investigating"
        />

        <MasterAdminStatCard
          title="Resolved Threats"
          value={stats?.resolvedThreats || 0}
          icon={CheckCircle}
          accent="green"
          description="Successfully mitigated"
        />

        <MasterAdminStatCard
          title="Events Today"
          value={stats?.eventsToday || 0}
          icon={Clock}
          accent="slate"
          description="Last 24 hours"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Security Events Log</CardTitle>
          <CardDescription>Comprehensive log of all detected security incidents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Event ID or IP..." 
                className="pl-9 bg-muted/50 border-border"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.severity} onValueChange={(val) => handleFilterChange('severity', val)}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  {Object.values(EventSeverity).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {Object.values(EventStatus).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>User / IP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Detected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isEventsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No security events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event: ISecurityEvent) => (
                    <TableRow key={event._id} className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/master-admin/security/events/${event._id}`)}>
                      <TableCell className="font-mono text-xs">{event.eventId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex items-center w-fit ${getSeverityColor(event.severity)}`}>
                          {getSeverityIcon(event.severity)}
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{event.eventType}</TableCell>
                      <TableCell>
                        {event.userId ? (
                          <div className="text-sm">{event.userId.email}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground">System</div>
                        )}
                        {event.ipAddress && <div className="text-xs text-muted-foreground">{event.ipAddress}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/master-admin/security/events/${event._id}`); }}>
                          Details
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
