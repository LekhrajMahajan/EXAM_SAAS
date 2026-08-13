import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { SupportCard } from '../components/SupportCard';

export function CandidateSupportPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Help & Support" 
        description="Get assistance and find answers to your questions." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupportCard />
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">When will my admit card be generated?</p>
              <p className="text-sm text-slate-600 mt-1">Admit cards are usually generated 7-10 days before the exam date. You will receive a notification.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">How can I correct my name on the application?</p>
              <p className="text-sm text-slate-600 mt-1">Please raise a support ticket with proof of identity. Name corrections are only allowed before the admit card generation.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">What should I do if my photo is rejected?</p>
              <p className="text-sm text-slate-600 mt-1">Go to My Documents, delete the rejected photo, and upload a new clear passport-sized photo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
