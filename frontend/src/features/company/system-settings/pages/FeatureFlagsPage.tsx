import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FEATURE_FLAGS } from '../utils/placeholder';
import { FeatureFlagCard } from '../components/FeatureFlagCard';
import { ConfigurationForm } from '../components/ConfigurationForm';

export function FeatureFlagsPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Feature Flags');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Feature Flags & Betas" 
        description="Toggle experimental features or disable modules for maintenance." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
        <div className="space-y-4">
           {DUMMY_FEATURE_FLAGS.map(flag => (
             <FeatureFlagCard key={flag.id} flag={flag} />
           ))}
        </div>
      </ConfigurationForm>
    </div>
  );
}
