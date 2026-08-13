import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck, XCircle, Undo2, MessageSquareWarning, Lock } from 'lucide-react';

export const DecisionPanel: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-xl">Approval Decision</CardTitle>
        <CardDescription>Finalize your review and provide an official decision on this paper.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        
        <FormField
          control={control}
          name="decision.decision"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold text-slate-800">Select Action</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <FormItem className="flex items-center space-x-0 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="Approve" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-md border-slate-200 bg-white hover:bg-slate-50 peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer transition-all">
                      <ShieldCheck className="w-8 h-8 mb-2 text-green-600" />
                      <span className="font-semibold text-slate-900">Approve</span>
                      <span className="text-xs text-slate-500 mt-1 text-center">Ready for publishing</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-0 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="Return for Review" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-md border-slate-200 bg-white hover:bg-slate-50 peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 cursor-pointer transition-all">
                      <Undo2 className="w-8 h-8 mb-2 text-amber-600" />
                      <span className="font-semibold text-slate-900">Return</span>
                      <span className="text-xs text-slate-500 mt-1 text-center">Send back to reviewer</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-0 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="Request Changes" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-md border-slate-200 bg-white hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all">
                      <MessageSquareWarning className="w-8 h-8 mb-2 text-blue-600" />
                      <span className="font-semibold text-slate-900">Changes</span>
                      <span className="text-xs text-slate-500 mt-1 text-center">Send to setter for fixes</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-0 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="Reject" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-center w-full p-4 border-2 rounded-md border-slate-200 bg-white hover:bg-slate-50 peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all">
                      <XCircle className="w-8 h-8 mb-2 text-red-600" />
                      <span className="font-semibold text-slate-900">Reject</span>
                      <span className="text-xs text-slate-500 mt-1 text-center">Discard paper completely</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="decision.remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-800">Approval Remarks</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide any feedback, instructions, or rationale for your decision..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
          <FormField
            control={control}
            name="decision.signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-800">Digital Signature</FormLabel>
                <CardDescription className="mb-2">Type your full name to digitally sign this decision.</CardDescription>
                <FormControl>
                  <Input placeholder="E.g., Jane Doe" {...field} className="font-mono bg-slate-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="decision.lockPaper"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-slate-50 mt-auto">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-semibold text-slate-800 cursor-pointer flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-slate-600" />
                    Lock Paper Version
                  </FormLabel>
                  <p className="text-sm text-slate-500">
                    Prevent further modifications to this paper version.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

      </CardContent>
    </Card>
  );
};
