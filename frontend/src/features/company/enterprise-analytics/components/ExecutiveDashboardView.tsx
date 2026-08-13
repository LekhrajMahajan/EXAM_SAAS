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
  DollarSign 
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
          <div key={i} className="h-36 bg-slate-800/50 rounded-xl border border-slate-700/60" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800">
        <p className="text-slate-400">No analytics data available for the selected parameters.</p>
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
          className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-2xl hover:border-indigo-400/60 transition-all duration-300 cursor-pointer group"
        >
          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                Enterprise Organization Health
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                {organizationHealth.score}% <span className="text-sm font-medium text-slate-300 ml-2">Overall Operations Score</span>
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                System uptime is running at an optimal <strong className="text-emerald-400">{(organizationHealth.uptime / 3600).toFixed(1)} hrs</strong> today. All regional centers and database pipelines are responding within SLA targets.
              </p>
            </div>
            <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-sm">
            <div>
              <span className="block text-xs text-slate-400 font-medium">System Status</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> {organizationHealth.systemHealth}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium">Branch Readiness</span>
              <span className="font-semibold text-white mt-0.5 block">{infrastructureHealth.branchHealthAverage}% Verified</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium">Active Centers</span>
              <span className="font-semibold text-indigo-300 mt-0.5 block">{infrastructureHealth.activeCenters} Online</span>
            </div>
          </div>
        </div>

        {/* Real-time Live Activities Card */}
        <div 
          onClick={() => onDrillDown('LIVE')}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-emerald-500/20 shadow-2xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Telemetry
              </span>
              <span className="text-xs text-slate-400 font-medium">Auto-refresh</span>
            </div>
            <h4 className="text-2xl font-extrabold text-white mt-4">
              {liveActivities.connectedCandidates.toLocaleString()}
              <span className="block text-xs font-normal text-slate-400 mt-1">Concurrent Connected Candidates</span>
            </h4>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Active Exams Monitored
              </span>
              <span className="font-bold text-white text-sm">{liveActivities.activeExamsMonitored}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Avg Candidate Trust
              </span>
              <span className="font-bold text-emerald-400 text-sm">{liveActivities.averageTrustScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Operations Card */}
        <div 
          onClick={() => onDrillDown('EXAM')}
          className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Exams</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{todaysOperations.runningExams}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">In Progress</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
            <span>Upcoming: <strong className="text-slate-200">{todaysOperations.upcomingExams}</strong></span>
            <span>Completed: <strong className="text-slate-200">{todaysOperations.completedExams}</strong></span>
          </div>
        </div>

        {/* Attendance & Staffing */}
        <div 
          onClick={() => onDrillDown('ATTENDANCE')}
          className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Staff Attendance</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{todaysOperations.todayAttendancePercentage}%</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">On Duty</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
            <span>Utilization Rate:</span>
            <strong className="text-emerald-300">{todaysOperations.staffUtilizationRate}%</strong>
          </div>
        </div>

        {/* Revenue Summary */}
        <div 
          onClick={() => onDrillDown('FINANCE')}
          className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">₹{(revenueSummary.monthlyRevenue / 1000).toFixed(1)}k</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{revenueSummary.growthPercentage}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
            <span>YTD Total:</span>
            <strong className="text-amber-300">₹{(revenueSummary.yearlyRevenue / 100000).toFixed(2)} Lakh</strong>
          </div>
        </div>

        {/* Critical Alerts & Action Items */}
        <div 
          onClick={() => onDrillDown('TRUST_SCORE')}
          className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 hover:border-red-500/40 transition-all duration-200 cursor-pointer shadow-lg relative overflow-hidden"
        >
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Alerts & Actions</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{alertsAndNotifications.criticalAlertsCount}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">Live Violations</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
            <span>Pending Approvals:</span>
            <strong className="text-rose-300">{alertsAndNotifications.pendingApprovals} items</strong>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Module Analytics */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Operations Intelligence Deep-Dive Modules</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'EMPLOYEES', label: 'Workforce & HR', icon: Users, color: 'text-indigo-400 bg-indigo-500/10' },
            { id: 'BRANCHES', label: 'Branch Analytics', icon: MapPin, color: 'text-emerald-400 bg-emerald-500/10' },
            { id: 'ASSIGNMENTS', label: 'Roster & Duties', icon: Clock, color: 'text-cyan-400 bg-cyan-500/10' },
            { id: 'FINANCE', label: 'Revenue Engine', icon: DollarSign, color: 'text-amber-400 bg-amber-500/10' },
            { id: 'LIVE', label: 'Live Proctoring', icon: Activity, color: 'text-rose-400 bg-rose-500/10' },
            { id: 'TRUST', label: 'AI Trust Scores', icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onDrillDown(item.id)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-center group"
            >
              <div className={`p-3 rounded-lg ${item.color} mb-2 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
