import React from 'react';
import type { ExecutiveDashboardData } from '../types/analytics.types';
import { 
 Activity, 
 ShieldCheck, 
 TrendingUp, 
 Users, 
 AlertTriangle, 
 CheckCircle2, 
 Clock, 
 Server, 
 MapPin, 
 DollarSign, FileText, Award 
} from 'lucide-react';

interface ExecutiveDashboardViewProps {
 data: ExecutiveDashboardData | null;
 onDrillDown: (category: string) => void;
 loading?: boolean;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
 data,
 onDrillDown,
 loading = false
}) => {
 if (loading) {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
 {[...Array(8)].map((_, i) => (
 <div key={i} className="h-36 bg-secondary/50 rounded-xl border border-border/60" />
 ))}
 </div>
 );
 }

 if (!data) {
 return (
 <div className="p-8 text-center bg-card/40 rounded-xl border border-border">
 <p className="text-muted-foreground">No analytics data available for the selected parameters.</p>
 </div>
 );
 }

 const {
 organizationHealth,
 todaysOperations,
 infrastructureHealth,
 revenueSummary,
 alertsAndNotifications,
 liveActivities,
 } = data;

 return (
 <div className="space-y-6">
 {/* Top Banner: Org Health & Trust Index */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div 
 onClick={() => onDrillDown('SYSTEM')}
 className="lg:col-span-2 relative overflow-hidden bg-card p-6 rounded-2xl border border-border shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-pointer group"
 >
 <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
 <div className="flex items-start justify-between relative z-10">
 <div>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
 <Activity className="w-3.5 h-3.5 animate-pulse text-primary" />
 Enterprise Organization Health
 </span>
 <h3 className="text-3xl font-extrabold text-foreground mt-3 tracking-tight">
 {organizationHealth.score}% <span className="text-sm font-medium text-muted-foreground ml-2">Overall Operations Score</span>
 </h3>
 <p className="text-muted-foreground text-sm mt-2 max-w-lg">
 System uptime is running at an optimal <strong className="text-primary ">{(organizationHealth.uptime / 3600).toFixed(1)} hrs</strong> today. All regional centers and database pipelines are responding within SLA targets.
 </p>
 </div>
 <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
 <ShieldCheck className="w-10 h-10" />
 </div>
 </div>
 <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/80 text-sm">
 <div>
 <span className="block text-xs text-muted-foreground font-medium">System Status</span>
 <span className="font-semibold text-primary flex items-center gap-1 mt-0.5">
 <CheckCircle2 className="w-4 h-4" /> {organizationHealth.systemHealth}
 </span>
 </div>
 <div>
 <span className="block text-xs text-muted-foreground font-medium">Branch Readiness</span>
 <span className="font-semibold text-foreground mt-0.5 block">{infrastructureHealth.branchHealthAverage}% Verified</span>
 </div>
 <div>
 <span className="block text-xs text-muted-foreground font-medium">Active Centers</span>
 <span className="font-semibold text-primary mt-0.5 block">{infrastructureHealth.activeCenters} Online</span>
 </div>
 </div>
 </div>

 {/* Real-time Live Activities Card */}
 <div 
 onClick={() => onDrillDown('LIVE')}
 className="bg-gradient-to-br from-card via-card to-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-2xl hover:border-emerald-400 /50 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
 >
 <div>
 <div className="flex items-center justify-between">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-emerald-500/20">
 <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
 Live Telemetry
 </span>
 <span className="text-xs text-muted-foreground font-medium">Auto-refresh</span>
 </div>
 <h4 className="text-2xl font-extrabold text-foreground mt-4">
 {liveActivities.connectedCandidates.toLocaleString()}
 <span className="block text-xs font-normal text-muted-foreground mt-1">Concurrent Connected Candidates</span>
 </h4>
 </div>
 
 <div className="space-y-3 mt-6">
 <div className="flex justify-between items-center p-2.5 bg-secondary/50 rounded-lg border border-border">
 <span className="text-xs text-secondary-foreground flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-primary " /> Active Exams Monitored
 </span>
 <span className="font-bold text-foreground text-sm">{liveActivities.activeExamsMonitored}</span>
 </div>
 <div className="flex justify-between items-center p-2.5 bg-secondary/50 rounded-lg border border-border">
 <span className="text-xs text-secondary-foreground flex items-center gap-1.5">
 <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 " /> Avg Candidate Trust
 </span>
 <span className="font-bold text-primary text-sm">{liveActivities.averageTrustScore}%</span>
 </div>
 </div>
 </div>
 </div>

 {/* Grid of Key Metrics */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Today's Operations Card */}
 <div 
 onClick={() => onDrillDown('EXAM')}
 className="bg-card p-5 rounded-xl border border-border hover:border-slate-400  transition-all duration-200 cursor-pointer shadow-lg"
 >
 <div className="flex justify-between items-center text-muted-foreground mb-2">
 <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Exams</span>
 <Server className="w-4 h-4 text-primary " />
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-bold text-foreground">{todaysOperations.runningExams}</span>
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary ">In Progress</span>
 </div>
 <div className="mt-3 text-xs text-muted-foreground flex justify-between pt-2 border-t border-border">
 <span>Upcoming: <strong className="text-foreground">{todaysOperations.upcomingExams}</strong></span>
 <span>Completed: <strong className="text-foreground">{todaysOperations.completedExams}</strong></span>
 </div>
 </div>

 {/* Total Results */}
 <div 
 onClick={() => onDrillDown('EXAM')}
 className="bg-card p-5 rounded-xl border border-border hover:border-slate-400  transition-all duration-200 cursor-pointer shadow-lg"
 >
 <div className="flex justify-between items-center text-muted-foreground mb-2">
 <span className="text-xs font-bold uppercase tracking-wider">Total Results</span>
 <FileText className="w-4 h-4 text-primary " />
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-bold text-foreground">{(data?.detailedData?.results as any)?.totalResultsEvaluated || 0}</span>
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary ">Evaluated</span>
 </div>
 <div className="mt-3 text-xs text-muted-foreground flex justify-between pt-2 border-t border-border">
 <span>Avg Score:</span>
 <strong className="text-primary ">{(data?.detailedData?.results as any)?.averageScorePercentage || 0}%</strong>
 </div>
 </div>

 {/* Total Merits */}
 <div 
 onClick={() => onDrillDown('EXAM')}
 className="bg-card p-5 rounded-xl border border-border hover:border-slate-400  transition-all duration-200 cursor-pointer shadow-lg"
 >
 <div className="flex justify-between items-center text-muted-foreground mb-2">
 <span className="text-xs font-bold uppercase tracking-wider">Total Merits</span>
 <Award className="w-4 h-4 text-primary " />
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-bold text-foreground">{(data?.detailedData?.results as any)?.passedCount || 0}</span>
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-0.5">
 <TrendingUp className="w-3 h-3" /> Passed
 </span>
 </div>
 <div className="mt-3 text-xs text-muted-foreground flex justify-between pt-2 border-t border-border">
 <span>Pass Rate:</span>
 <strong className="text-primary ">{(data?.detailedData?.results as any)?.passRate || 0}%</strong>
 </div>
 </div>

 {/* Critical Alerts & Action Items */}
 <div 
 onClick={() => onDrillDown('TRUST_SCORE')}
 className="bg-card p-5 rounded-xl border border-border hover:border-primary/50 /40 transition-all duration-200 cursor-pointer shadow-lg relative overflow-hidden"
 >
 <div className="flex justify-between items-center text-muted-foreground mb-2">
 <span className="text-xs font-bold uppercase tracking-wider">Alerts & Actions</span>
 <AlertTriangle className="w-4 h-4 text-primary animate-bounce" />
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-bold text-foreground">{alertsAndNotifications.criticalAlertsCount}</span>
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary ">Live Violations</span>
 </div>
 <div className="mt-3 text-xs text-muted-foreground flex justify-between pt-2 border-t border-border">
 <span>Pending Approvals:</span>
 <strong className="text-primary ">{alertsAndNotifications.pendingApprovals} items</strong>
 </div>
 </div>
 </div>

 </div>
 );
};
