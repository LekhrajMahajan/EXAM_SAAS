import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ValidationProps {
  validations: {
    id: string;
    rule: string;
    passed: boolean;
  }[];
}

export const Validation: React.FC<ValidationProps> = ({ validations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Validation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {validations.map((v) => (
          <div key={v.id} className="flex items-center gap-3">
            {v.passed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className={v.passed ? 'text-slate-700' : 'text-slate-700'}>
              {v.rule}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
