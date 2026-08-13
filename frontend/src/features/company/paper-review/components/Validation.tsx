import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ValidationItem {
  id: string;
  rule: string;
  passed: boolean;
}

interface ValidationProps {
  validations: ValidationItem[];
}

export const Validation: React.FC<ValidationProps> = ({ validations }) => {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Review Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {validations.map((v) => (
            <li key={v.id} className="flex items-start gap-2 text-sm">
              {v.passed ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <span className={v.passed ? 'text-slate-700' : 'text-slate-500'}>
                {v.rule}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
