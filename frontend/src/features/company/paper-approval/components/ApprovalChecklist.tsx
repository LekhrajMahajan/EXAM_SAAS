import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { useFormContext } from 'react-hook-form';

const CHECKLIST_ITEMS = [
  { id: 'paperComplete', label: 'Paper Complete', description: 'All required sections and metadata are present.' },
  { id: 'questionCountVerified', label: 'Question Count Verified', description: 'Total questions match the blueprint requirement.' },
  { id: 'marksVerified', label: 'Marks Verified', description: 'Total marks and distribution are correct.' },
  { id: 'blueprintVerified', label: 'Blueprint Verified', description: 'Paper strictly adheres to the approved syllabus and blueprint.' },
  { id: 'difficultyVerified', label: 'Difficulty Verified', description: 'Difficulty distribution matches target audience expectations.' },
  { id: 'instructionsVerified', label: 'Instructions Verified', description: 'Student instructions are clear and accurate.' },
  { id: 'languageVerified', label: 'Language Verified', description: 'Grammar, spelling, and phrasing have been reviewed.' },
];

export const ApprovalChecklist: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Checklist</CardTitle>
        <CardDescription>Verify all aspects of the paper before making a final decision.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHECKLIST_ITEMS.map((item) => (
            <FormField
              key={item.id}
              control={control}
              name={`checklist.${item.id}`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-slate-50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold text-slate-800 cursor-pointer">
                      {item.label}
                    </FormLabel>
                    <p className="text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
