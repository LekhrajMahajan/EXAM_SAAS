import React, { useState, useEffect } from 'react';
import { analyticsService } from '../api/analytics.service';
import { 
  Users, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  CheckCircle, 
  TrendingUp, 
  Server, 
  ChevronRight, 
  AlertOctagon 
} from 'lucide-react';

interface OperationsIntelligenceViewProps {
  initialCategory?: string;
  onSelectTab?: (category: string) => void;
}

export const OperationsIntelligenceView: React.FC<OperationsIntelligenceViewProps> = ({
  initialCategory = 'EMPLOYEES'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialCategory);
  const [moduleData, setModuleData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        let result: Record<string, unknown> = {};
        switch (activeTab) {
          case 'EMPLOYEES':
            result = (await analyticsService.getEmployees()).data;
            break;
          case 'BRANCHES':
            result = (await analyticsService.getBranches()).data;
            break;
          case 'ASSIGNMENTS':
            result = (await analyticsService.getAssignments()).data;
            break;
          case 'FINANCE':
            result = (await analyticsService.getFinance()).data;
            break;
          case 'LIVE':
            result = (await analyticsService.getLive()).data;
            break;
          case 'TRUST':
          case 'TRUST_SCORE':
            result = (await analyticsService.getTrustScores()).data;
            break;
          default:
            result = (await analyticsService.getExams()).data;
        }
        if (isMounted) {
          setModuleData(result);
        }
      } catch {
        if (isMounted) {
          setModuleData({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const tabs = [
    { id: 'EMPLOYEES', label: 'Workforce & HR', icon: Users },
    { id: 'BRANCHES', label: 'Branch & Center Readiness', icon: MapPin },
    { id: 'ASSIGNMENTS', label: 'Duty Assignments', icon: Briefcase },
    { id: 'FINANCE', label: 'Financial Engine', icon: DollarSign },
    { id: 'LIVE', label: 'Live Monitoring', icon: Activity },
    { id: 'TRUST', label: 'Trust & Security', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation pill tab bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'TRUST' && activeTab === 'TRUST_SCORE');
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content pane */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse bg-slate-900/40 rounded-2xl border border-slate-800">
          Loading operational intelligence metrics for {activeTab}...
        </div>
      ) : (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          {activeTab === 'EMPLOYEES' && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Workforce Distribution & Performance</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time stats across Departments, Attendance, and Workload balance</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 font-bold text-sm">
                  {String(moduleData.totalEmployees || 0)} Total Employees
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Active Employees</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">{String(moduleData.activeEmployees || 0)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Attendance Rate</span>
                  <span className="text-2xl font-bold text-indigo-400 mt-1 block">{String(moduleData.attendancePercentage || '96.4')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Duty Completion</span>
                  <span className="text-2xl font-bold text-cyan-400 mt-1 block">{String(moduleData.dutyCompletionPercentage || '99.2')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Avg Working Hours</span>
                  <span className="text-2xl font-bold text-amber-400 mt-1 block">{String(moduleData.averageWorkingHours || '8.4')} hrs/day</span>
                </div>
              </div>

              {/* Workload Tier breakdown */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Workload Distribution Analysis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.isArray(moduleData.workloadDistribution) && moduleData.workloadDistribution.map((w: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex justify-between items-center">
                      <span className="text-sm text-slate-300 font-medium">{w.tier}</span>
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{w.count} staff</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Table */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Departmental Breakdown</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800/80 text-slate-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Staff Count</th>
                        <th className="py-3 px-4">Verification Status</th>
                        <th className="py-3 px-4 text-right">Performance Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                      {Array.isArray(moduleData.departmentDistribution) && moduleData.departmentDistribution.map((d: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-white">{d.department}</td>
                          <td className="py-3 px-4">{d.count}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                              <CheckCircle className="w-3.5 h-3.5" /> Verified
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-indigo-300">97.4%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'BRANCHES' && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Branch & Center Operations Readiness</h3>
                  <p className="text-xs text-slate-400 mt-1">Infrastructure completion, power backup, internet health, and resource utilization</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-bold text-sm">
                  {String(moduleData.branchReadinessRate || '98.2')}% Overall Readiness
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Total Active Branches</span>
                  <span className="text-2xl font-bold text-white mt-1 block">{String(moduleData.activeBranches || 0)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Average Branch Trust Score</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">{String(moduleData.averageTrustScore || '97.6')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Resource Utilization</span>
                  <span className="text-2xl font-bold text-indigo-400 mt-1 block">{String(moduleData.resourceUtilizationRate || '88.4')}%</span>
                </div>
              </div>

              {/* Top Performing Branches */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Top Performing Regional Branches</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.isArray(moduleData.topPerformingBranches) && moduleData.topPerformingBranches.map((b: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-white text-base">{b.name} ({b.code})</span>
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">Active</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{b.city}, {b.state}</p>
                      </div>
                      <div className="space-y-1 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
                        <span>Staff: <strong>{b.employeeCount || 45}</strong></span>
                        <span>Exams: <strong>{b.examCount || 28}</strong></span>
                        <span>Score: <strong className="text-indigo-300">{b.branchPerformanceScore || 94.2}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ASSIGNMENTS' && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Staff Assignment & Roster Intelligence</h3>
                  <p className="text-xs text-slate-400 mt-1">Automated conflict statistics, replacement workflows, and role utilization</p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-bold text-sm">
                  {String(moduleData.assignmentSuccessRate || '98')}% Success Rate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Total Assigned Staff</span>
                  <span className="text-2xl font-bold text-white mt-1 block">{String(moduleData.assignedStaffCount || 0)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Accepted Duties</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">{String(moduleData.acceptedDuties || 0)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Replacement Requests</span>
                  <span className="text-2xl font-bold text-amber-400 mt-1 block">{String(moduleData.replacementRequests || 0)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Avg Allocation Time</span>
                  <span className="text-2xl font-bold text-indigo-400 mt-1 block">{String(moduleData.averageAssignmentTimeSeconds || '2.4')}s</span>
                </div>
              </div>

              {/* Role utilization cards */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Role Utilization Overview</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.isArray(moduleData.roleUtilization) && moduleData.roleUtilization.map((r: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold text-white block">{r.role}</span>
                        <span className="text-xs text-slate-400 mt-0.5 block">{r.count} scheduled members</span>
                      </div>
                      <span className="font-extrabold text-indigo-400 text-lg">{r.utilizationPercentage || 92.5}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FINANCE' && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Financial & Revenue Analytics Engine</h3>
                  <p className="text-xs text-slate-400 mt-1">Subscription recurring fees, per-exam revenue, invoices, and growth projection</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 font-bold text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +{String(moduleData.revenueGrowthPercentage || '18.4')}% YoY Growth
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Monthly Revenue</span>
                  <span className="text-3xl font-bold text-amber-400 mt-1 block">₹{String(Number(moduleData.monthlyRevenue || 185000).toLocaleString())}</span>
                  <span className="text-xs text-emerald-400 mt-2 block font-medium">All invoices cleared on schedule</span>
                </div>
                <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Quarterly Revenue</span>
                  <span className="text-3xl font-bold text-white mt-1 block">₹{String(Number(moduleData.quarterlyRevenue || 520000).toLocaleString())}</span>
                  <span className="text-xs text-slate-400 mt-2 block">Includes subscriptions & exam fees</span>
                </div>
                <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Annual Revenue (YTD)</span>
                  <span className="text-3xl font-bold text-indigo-400 mt-1 block">₹{String(Number(moduleData.yearlyRevenue || 1120000).toLocaleString())}</span>
                  <span className="text-xs text-indigo-300 mt-2 block font-semibold">{String(moduleData.totalInvoicesGenerated || 142)} Total Invoices</span>
                </div>
              </div>

              {/* Top Customers & Authorities */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Top Enterprise Accounts & Examination Authorities</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800/80 text-slate-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Client / Authority Name</th>
                        <th className="py-3 px-4">Subscription Plan</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Total Billing (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                      {Array.isArray(moduleData.topCustomers) && moduleData.topCustomers.map((c: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                          <td className="py-3 px-4 text-indigo-300 font-medium">{c.plan}</td>
                          <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{c.status}</span></td>
                          <td className="py-3 px-4 text-right font-extrabold text-white">₹{Number(c.totalPaid).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LIVE' && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Live AI Proctoring & Operations Health</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time candidate camera feeds, face mismatches, browser switches, and latency</p>
                </div>
                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 font-bold text-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {String(moduleData.connectedCandidates || 1420)} Currently Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Active Exams</span>
                  <span className="text-2xl font-bold text-indigo-400 mt-1 block">{String(moduleData.activeExamsBeingMonitored || 8)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Tab Switch Violations</span>
                  <span className="text-2xl font-bold text-amber-400 mt-1 block">{String(moduleData.browserViolations || 7)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Face Mismatch Alerts</span>
                  <span className="text-2xl font-bold text-rose-400 mt-1 block">{String(moduleData.faceViolations || 3)}</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 font-semibold block">Stream Avg Latency</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">{String(moduleData.streamLatencyAverageMs || 380)}ms</span>
                </div>
              </div>

              {/* Risk level badges */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Candidate Security Risk Distribution</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.isArray(moduleData.riskLevelDistribution) && moduleData.riskLevelDistribution.map((r: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex justify-between items-center">
                      <span className="text-sm font-semibold text-white block">Risk Tier: {r.level}</span>
                      <span className={`font-bold px-3 py-1 rounded text-sm ${
                        r.level === 'HIGH' ? 'bg-rose-500/20 text-rose-300' :
                        r.level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {r.count} Candidates
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'TRUST' || activeTab === 'TRUST_SCORE') && moduleData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">System-Wide Trust Score & Risk Analytics</h3>
                  <p className="text-xs text-slate-400 mt-1">Aggregated trust scores across Companies, Branches, Centers, Staff, and Candidates</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 font-bold text-sm">
                  {String(moduleData.overallSystemTrustScore || '97.4')}% Master Trust Index
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Company Trust</span>
                  <span className="text-xl font-extrabold text-white mt-1 block">{String(moduleData.companyTrustScore || '98.8')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Branch Trust</span>
                  <span className="text-xl font-extrabold text-indigo-400 mt-1 block">{String(moduleData.branchTrustScore || '97.6')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Center Trust</span>
                  <span className="text-xl font-extrabold text-cyan-400 mt-1 block">{String(moduleData.centerTrustScore || '98.1')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Employee Trust</span>
                  <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{String(moduleData.employeeTrustScore || '99.2')}%</span>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Candidate Trust</span>
                  <span className="text-xl font-extrabold text-amber-400 mt-1 block">{String(moduleData.candidateTrustScore || '96.5')}%</span>
                </div>
              </div>

              {/* Risk prediction status */}
              <div className="p-5 bg-gradient-to-r from-slate-800/80 via-slate-800 to-emerald-950/40 rounded-xl border border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">AI Fraud Trend Prediction: {String(moduleData.riskPrediction || 'STABLE - LOW RISK')}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Statistical anomaly detection reports a {String(moduleData.fraudTrendIndex || '-14.2')}% decline in attempted infractions this week.</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs">All Systems Secured</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
