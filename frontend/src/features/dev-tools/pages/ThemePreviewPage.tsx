import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';

export function ThemePreviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Theme Preview</h1>
        <p className="text-sm text-slate-500">Preview application UI across different theme modes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeveloperCard title="Light Mode (Default)" className="bg-slate-50">
          <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Card Component</h3>
              <p className="text-sm text-slate-600 mb-4">This is how a standard card looks in light mode. The text is dark and the background is white.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                Primary Action
              </button>
            </div>
          </div>
        </DeveloperCard>

        <DeveloperCard title="Dark Mode (Preview)" className="bg-slate-900 border-slate-800 text-slate-300">
          <div className="p-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-2">Card Component</h3>
              <p className="text-sm text-slate-400 mb-4">This is how a standard card looks in dark mode. The text is light and the background is dark.</p>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600">
                Primary Action
              </button>
            </div>
          </div>
        </DeveloperCard>
      </div>
    </div>
  );
}
