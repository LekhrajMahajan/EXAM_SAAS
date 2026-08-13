import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Scan, Search, CreditCard, UserCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchCandidateSchema, type z } from '../schemas/verification-schemas';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';

type SearchFormData = z.infer<typeof searchCandidateSchema>;

interface CandidateSearchCardProps {
  onSearch: (data: SearchFormData) => void;
}

export function CandidateSearchCard({ onSearch }: CandidateSearchCardProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchCandidateSchema),
    defaultValues: {
      searchType: 'application',
      query: ''
    }
  });

  const searchType = watch('searchType');

  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-10" />
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
          <Scan className="w-5 h-5 text-indigo-600" />
          Identify Candidate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <RadioGroup 
            value={searchType} 
            onValueChange={(val: any) => setValue('searchType', val)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="application" id="type-app" />
              <Label htmlFor="type-app" className="cursor-pointer text-slate-700">Application No.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admitCard" id="type-admit" />
              <Label htmlFor="type-admit" className="cursor-pointer text-slate-700">Admit Card No.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aadhaar" id="type-aadhaar" />
              <Label htmlFor="type-aadhaar" className="cursor-pointer text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Aadhaar No.
              </Label>
            </div>
          </RadioGroup>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-slate-400" />
              </div>
              <Input 
                {...register('query')}
                placeholder={`Enter ${searchType === 'application' ? 'Application No.' : searchType === 'admitCard' ? 'Admit Card No.' : 'Aadhaar No.'}`}
                className={`pl-10 h-12 text-lg bg-white ${errors.query ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                autoFocus
              />
              {errors.query && <p className="text-sm text-red-500 mt-1 absolute -bottom-6">{errors.query.message}</p>}
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 shadow-sm">
              <Search className="w-4 h-4 mr-2" />
              Fetch
            </Button>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>Or scan barcode / QR code using scanner</span>
            <Scan className="w-4 h-4 animate-pulse text-indigo-400" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
