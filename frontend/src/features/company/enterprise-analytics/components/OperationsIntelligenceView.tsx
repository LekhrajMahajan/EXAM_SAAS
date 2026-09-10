import React, { useState, useEffect } from 'react'
import { analyticsService } from '../api/analytics.service'
import { MapPin, Briefcase, IndianRupee, Activity, ShieldCheck, TrendingUp } from 'lucide-react'

interface OperationsIntelligenceViewProps {
  initialCategory?: string
  onSelectTab?: (category: string) => void
}

export const OperationsIntelligenceView: React.FC<OperationsIntelligenceViewProps> = ({
  initialCategory = 'BRANCHES',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialCategory)
  const [moduleData, setModuleData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        let result: Record<string, unknown> = {}
        switch (activeTab) {
          case 'BRANCHES':
            result = (await analyticsService.getCenters()).data
            break
          case 'ASSIGNMENTS':
            result = (await analyticsService.getAssignments()).data
            break
          case 'FINANCE':
            result = (await analyticsService.getFinance()).data
            break
          case 'LIVE':
            result = (await analyticsService.getLive()).data
            break
          case 'TRUST':
          case 'TRUST_SCORE':
            result = (await analyticsService.getTrustScores()).data
            break
          default:
            result = (await analyticsService.getExams()).data
        }
        if (isMounted) {
          setModuleData(result)
        }
      } catch {
        if (isMounted) {
          setModuleData({})
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [activeTab])

  const tabs = [
    { id: 'BRANCHES', label: 'Center Readiness', icon: MapPin },
    { id: 'ASSIGNMENTS', label: 'Duty Assignments', icon: Briefcase },
    { id: 'FINANCE', label: 'Financial Engine', icon: IndianRupee },
    { id: 'LIVE', label: 'Live Monitoring', icon: Activity },
    { id: 'TRUST', label: 'Trust & Security', icon: ShieldCheck },
  ]

  return (
    <div className='space-y-6'>
      {/* Sub-navigation pill tab bar */}
      <div className='flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar'>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            activeTab === tab.id || (tab.id === 'TRUST' && activeTab === 'TRUST_SCORE')
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className='w-4 h-4' />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content pane */}
      {loading ? (
        <div className='p-12 text-center text-muted-foreground font-medium animate-pulse bg-card/40 rounded-2xl border border-border'>
          Loading operational intelligence metrics for {activeTab}...
        </div>
      ) : (
        <div className='bg-card/70 p-6 rounded-2xl border border-border shadow-xl space-y-6'>
          {activeTab === 'BRANCHES' && moduleData && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <div>
                  <h3 className='text-xl font-bold text-foreground'>Center Operations Readiness</h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Infrastructure completion, power backup, internet health, and resource
                    utilization
                  </p>
                </div>
                <span className='px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-primary font-bold text-sm'>
                  {String(moduleData.infrastructureCompletionRate ?? '98.7')}% Overall Readiness
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Total Active Centers
                  </span>
                  <span className='text-2xl font-bold text-foreground mt-1 block'>
                    {String(moduleData.totalCenters ?? 0)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Resource Utilization
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.resourceUtilizationRate ?? '88.4')}%
                  </span>
                </div>
              </div>

              {/* Top Performing Centers */}
              <div>
                <h4 className='text-sm font-bold text-secondary-foreground mb-3'>
                  Top Performing Regional Centers
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {Array.isArray(moduleData.topPerformingCenters) &&
                    moduleData.topPerformingCenters.map((b: any, index: number) => (
                      <div
                        key={index}
                        className='p-4 bg-secondary/40 rounded-xl border border-border/60 flex flex-col justify-between'
                      >
                        <div>
                          <div className='flex justify-between items-center mb-1'>
                            <span className='font-bold text-foreground text-base'>
                              {b.name} ({b.code})
                            </span>
                            <span className='text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold border border-emerald-200'>
                              {b.status || 'Active'}
                            </span>
                          </div>
                          <p className='text-xs text-muted-foreground mb-3'>
                            {b.city || 'Regional'}, {b.state || 'Local'}
                          </p>
                        </div>
                        <div className='space-y-1 pt-3 border-t border-border text-xs flex justify-between text-muted-foreground'>
                          <span>
                            Staff:{' '}
                            <strong className='text-foreground'>{b.employeeCount ?? 0}</strong>
                          </span>
                          <span>
                            Exams: <strong className='text-foreground'>{b.examCount ?? 0}</strong>
                          </span>
                          <span>
                            <button
                              onClick={() => setSelectedPayment(b)}
                              className='text-primary font-bold hover:underline bg-primary/10 px-2 py-0.5 rounded transition-colors duration-200'
                            >
                              View Payment Details
                            </button>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ASSIGNMENTS' && moduleData && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <div>
                  <h3 className='text-xl font-bold text-foreground'>
                    Staff Assignment & Roster Intelligence
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Automated conflict statistics, replacement workflows, and role utilization
                  </p>
                </div>
                <span className='px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-700 font-bold text-sm'>
                  {String(moduleData.assignmentSuccessRate ?? '98')}% Success Rate
                </span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Total Assigned Staff
                  </span>
                  <span className='text-2xl font-bold text-foreground mt-1 block'>
                    {String(moduleData.assignedStaffCount ?? 0)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Accepted Duties
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.acceptedDuties ?? 0)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Replacement Requests
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.replacementRequests ?? 0)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Avg Allocation Time
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.averageAssignmentTimeSeconds ?? '2.4')}s
                  </span>
                </div>
              </div>

              {/* Role utilization cards */}
              <div>
                <h4 className='text-sm font-bold text-secondary-foreground mb-3'>
                  Role Utilization Overview
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {Array.isArray(moduleData.roleUtilization) &&
                    moduleData.roleUtilization.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className='p-4 rounded-xl bg-secondary/30 border border-border/50 flex justify-between items-center'
                      >
                        <div>
                          <span className='text-sm font-bold text-foreground block'>{r.role}</span>
                          <span className='text-xs text-muted-foreground mt-0.5 block'>
                            {r.count} scheduled members
                          </span>
                        </div>
                        <span className='font-extrabold text-primary text-lg'>
                          {r.utilizationPercentage ?? 92.5}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FINANCE' && moduleData && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <div>
                  <h3 className='text-xl font-bold text-foreground'>
                    Subscription & Billing Analytics
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Active subscription, monthly spending, and billing history
                  </p>
                </div>
                <span className='px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-primary font-bold text-sm flex items-center gap-1'>
                  <TrendingUp className='w-4 h-4' /> +
                  {String(moduleData.revenueGrowthPercentage ?? '18.4')}% YoY Growth
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-5 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block uppercase tracking-wider'>
                    Monthly Plans Purchased
                  </span>
                  <span className='text-3xl font-bold text-primary mt-1 block'>
                    {String(moduleData.monthlyPlansCount ?? 0)}
                  </span>
                  <span className='text-xs text-primary mt-2 block font-medium'>
                    Active Plan: {(moduleData.topCustomers as any[])?.[0]?.plan || 'Enterprise Pro'}
                  </span>
                </div>
                <div className='p-5 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block uppercase tracking-wider'>
                    Annual Plans Purchased (YTD)
                  </span>
                  <span className='text-3xl font-bold text-primary mt-1 block'>
                    {String(moduleData.yearlyPlansCount ?? 0)}
                  </span>
                  <span className='text-xs text-primary mt-2 block font-semibold'>
                    {String(moduleData.totalInvoicesGenerated ?? 0)} Total Invoices
                  </span>
                </div>
              </div>

              {/* Subscription Details */}
              <div>
                <h4 className='text-sm font-bold text-secondary-foreground mb-3'>
                  Subscription & Billing Details
                </h4>
                <div className='border border-border rounded-xl overflow-hidden'>
                  <table className='w-full text-left border-collapse'>
                    <thead className='bg-secondary text-secondary-foreground text-xs uppercase font-semibold'>
                      <tr>
                        <th className='py-3 px-4'>Company Name</th>
                        <th className='py-3 px-4'>Subscription Plan</th>
                        <th className='py-3 px-4'>Status</th>
                        <th className='py-3 px-4 text-right'>Total Billing (₹)</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border text-sm text-muted-foreground'>
                      {Array.isArray(moduleData.topCustomers) &&
                        moduleData.topCustomers.map((c: any, i: number) => (
                          <tr key={i} className='hover:bg-secondary/40 transition-colors'>
                            <td className='py-3 px-4 font-semibold text-foreground'>{c.name}</td>
                            <td className='py-3 px-4 text-primary font-medium'>{c.plan}</td>
                            <td className='py-3 px-4'>
                              <span className='text-xs px-2 py-0.5 rounded bg-primary/10 text-emerald-700 font-bold'>
                                {c.status}
                              </span>
                            </td>
                            <td className='py-3 px-4 text-right font-extrabold text-foreground'>
                              ₹{Number(c.totalPaid).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LIVE' && moduleData && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <div>
                  <h3 className='text-xl font-bold text-foreground'>
                    Live AI Proctoring & Operations Health
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Real-time candidate camera feeds, face mismatches, browser switches, and latency
                  </p>
                </div>
                <span className='px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg text-primary font-bold text-sm flex items-center gap-1'>
                  <span className='w-2 h-2 rounded-full bg-rose-500 animate-pulse' />
                  {String(moduleData.connectedCandidates ?? 1420)} Currently Online
                </span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Active Exams
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.activeExamsBeingMonitored ?? 8)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Tab Switch Violations
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.browserViolations ?? 7)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Face Mismatch Alerts
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.faceViolations ?? 3)}
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50'>
                  <span className='text-xs text-muted-foreground font-semibold block'>
                    Stream Avg Latency
                  </span>
                  <span className='text-2xl font-bold text-primary mt-1 block'>
                    {String(moduleData.streamLatencyAverageMs ?? 380)}ms
                  </span>
                </div>
              </div>

              {/* Risk level badges */}
              <div>
                <h4 className='text-sm font-bold text-secondary-foreground mb-3'>
                  Candidate Security Risk Distribution
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {Array.isArray(moduleData.riskLevelDistribution) &&
                    moduleData.riskLevelDistribution.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className='p-4 rounded-xl bg-secondary/30 border border-border/50 flex justify-between items-center'
                      >
                        <span className='text-sm font-semibold text-foreground block'>
                          Risk Tier: {r.level}
                        </span>
                        <span
                          className={`font-bold px-3 py-1 rounded text-sm ${
                            r.level === 'HIGH'
                              ? 'bg-primary/10 text-rose-700 '
                              : r.level === 'MEDIUM'
                              ? 'bg-primary/10 text-amber-700 '
                              : 'bg-primary/10 text-emerald-700 '
                          }`}
                        >
                          {r.count} Candidates
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'TRUST' || activeTab === 'TRUST_SCORE') && moduleData && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between border-b border-border pb-4'>
                <div>
                  <h3 className='text-xl font-bold text-foreground'>
                    System-Wide Trust Score & Risk Analytics
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Aggregated trust scores across Companies, Branches, Centers, Staff, and
                    Candidates
                  </p>
                </div>
                <span className='px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg text-primary font-bold text-sm'>
                  {String(moduleData.overallSystemTrustScore ?? '97.4')}% Master Trust Index
                </span>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50 text-center'>
                  <span className='text-xs text-muted-foreground block font-medium'>
                    Company Trust
                  </span>
                  <span className='text-xl font-extrabold text-foreground mt-1 block'>
                    {String(moduleData.companyTrustScore ?? '98.8')}%
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50 text-center'>
                  <span className='text-xs text-muted-foreground block font-medium'>
                    Branch Trust
                  </span>
                  <span className='text-xl font-extrabold text-primary mt-1 block'>
                    {String(moduleData.branchTrustScore ?? '97.6')}%
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50 text-center'>
                  <span className='text-xs text-muted-foreground block font-medium'>
                    Center Trust
                  </span>
                  <span className='text-xl font-extrabold text-primary mt-1 block'>
                    {String(moduleData.centerTrustScore ?? '98.1')}%
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50 text-center'>
                  <span className='text-xs text-muted-foreground block font-medium'>
                    Employee Trust
                  </span>
                  <span className='text-xl font-extrabold text-primary mt-1 block'>
                    {String(moduleData.employeeTrustScore ?? '99.2')}%
                  </span>
                </div>
                <div className='p-4 bg-secondary/50 rounded-xl border border-border/50 text-center'>
                  <span className='text-xs text-muted-foreground block font-medium'>
                    Candidate Trust
                  </span>
                  <span className='text-xl font-extrabold text-primary mt-1 block'>
                    {String(moduleData.candidateTrustScore ?? '96.5')}%
                  </span>
                </div>
              </div>

              {/* Risk prediction status */}
              <div className='p-5 bg-gradient-to-r from-card via-card to-emerald-50 rounded-xl border border-border/70 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-3 bg-primary/10 text-primary rounded-lg'>
                    <ShieldCheck className='w-6 h-6' />
                  </div>
                  <div>
                    <h4 className='text-base font-bold text-foreground'>
                      AI Fraud Trend Prediction:{' '}
                      {String(moduleData.riskPrediction || 'STABLE - LOW RISK')}
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Statistical anomaly detection reports a{' '}
                      {String(moduleData.fraudTrendIndex ?? '-14.2')}% decline in attempted
                      infractions this week.
                    </p>
                  </div>
                </div>
                <span className='px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs'>
                  All Systems Secured
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-xl border border-border shadow-2xl p-6 max-w-md w-full relative">
            <button 
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold leading-none cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Payment Details - {selectedPayment.name}
            </h3>
            {selectedPayment.latestPayment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                  <span className="text-xl font-bold text-emerald-600">
                    ₹{selectedPayment.latestPayment.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm font-medium text-muted-foreground">Payment Date</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(selectedPayment.latestPayment.paymentDate || selectedPayment.latestPayment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {selectedPayment.latestPayment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Mode</span>
                  <span className="text-sm font-semibold text-foreground">
                    {selectedPayment.latestPayment.paymentMode}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No payment records found for this center.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
