import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';

export function EnvironmentInformationPage() {
  const envVars = [
    { key: 'VITE_APP_NAME', value: 'Practice Exam Platform (Dev)' },
    { key: 'VITE_API_BASE_URL', value: 'https://api.dev.practiceexam.com' },
    { key: 'VITE_AUTH_DOMAIN', value: 'auth.dev.practiceexam.com' },
    { key: 'VITE_ENABLE_ANALYTICS', value: 'false' },
    { key: 'VITE_SENTRY_DSN', value: '********-****-****-****-********' },
  ];

  const featureFlags = [
    { key: 'ENABLE_NEW_DASHBOARD', value: 'true', type: 'boolean' },
    { key: 'MAX_FILE_UPLOAD_SIZE_MB', value: '50', type: 'number' },
    { key: 'BETA_EXAM_ENGINE', value: 'false', type: 'boolean' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Environment Config</h1>
        <p className="text-sm text-slate-500">View injected environment variables and feature flags (safely masked).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeveloperCard title="Environment Variables (Public)">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Variable Key</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Injected Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {envVars.map((env, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-600">{env.key}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{env.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DeveloperCard>

        <DeveloperCard title="Runtime Feature Flags">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Flag Key</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featureFlags.map((flag, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-600">{flag.key}</td>
                    <td className="px-4 py-3 text-slate-500">{flag.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">{flag.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DeveloperCard>
      </div>
    </div>
  );
}
