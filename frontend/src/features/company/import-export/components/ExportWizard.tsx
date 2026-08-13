import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportSchema, type ExportForm } from '../schemas/import-export-schemas';
import { Button } from '@/shared/components/ui/button';
import { Download, FileDown, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ExportWizard() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExportForm>({
    resolver: zodResolver(exportSchema),
    defaultValues: { format: 'Excel', fields: [] }
  });

  const module = watch('module');
  const format = watch('format');
  const selectedFields = watch('fields');

  const DUMMY_FIELDS = {
    'Candidates': ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth', 'Status', 'Center Code'],
    'Results': ['ID', 'Candidate Name', 'Exam', 'Score', 'Percentage', 'Grade', 'Status'],
    'MeritList': ['Rank', 'Candidate ID', 'Name', 'Category', 'Score', 'Center']
  } as Record<string, string[]>;

  const availableFields = module && DUMMY_FIELDS[module] ? DUMMY_FIELDS[module] : [];

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setValue('fields', selectedFields.filter(f => f !== field));
    } else {
      setValue('fields', [...selectedFields, field]);
    }
  };

  const selectAll = () => setValue('fields', availableFields);
  const deselectAll = () => setValue('fields', []);

  const onSubmit = (data: ExportForm) => {
    console.log("Start Export Job:", data);
    navigate('/company/import-export/jobs');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
         
         {/* Top Section */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">1. Select Data Source</h3>
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Export Module</label>
                  <select {...register('module')} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                     <option value="">-- Choose Module --</option>
                     <option value="Candidates">Candidates</option>
                     <option value="Results">Results</option>
                     <option value="MeritList">Merit List</option>
                  </select>
                  {errors.module && <p className="text-[10px] text-red-500 font-bold">{errors.module.message}</p>}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">2. Output Format</h3>
               <div className="grid grid-cols-2 gap-3">
                  {['Excel', 'CSV', 'JSON', 'PDF'].map(fmt => (
                     <label key={fmt} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 transition-all">
                        <input type="radio" value={fmt} {...register('format')} className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-sm text-slate-900">{fmt}</span>
                     </label>
                  ))}
               </div>
            </div>
         </div>

         {/* Middle Section: Fields */}
         <div className={`space-y-4 transition-opacity ${module ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
               <h3 className="font-bold text-slate-900">3. Select Fields to Export</h3>
               <div className="space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAll}>Select All</Button>
                  <Button type="button" variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
               </div>
            </div>
            {errors.fields && <p className="text-[10px] text-red-500 font-bold">{errors.fields.message}</p>}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[100px]">
               {availableFields.map(field => {
                  const isSelected = selectedFields.includes(field);
                  return (
                     <button
                        key={field}
                        type="button"
                        onClick={() => toggleField(field)}
                        className={`flex items-center gap-2 p-2 rounded border text-sm text-left transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                     >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        <span className="truncate">{field}</span>
                     </button>
                  );
               })}
               {!module && <div className="col-span-full text-center text-sm text-slate-500 py-4">Select a module to view available fields</div>}
            </div>
         </div>

         {/* Bottom Action */}
         <div className="flex justify-end pt-6 border-t border-slate-100">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!module}>
               <FileDown className="w-4 h-4 mr-2" /> Generate Export Job
            </Button>
         </div>
      </form>
    </div>
  );
}
