import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateMeritSchema, type GenerateMeritForm } from '../schemas/merit-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DUMMY_EXAMS, DUMMY_CATEGORIES, DUMMY_MERIT_TYPES, DUMMY_TIE_BREAKERS } from '../utils/placeholder';
import { FileDown } from 'lucide-react';
import { PreviewCard } from '../components/PreviewCard';

export function GenerateMeritPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<GenerateMeritForm>({
    resolver: zodResolver(generateMeritSchema),
    defaultValues: {
      meritType: 'Overall',
      tieBreakingRules: [],
    }
  });

  const onSubmit = (data: GenerateMeritForm) => {
    console.log(data);
    // Placeholder logic for submission
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Generate Merit List" 
        description="Compute candidate rankings and resolve ties based on configured rules." 
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg">Generation Parameters</CardTitle>
          <CardDescription>Select the dataset and define how ranks should be calculated.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Exam Batch <span className="text-red-500">*</span></label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                  {...register('exam')}
                >
                  <option value="">Select Exam Batch</option>
                  {DUMMY_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
                {errors.exam && <p className="text-xs text-red-500">{errors.exam.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Merit Type <span className="text-red-500">*</span></label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                  {...register('meritType')}
                >
                  {DUMMY_MERIT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.meritType && <p className="text-xs text-red-500">{errors.meritType.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category Filter (Optional)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                  {...register('category')}
                >
                  <option value="">All Categories</option>
                  {DUMMY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2 block">Tie-Breaking Rules Priority <span className="text-red-500">*</span></label>
              <p className="text-xs text-slate-500">Select the rules to apply when candidates have the exact same score.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                 {DUMMY_TIE_BREAKERS.map((rule, idx) => (
                    <label key={rule} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-indigo-50 transition-colors">
                      <input 
                         type="checkbox" 
                         value={rule}
                         {...register('tieBreakingRules')}
                         className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                      />
                      <span className="text-sm font-medium text-slate-800 flex-1">{rule}</span>
                      <span className="text-xs text-slate-400 font-mono bg-white px-2 rounded border border-slate-200 shadow-sm">Priority {idx + 1}</span>
                    </label>
                 ))}
              </div>
              {errors.tieBreakingRules && <p className="text-xs text-red-500">{errors.tieBreakingRules.message}</p>}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                Generate Merit Simulation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-12">
        <PreviewCard />
        <div className="mt-6 flex justify-end">
           <Button className="bg-emerald-600 hover:bg-emerald-700">
             <FileDown className="w-4 h-4 mr-2" />
             Save & Commit Merit List
           </Button>
        </div>
      </div>
    </div>
  );
}
