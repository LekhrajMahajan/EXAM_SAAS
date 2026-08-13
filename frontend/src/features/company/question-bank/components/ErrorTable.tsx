import type { QuestionRow } from '../schemas/import-schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { AlertCircle } from 'lucide-react';

interface ErrorTableProps {
  errors: QuestionRow[];
}

export function ErrorTable({ errors }: ErrorTableProps) {
  return (
    <div className="border border-red-200 rounded-md max-h-[400px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-red-50 z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[300px]">Question Text</TableHead>
            <TableHead>Error Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                No errors found!
              </TableCell>
            </TableRow>
          ) : (
            errors.map((row, index) => (
              <TableRow key={index} className="bg-red-50/30">
                <TableCell>
                  <AlertCircle className="text-red-500 h-5 w-5" />
                </TableCell>
                <TableCell className="font-medium truncate max-w-[300px]" title={row.questionText}>
                  {row.questionText || '<Missing Question Text>'}
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {row.errors?.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
