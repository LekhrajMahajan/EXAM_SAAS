import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { FormField, FormItem, FormControl, FormLabel } from '@/shared/components/ui/form';
import { useFormContext } from 'react-hook-form';

export const ReviewChecklist: React.FC = () => {
  const form = useFormContext();

  const checklistItems = [
    { name: 'checklist.questionQuality', label: 'Question Quality' },
    { name: 'checklist.grammar', label: 'Grammar' },
    { name: 'checklist.spelling', label: 'Spelling' },
    { name: 'checklist.correctAnswer', label: 'Correct Answer' },
    { name: 'checklist.duplicateQuestions', label: 'Duplicate Questions' },
    { name: 'checklist.difficultyBalance', label: 'Difficulty Balance' },
    { name: 'checklist.marksDistribution', label: 'Marks Distribution' },
    { name: 'checklist.blueprintValidation', label: 'Blueprint Validation' },
    { name: 'checklist.languageReview', label: 'Language Review' },
    { name: 'checklist.formatting', label: 'Formatting' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium cursor-pointer">
                      {item.label}
                    </FormLabel>
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
