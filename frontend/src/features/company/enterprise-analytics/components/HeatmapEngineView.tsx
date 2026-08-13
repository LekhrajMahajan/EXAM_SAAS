import React, { useState, useEffect } from 'react';
import { analyticsService } from '../api/analytics.service';
import type { HeatmapsData, HeatmapItem } from '../types/analytics.types';
import { Layers, MapPin, Activity, Clock, ShieldAlert, Cpu } from 'lucide-react';

export const HeatmapEngineView: React.FC = () => {
  const [data, setData] = useState<HeatmapsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('BRANCH');

  useEffect(() => {
    let isMounted = true;
    const loadHeatmaps = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getHeatmaps();
        if (isMounted && response.success) {
          setData(response.data);
        }
      } catch {
        if (isMounted) {
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadHeatmaps();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse bg-slate-900/40 rounded-2xl border border-slate-800">
        Generating high-definition enterprise heatmaps...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
        Heatmap engine is currently unavailable.
      </div>
    );
  }

  const getIntensityColor = (value?: number) => {
    if (value === undefined) return 'bg-slate-800 text-slate-300';
    if (value >= 97) return 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40';
    if (value >= 90) return 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40';
    if (value >= 75) return 'bg-amber-600/30 text-amber-200 border border-amber-500/40';
    return 'bg-rose-600/30 text-rose-200 border border-rose-500/40';
  };

  const getViolationColor = (count: number) => {
    if (count === 0) return 'bg-slate-800/60 text-slate-400';
    if (count <= 2) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    return 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40 animate-pulse';
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex flex-wrap gap-3 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
        {[
          { id: 'BRANCH', label: 'Branch & Center Health', icon: MapPin },
          { id: 'ATTENDANCE', label: 'Shift Attendance Matrix', icon: Clock },
          { id: 'VIOLATION', label: 'Violation Surge Heatmap', icon: ShieldAlert },
          { id: 'INFRA', label: 'Infrastructure & Tech', icon: Cpu },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {activeCategory === 'BRANCH' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Health Heatmap */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Regional Branches Readiness Heatmap
              </h3>
              <span className="text-xs text-slate-400">Live SLA Indicator</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.branchHeatmap.map((b: HeatmapItem) => (
                <div 
                  key={b.id} 
                  className={`p-4 rounded-xl transition-transform hover:scale-[1.02] cursor-pointer shadow-md ${getIntensityColor(b.value)}`}
                >
                  <span className="text-xs font-bold tracking-wide uppercase opacity-90 block">{b.id}</span>
                  <span className="text-base font-extrabold text-white mt-1 block">{b.name}</span>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 text-xs font-bold">
                    <span>SLA Health:</span>
                    <span className="text-sm">{b.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Occupancy Heatmap */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Exam Centers Occupancy & Readiness
              </h3>
              <span className="text-xs text-slate-400">Real-time capacity</span>
            </div>
            <div className="space-y-3">
              {data.centerHeatmap.map((c: HeatmapItem) => (
                <div 
                  key={c.id} 
                  className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-white text-sm block">{c.name}</span>
                    <span className="text-xs text-slate-400">ID: {c.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={`px-2.5 py-1 rounded ${getIntensityColor(c.occupancyRate)}`}>
                      Occ: {c.occupancyRate}%
                    </span>
                    <span className={`px-2.5 py-1 rounded ${getIntensityColor(c.readiness)}`}>
                      Readiness: {c.readiness}%
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                      Trust: {c.trust}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'ATTENDANCE' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Weekly Shift-wise Attendance Density Matrix
          </h3>
          <p className="text-xs text-slate-400">Color density reflects percentage of staff verified on duty across morning, afternoon, and evening examination rosters.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Day / Roster Window</th>
                  <th className="py-3 px-4">Morning Shift (09:00 - 12:00)</th>
                  <th className="py-3 px-4">Afternoon Shift (13:30 - 16:30)</th>
                  <th className="py-3 px-4">Evening Shift (17:30 - 20:30)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {data.attendanceHeatmap.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-bold text-white text-left">{row.day}</td>
                    <td className="p-2">
                      <div className={`py-2 px-3 rounded-lg font-extrabold ${getIntensityColor(row.morningShift)}`}>
                        {row.morningShift}% On-Time
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`py-2 px-3 rounded-lg font-extrabold ${getIntensityColor(row.afternoonShift)}`}>
                        {row.afternoonShift}% On-Time
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`py-2 px-3 rounded-lg font-extrabold ${getIntensityColor(row.eveningShift)}`}>
                        {row.eveningShift}% On-Time
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeCategory === 'VIOLATION' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Live AI Proctoring Violation Surges by Hour
          </h3>
          <p className="text-xs text-slate-400">Highlights temporal peak concentration of face mismatches, browser switches, and audio anomalies during examination sessions.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {data.violationHeatmap.map((v, i) => (
              <div key={i} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                <div className="text-center font-bold text-white text-xs bg-slate-800 py-1.5 rounded mb-3">
                  {v.hour}
                </div>
                <div className="space-y-2 text-xs">
                  <div className={`flex justify-between items-center p-2 rounded-lg ${getViolationColor(v.tabSwitch)}`}>
                    <span>Tab Switch</span>
                    <span className="font-extrabold">{v.tabSwitch}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded-lg ${getViolationColor(v.faceMismatch)}`}>
                    <span>Face Mismatch</span>
                    <span className="font-extrabold">{v.faceMismatch}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded-lg ${getViolationColor(v.audioAnomalies)}`}>
                    <span>Audio Anomalies</span>
                    <span className="font-extrabold">{v.audioAnomalies}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === 'INFRA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Hardware & Network Infrastructure Telemetry
            </h3>
            <div className="space-y-3">
              {data.infrastructureHeatmap.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
                  <span className="font-semibold text-white text-sm">{item.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                      Health: {item.health}%
                    </span>
                    <span className="text-xs font-bold text-slate-300 bg-slate-700 px-2 py-1 rounded">
                      {item.verification} Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Exam Load Heatmap by Shift
            </h3>
            <div className="space-y-3">
              {data.examLoadHeatmap.map((load, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>{load.shift}</span>
                    <span className="text-indigo-400">{load.loadPercentage}% Load</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${load.loadPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 text-right">{load.concurrentCandidates.toLocaleString()} concurrent candidates</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
