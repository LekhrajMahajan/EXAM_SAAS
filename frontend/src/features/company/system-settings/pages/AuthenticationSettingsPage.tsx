import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { KeyRound, Fingerprint } from 'lucide-react';

export function AuthenticationSettingsPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Auth Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Authentication Configuration" 
        description="Configure token lifetimes, multi-factor authentication, and SSO providers." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Token Lifetimes" icon={KeyRound}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">JWT Lifespan Placeholder</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                     Access Token: 15 Minutes
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Refresh Token Placeholder</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                     Refresh Token: 7 Days
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Advanced Authentication" icon={Fingerprint}>
            <div className="space-y-6">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Multi-Factor Authentication (MFA) Placeholder</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                     <p className="text-sm text-slate-700 font-bold mb-2">Enforce MFA for all Administrator accounts.</p>
                     <p className="text-xs text-slate-500 mb-4">Supports Authenticator Apps (TOTP) and SMS.</p>
                     <div className="h-8 w-14 bg-indigo-600 rounded-full flex items-center p-1">
                        <div className="w-6 h-6 bg-white rounded-full translate-x-6"></div>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Single Sign-On (SSO) Placeholder</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                     SAML 2.0 / OIDC configuration block will go here.
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
