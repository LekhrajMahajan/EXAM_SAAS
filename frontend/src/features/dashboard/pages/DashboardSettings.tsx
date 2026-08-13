import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dashboardSettingsSchema, type DashboardSettingsForm } from '../schemas/dashboard-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export function DashboardSettings() {
  const { register, handleSubmit } = useForm<DashboardSettingsForm>({
    resolver: zodResolver(dashboardSettingsSchema),
    defaultValues: {
      theme: 'system',
      layout: 'default',
      widgets: []
    }
  });

  const onSubmit = (data: DashboardSettingsForm) => {
    console.log('Settings saved:', data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Dashboard Settings" description="Customize your dashboard layout and theme." />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-800">Appearance</CardTitle>
            <CardDescription className="text-xs">Select your preferred theme and layout density.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                <select {...register('theme')} className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Layout Density</label>
                <select {...register('layout')} className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-800">Widget Visibility</CardTitle>
            <CardDescription className="text-xs">Toggle which widgets appear on your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {['Statistics', 'Recent Activity', 'Tasks & Deadlines', 'Calendar', 'Notifications', 'Revenue Summary'].map((widget, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-indigo-300">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4" />
                  <span className="text-sm font-medium text-slate-700">{widget}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="bg-white">Reset to Default</Button>
          <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
