import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { Palette, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function BrandingPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Branding Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Branding & White-labeling" 
        description="Customize the platform to match your corporate identity." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Colors" icon={Palette}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Primary Color Placeholder</label>
                  <div className="flex items-center gap-3 mt-1">
                     <div className="w-10 h-10 rounded shadow-sm bg-indigo-600 border border-slate-200"></div>
                     <Input defaultValue="#4f46e5" className="font-mono" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Secondary Color Placeholder</label>
                  <div className="flex items-center gap-3 mt-1">
                     <div className="w-10 h-10 rounded shadow-sm bg-slate-900 border border-slate-200"></div>
                     <Input defaultValue="#0f172a" className="font-mono" />
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard title="Logos & Icons" icon={ImageIcon}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Application Logo Placeholder</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-slate-500 text-sm h-32">
                     <span>Upload Logo</span>
                     <span className="text-xs text-slate-400 mt-1">PNG or SVG, max 2MB</span>
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Favicon Placeholder</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-slate-500 text-sm h-32">
                     <span>Upload Favicon</span>
                     <span className="text-xs text-slate-400 mt-1">.ico or .png, 32x32</span>
                  </div>
               </div>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
