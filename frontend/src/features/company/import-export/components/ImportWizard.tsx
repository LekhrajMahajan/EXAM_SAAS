import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { importSchema, type ImportForm } from '../schemas/import-export-schemas';
import { FileUploadCard } from './FileUploadCard';
import { MappingTable } from './MappingTable';
import { DUMMY_MAPPINGS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ImportForm>({
    resolver: zodResolver(importSchema),
    defaultValues: { duplicateAction: 'Skip' }
  });

  const module = watch('module');

  const onNext = () => setStep(s => Math.min(4, s + 1));
  const onPrev = () => setStep(s => Math.max(1, s - 1));
  
  const onSubmit = (data: ImportForm) => {
    console.log("Start Import Job:", data);
    navigate('/company/import-export/jobs');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
       {/* Wizard Header */}
       <div className="flex border-b border-slate-200 bg-slate-50">
          {['Select Module', 'Upload File', 'Map Fields', 'Review'].map((label, i) => (
             <div key={label} className={`flex-1 p-4 text-center text-sm font-bold border-b-2 ${step === i + 1 ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : step > i + 1 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}>
                <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] bg-white border-current">{step > i + 1 ? <CheckCircle className="w-3 h-3" /> : i + 1}</span>
                {label}
             </div>
          ))}
       </div>

       <div className="p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
             {step === 1 && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">What do you want to import?</h2>
                     <p className="text-slate-500">Select the target module and configure duplicate handling rules.</p>
                  </div>
                  
                  <div className="space-y-1.5 max-w-md mx-auto">
                     <label className="text-sm font-medium text-slate-700">Target Module</label>
                     <select {...register('module')} className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                        <option value="">-- Select Module --</option>
                        <option value="Candidates">Candidates</option>
                        <option value="Employees">Employees</option>
                        <option value="Subjects">Subjects</option>
                        <option value="QuestionBank">Question Bank</option>
                        <option value="Centers">Centers</option>
                     </select>
                     {errors.module && <p className="text-[10px] text-red-500 font-bold">{errors.module.message}</p>}
                  </div>

                  <div className="space-y-3 max-w-md mx-auto mt-6">
                     <label className="text-sm font-medium text-slate-700">Duplicate Resolution</label>
                     <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                           <input type="radio" value="Skip" {...register('duplicateAction')} className="w-4 h-4 text-indigo-600" />
                           <div>
                              <div className="font-bold text-sm text-slate-900">Skip Duplicates</div>
                              <div className="text-xs text-slate-500">Ignore records that already exist.</div>
                           </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                           <input type="radio" value="Overwrite" {...register('duplicateAction')} className="w-4 h-4 text-indigo-600" />
                           <div>
                              <div className="font-bold text-sm text-slate-900">Overwrite Existing</div>
                              <div className="text-xs text-slate-500">Update existing records with new data.</div>
                           </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                           <input type="radio" value="Fail" {...register('duplicateAction')} className="w-4 h-4 text-indigo-600" />
                           <div>
                              <div className="font-bold text-sm text-slate-900">Fail Job</div>
                              <div className="text-xs text-slate-500">Stop import if any duplicates are found.</div>
                           </div>
                        </label>
                     </div>
                  </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Data File</h2>
                     <p className="text-slate-500">Upload your CSV or Excel file containing the data for {module}.</p>
                  </div>
                  <FileUploadCard />
                  <div className="flex justify-center mt-4">
                     <Button type="button" variant="link" className="text-indigo-600">Download {module} Template</Button>
                  </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="text-center mb-6">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Map Fields</h2>
                     <p className="text-slate-500">Match the columns from your uploaded file to the system properties.</p>
                  </div>
                  <MappingTable mappings={DUMMY_MAPPINGS} />
               </div>
             )}

             {step === 4 && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="text-center mb-6">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Import</h2>
                     <p className="text-slate-500">Verify your configuration before starting the background job.</p>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl mx-auto">
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Target Module</span>
                        <span className="font-bold text-slate-900">{module}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">File Name</span>
                        <span className="font-bold font-mono text-indigo-600">candidates_final.csv</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Duplicate Rule</span>
                        <span className="font-bold text-slate-900">{watch('duplicateAction')}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Fields Mapped</span>
                        <span className="font-bold text-emerald-600">5/6 Mapped</span>
                     </div>
                  </div>
               </div>
             )}

             {/* Footer Actions */}
             <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onPrev} disabled={step === 1}>
                   <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                {step < 4 ? (
                   <Button type="button" onClick={onNext} className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={step === 1 && !module}>
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                ) : (
                   <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Upload className="w-4 h-4 mr-2" /> Start Import Job
                   </Button>
                )}
             </div>
          </form>
       </div>
    </div>
  );
}
