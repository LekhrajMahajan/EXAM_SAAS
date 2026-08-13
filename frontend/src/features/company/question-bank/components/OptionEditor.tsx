import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

export function OptionEditor() {
  const { control, register, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const questionType = watch('questionType');
  const isMcq = questionType === 'Single Choice (MCQ)';
  const isMsq = questionType === 'Multiple Choice (MSQ)';

  if (questionType === 'True / False') {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-sm">True / False Options</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
            <div className="flex-1 font-medium">{index === 0 ? 'True' : 'False'}</div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`options.${index}.isCorrect`}
                {...register(`options.${index}.isCorrect`)}
              />
              <Label htmlFor={`options.${index}.isCorrect`}>Correct Answer</Label>
            </div>
            <input type="hidden" {...register(`options.${index}.text`)} value={index === 0 ? 'True' : 'False'} />
            <input type="hidden" {...register(`options.${index}.order`)} value={index + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (questionType === 'Descriptive' || questionType === 'Numerical') {
    return (
      <div className="p-4 bg-gray-50 border rounded-md text-sm text-muted-foreground text-center">
        Options are not applicable for {questionType} questions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Options</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ id: crypto.randomUUID(), text: '', isCorrect: false, order: fields.length + 1 })}
          disabled={fields.length >= 5}
        >
          <PlusCircle size={16} className="mr-2" />
          Add Option
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-start">
            <div className="flex-1 space-y-1">
              <Input 
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                {...register(`options.${index}.text`)}
              />
              {/* @ts-ignore - complex error typing in RHF */}
              {errors?.options?.[index]?.text && (
                <p className="text-xs text-red-500">
                  {/* @ts-ignore */}
                  {errors.options[index].text.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox 
                id={`options.${index}.isCorrect`}
                {...register(`options.${index}.isCorrect`)}
              />
              <Label htmlFor={`options.${index}.isCorrect`}>Correct</Label>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 mt-1"
              onClick={() => remove(index)}
              disabled={fields.length <= 2}
            >
              <Trash2 size={16} />
            </Button>
            <input type="hidden" {...register(`options.${index}.order`)} value={index + 1} />
          </div>
        ))}
      </div>
      {/* @ts-ignore */}
      {errors.options?.root?.message && (
        <p className="text-sm text-red-500 font-medium">
          {/* @ts-ignore */}
          {errors.options.root.message}
        </p>
      )}
    </div>
  );
}
