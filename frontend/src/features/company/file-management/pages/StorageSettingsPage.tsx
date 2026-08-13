import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadSettingsSchema, type UploadSettingsForm } from '../schemas/file-management-schemas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Save, Cloud } from 'lucide-react';

export function StorageSettingsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<UploadSettingsForm>({
    resolver: zodResolver(uploadSettingsSchema),
    defaultValues: {
      maxUploadSizeMB: 100,
      allowedExtensions: '.pdf, .jpg, .jpeg, .png, .docx, .xlsx, .zip',
      storageProvider: 'Local',
      retentionDays: 365,
      notifyOnUpload: true,
    }
  });

  const onSubmit = (data: UploadSettingsForm) => {
    console.log('Settings Saved:', data);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Storage Settings"
        description="Configure upload limits, allowed file types, storage provider, and retention policies."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Upload Restrictions</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Max Upload Size (MB)</label>
            <Input type="number" {...register('maxUploadSizeMB', { valueAsNumber: true })} />
            {errors.maxUploadSizeMB && <p className="text-[10px] text-red-500 font-bold">{errors.maxUploadSizeMB.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Allowed Extensions</label>
            <Input {...register('allowedExtensions')} placeholder=".pdf, .jpg, .png, .docx" />
            <p className="text-[10px] text-slate-400">Comma-separated list of allowed extensions.</p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-500" /> Storage Provider
          </h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Provider</label>
            <select {...register('storageProvider')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
              <option value="Local">Local Storage</option>
              <option value="AWS S3">AWS S3</option>
              <option value="Azure Blob">Azure Blob Storage</option>
              <option value="Google Cloud">Google Cloud Storage</option>
              <option value="Cloudinary">Cloudinary</option>
            </select>
            <p className="text-[10px] text-amber-600 font-bold">⚠ Changing the provider requires migration of existing files.</p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Retention & Notifications</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Default Retention Period (days)</label>
            <Input type="number" {...register('retentionDays', { valueAsNumber: true })} />
            <p className="text-[10px] text-slate-400">Files older than this period will be automatically archived. Set to 0 to disable.</p>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-slate-900 text-sm">Notify on Upload</div>
              <div className="text-xs text-slate-500 mt-0.5">Send in-app notification when a new file is uploaded.</div>
            </div>
            <input type="checkbox" {...register('notifyOnUpload')} className="w-5 h-5 text-indigo-600 rounded border-slate-300 cursor-pointer" />
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
