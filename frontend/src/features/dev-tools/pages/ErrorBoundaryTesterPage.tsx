import React, { useState } from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function ErrorBoundaryTesterPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  // This simulates a component that throws an error during render if the state says so.
  // In a real app, the ErrorBoundary higher up the tree would catch this.
  const BuggyComponent = () => {
    if (shouldCrash) {
      throw new Error('This is a simulated render error for testing boundaries.');
    }
    return (
      <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-center">
        Component is rendering normally. No errors thrown.
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Error Boundary Tester</h1>
        <p className="text-sm text-slate-500">Simulate application crashes to test fallback UIs and recovery mechanisms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeveloperCard title="Test Controls" className="border-rose-200">
          <div className="p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">Click the button below to intentionally throw a JavaScript error during the next render cycle.</p>
            <Button 
              variant="outline" 
              className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 w-full"
              onClick={() => setShouldCrash(true)}
            >
              Trigger React Error
            </Button>
          </div>
        </DeveloperCard>

        <DeveloperCard title="Target Component Area">
          <div className="p-6">
            <BuggyComponent />
            
            {shouldCrash && (
              <div className="mt-4 p-4 bg-slate-900 text-rose-400 rounded-lg font-mono text-xs overflow-x-auto">
                <p className="font-bold text-white mb-2">Uncaught Error: This is a simulated render error for testing boundaries.</p>
                <p>at BuggyComponent (ErrorBoundaryTesterPage.tsx:11)</p>
                <p>at renderWithHooks (react-dom.development.js:16305)</p>
                <p>...</p>
                <div className="mt-4 text-center">
                  <Button size="sm" onClick={() => setShouldCrash(false)}>Reset State</Button>
                </div>
              </div>
            )}
          </div>
        </DeveloperCard>
      </div>
    </div>
  );
}
