import { Card, CardContent } from '@/shared/components/ui/card';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';

interface ValidationSummaryProps {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
}

export function ValidationSummary({ totalRows, validRows, invalidRows, duplicateRows }: ValidationSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-blue-700">{totalRows}</div>
          <div className="text-sm text-blue-600 font-medium">Total Rows</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-green-700">{validRows}</div>
            <div className="text-sm text-green-600 font-medium">Valid Rows</div>
          </div>
          <CheckCircle className="text-green-500 h-6 w-6" />
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-red-700">{invalidRows}</div>
            <div className="text-sm text-red-600 font-medium">Invalid Rows</div>
          </div>
          <AlertCircle className="text-red-500 h-6 w-6" />
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6 flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-amber-700">{duplicateRows}</div>
            <div className="text-sm text-amber-600 font-medium">Duplicate Rows</div>
          </div>
          <Copy className="text-amber-500 h-6 w-6" />
        </CardContent>
      </Card>
    </div>
  );
}
