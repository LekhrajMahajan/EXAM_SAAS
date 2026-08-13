import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ValidationRule {
  id: string;
  rule: string;
  passed: boolean;
}

interface ValidationProps {
  validations: ValidationRule[];
}

export const Validation: React.FC<ValidationProps> = ({ validations }) => {
  const allPassed = validations.every((v) => v.passed);

  return (
    <Card className={`border-2 ${allPassed ? 'border-green-200' : 'border-amber-200'} shadow-sm`}>
      <CardHeader className={`${allPassed ? 'bg-green-50' : 'bg-amber-50'} py-3`}>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-600" />
          )}
          {allPassed ? 'Ready for Decision' : 'Action Required'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {validations.map((validation) => (
          <div key={validation.id} className="flex items-start gap-2">
            {validation.passed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 mt-0.5 shrink-0" />
            )}
            <span className={`text-sm ${validation.passed ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
              {validation.rule}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
