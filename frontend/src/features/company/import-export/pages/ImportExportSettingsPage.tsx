import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type SettingsForm } from '../schemas/import-export-schemas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Save } from 'lucide-react';

export function ImportExportSettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultExportFormat: 'Excel',
      maxFileSizeMB: 50,
      allowedExtensions: '.csv, .xlsx, .xls',
      notifyOnCompletion: true,
    }
  });

  const onSubmit = (data: SettingsForm) => {
    console.log('Settings Saved:', data);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Import & Export Settings"
        description="Configure global defaults and restrictions for all import and export operations."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Export Defaults</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Default Export Format</label>
            <select {...register('defaultExportFormat')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
              <option value="Excel">Excel (.xlsx)</option>
              <option value="CSV">CSV (.csv)</option>
              <option value="JSON">JSON (.json)</option>
              <option value="PDF">PDF (.pdf)</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">File Restrictions</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Max File Size (MB)</label>
            <Input
              type="number"
              {...register('maxFileSizeMB', { valueAsNumber: true })}
              placeholder="e.g. 50"
            />
            {errors.maxFileSizeMB && <p className="text-[10px] text-red-500 font-bold">{errors.maxFileSizeMB.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Allowed File Extensions</label>
            <Input {...register('allowedExtensions')} placeholder=".csv, .xlsx, .xls" />
            <p className="text-[10px] text-slate-400">Comma-separated list of allowed file extensions for imports.</p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Notifications</h3>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-slate-900 text-sm">Notify on Job Completion</div>
              <div className="text-xs text-slate-500 mt-0.5">Send an in-app notification when an import/export job finishes.</div>
            </div>
            <input type="checkbox" {...register('notifyOnCompletion')} className="w-5 h-5 text-indigo-600 rounded border-slate-300 cursor-pointer" />
          </label>
        </section>

        <div className="flex justify-end">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
