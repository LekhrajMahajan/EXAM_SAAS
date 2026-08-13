import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FAQS } from '../utils/placeholder';
import { FaqCard } from '../components/FaqCard';

export function FaqPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Quick answers to common issues and platform rules." 
      />
      
      <div className="space-y-4">
         {DUMMY_FAQS.map(faq => (
            <FaqCard key={faq.id} faq={faq} />
         ))}
      </div>
    </div>
  );
}
