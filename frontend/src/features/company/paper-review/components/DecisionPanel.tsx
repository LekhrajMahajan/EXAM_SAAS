import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export const DecisionPanel: React.FC = () => {
  const form = useFormContext();

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="text-xl">Final Decision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="decision.decision"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">Select Outcome</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value="Approve for Approval" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-green-700">
                      Approve for Approval
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value="Needs Changes" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-amber-700">
                      Needs Changes
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value="Reject" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-red-700">
                      Reject
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="decision.comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Reviewer Comments</FormLabel>
                <p className="text-sm text-slate-500 mb-2">These comments will be visible to the paper setter.</p>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed feedback for the paper setter..."
                    className="min-h-[150px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decision.internalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Internal Notes</FormLabel>
                <p className="text-sm text-slate-500 mb-2">These notes are for internal administration only.</p>
                <FormControl>
                  <Textarea
                    placeholder="Enter internal notes for administrators..."
                    className="min-h-[150px] resize-y bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
