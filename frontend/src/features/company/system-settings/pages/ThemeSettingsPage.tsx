import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { SectionCard } from '../components/SectionCard';
import { SunMoon, Monitor, Moon, Sun } from 'lucide-react';

export function ThemeSettingsPage() {
  const onSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Saved Theme Settings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Display Theme" 
        description="Choose how the application appears to you." 
      />
      
      <ConfigurationForm onSubmit={onSubmit}>
         <SectionCard title="Theme Preference" icon={SunMoon}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <label className="cursor-pointer">
                  <input type="radio" name="theme" value="light" className="peer sr-only" defaultChecked />
                  <div className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-colors">
                     <Sun className="w-8 h-8 mb-3 text-amber-500" />
                     <span className="font-bold">Light Theme</span>
                  </div>
               </label>
               <label className="cursor-pointer">
                  <input type="radio" name="theme" value="dark" className="peer sr-only" />
                  <div className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-colors">
                     <Moon className="w-8 h-8 mb-3 text-indigo-500" />
                     <span className="font-bold">Dark Theme</span>
                  </div>
               </label>
               <label className="cursor-pointer">
                  <input type="radio" name="theme" value="system" className="peer sr-only" />
                  <div className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-colors">
                     <Monitor className="w-8 h-8 mb-3 text-slate-500" />
                     <span className="font-bold">System Default</span>
                  </div>
               </label>
            </div>
         </SectionCard>
      </ConfigurationForm>
    </div>
  );
}
