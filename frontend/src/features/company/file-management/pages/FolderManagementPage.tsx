import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_FOLDERS } from '../utils/placeholder';
import { FolderTree } from '../components/FolderTree';
import { Button } from '@/shared/components/ui/button';
import { FolderPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFolderSchema, type CreateFolderForm } from '../schemas/file-management-schemas';
import { Input } from '@/shared/components/ui/input';

export function FolderManagementPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateFolderForm>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { module: 'General' }
  });

  const onSubmit = (data: CreateFolderForm) => {
    console.log('Create Folder:', data);
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Folder Management"
        description="Organise documents into logical folders grouped by module and access level."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FolderTree folders={DUMMY_FOLDERS} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderPlus className="w-5 h-5 text-amber-500" /> Create New Folder
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Folder Name</label>
              <Input {...register('name')} placeholder="e.g. 2026 Application Documents" />
              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Module</label>
              <select {...register('module')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                <option value="Candidates">Candidates</option>
                <option value="Employees">Employees</option>
                <option value="Certificates">Certificates</option>
                <option value="Results">Results</option>
                <option value="Reports">Reports</option>
                <option value="Exams">Exams</option>
                <option value="General">General</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <FolderPlus className="w-4 h-4 mr-2" /> Create Folder
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
