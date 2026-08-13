import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { PreferenceCard } from '../components/PreferenceCard';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferenceSchema, type PreferenceForm } from '../schemas/notification-schemas';
import { Button } from '@/shared/components/ui/button';
import { Save } from 'lucide-react';

export function UserPreferencesPage() {
  const methods = useForm<PreferenceForm>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      examAlerts: true,
      resultUpdates: true,
      marketingEmails: false,
      systemAnnouncements: true,
    }
  });

  const onSubmit = (data: PreferenceForm) => {
    console.log("Preferences saved:", data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader 
          title="Notification Preferences" 
          description="Control what types of alerts you receive and how they are delivered." 
        />
        <Button onClick={methods.handleSubmit(onSubmit)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Save className="w-4 h-4 mr-2" /> Save Preferences
        </Button>
      </div>
      
      <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSubmit)}>
            <PreferenceCard />
         </form>
      </FormProvider>
    </div>
  );
}
