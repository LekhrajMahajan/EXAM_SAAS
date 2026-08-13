import React, { useState } from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';

export function MockDataViewerPage() {
  const [activeTab, setActiveTab] = useState('candidate');

  const tabs = [
    { id: 'candidate', label: 'Candidate Data' },
    { id: 'exam', label: 'Exam Data' },
    { id: 'result', label: 'Result Data' },
    { id: 'center', label: 'Center Data' },
  ];

  const mockJson = {
    candidate: [
      { id: 'C-1001', name: 'John Doe', email: 'john@example.com', status: 'Active', registeredAt: '2023-10-15T08:30:00Z' },
      { id: 'C-1002', name: 'Jane Smith', email: 'jane@example.com', status: 'Verified', registeredAt: '2023-10-16T09:45:00Z' },
    ],
    exam: [
      { id: 'E-500', title: 'Mathematics 101', duration: 120, totalMarks: 100, isPublished: true },
      { id: 'E-501', title: 'Physics Advanced', duration: 180, totalMarks: 150, isPublished: false },
    ],
    result: [
      { candidateId: 'C-1001', examId: 'E-500', score: 85, percentile: 92.5, grade: 'A' },
      { candidateId: 'C-1002', examId: 'E-500', score: 92, percentile: 98.1, grade: 'A+' },
    ],
    center: [
      { id: 'CTR-01', name: 'Downtown Testing Center', capacity: 250, city: 'Metropolis', status: 'Active' },
      { id: 'CTR-02', name: 'Northside Academy', capacity: 150, city: 'Gotham', status: 'Maintenance' },
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mock Data Viewer</h1>
        <p className="text-sm text-slate-500">Inspect the static JSON structures used across the application.</p>
      </div>

      <DeveloperCard title="Data Sets">
        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-slate-900 p-4 rounded-b-xl overflow-x-auto">
          <pre className="text-sm text-emerald-400 font-mono">
            {JSON.stringify((mockJson as any)[activeTab], null, 2)}
          </pre>
        </div>
      </DeveloperCard>
    </div>
  );
}
