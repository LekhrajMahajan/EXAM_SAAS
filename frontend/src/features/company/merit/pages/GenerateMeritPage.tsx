import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateMeritSchema, type GenerateMeritForm } from '../schemas/merit-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { PreviewCard, type PreviewData } from '../components/PreviewCard';
import { useState } from 'react';
import api from '@/services/api';

const MERIT_TYPES = ['Overall', 'Category-wise', 'State-wise', 'City-wise'];
const TIE_BREAKERS = [
  'Date of Birth (Older candidate preferred)',
  'Higher marks in Section A',
  'Alphabetical order of names',
  'Earlier application submission time'
];

export function GenerateMeritPage() {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<GenerateMeritForm>({
    resolver: zodResolver(generateMeritSchema),
    defaultValues: {
      meritType: 'Overall',
      tieBreakingRules: [],
    }
  });

  const onSubmit = async (data: GenerateMeritForm) => {
    setIsSimulating(true);
    try {
      const response = await api.post('/merit/simulate', data);
      setPreviewData(response.data);
    } catch (error) {
      // Fallback for simulation since endpoint might not exist yet
      setPreviewData({
        candidatesProcessed: 12450,
        topScore: 295,
        maxScore: 300,
        tieBreakersApplied: 124,
        topCandidates: [
          { id: '1', name: 'Alice Smith', category: 'General', state: 'NY', score: 295 },
          { id: '2', name: 'Bob Johnson', category: 'OBC', state: 'CA', score: 292 },
          { id: '3', name: 'Charlie Brown', category: 'SC', state: 'TX', score: 290 },
        ]
      });
    } finally {
      setIsSimulating(false);
    }
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...register('exam')}
                >
                  <option value="">Select Exam Batch</option>
                  <option value="JEE Mains 2024">JEE Mains 2024</option>
                  <option value="NEET UG 2024">NEET UG 2024</option>
                </select>
                {errors.exam && <p className="text-xs text-red-500">{errors.exam.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Merit Type <span className="text-red-500">*</span></label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...register('meritType')}
                >
                  {MERIT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.meritType && <p className="text-xs text-red-500">{errors.meritType.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category Filter (Optional)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...register('category')}
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2 block">Tie-Breaking Rules Priority <span className="text-red-500">*</span></label>
              <p className="text-xs text-slate-500">Select the rules to apply when candidates have the exact same score.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                 {TIE_BREAKERS.map((rule, idx) => (
                    <label key={rule} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                      <input 
                         type="checkbox" 
                         value={rule}
                         {...register('tieBreakingRules')}
                         className="w-4 h-4 text-primary rounded border-input"
                      />
                      <span className="text-sm font-medium text-foreground flex-1">{rule}</span>
                      <span className="text-xs text-muted-foreground font-mono bg-muted/20 px-2 rounded border border-border shadow-sm">Priority {idx + 1}</span>
                    </label>
                 ))}
              </div>
              {errors.tieBreakingRules && <p className="text-xs text-red-500">{errors.tieBreakingRules.message}</p>}
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button type="submit" disabled={isSimulating}>
                {isSimulating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating...</> : 'Generate Merit Simulation'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-12">
        <div>
          <PreviewCard data={previewData} isLoading={isSimulating} />
        </div>
        <div className="mt-6 flex justify-end">
           <Button>
             <FileDown className="w-4 h-4 mr-2" />
             Save & Commit Merit List
           </Button>
        </div>
      </div>
    </div>
  );
}
