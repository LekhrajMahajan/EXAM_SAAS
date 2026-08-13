import type { QuestionRow } from '../schemas/import-schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Copy } from 'lucide-react';

interface DuplicateTableProps {
  duplicates: QuestionRow[];
}

export function DuplicateTable({ duplicates }: DuplicateTableProps) {
  return (
    <div className="border border-amber-200 rounded-md max-h-[400px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-amber-50 z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[300px]">Question Text</TableHead>
            <TableHead>Matched With</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {duplicates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                No duplicates found!
              </TableCell>
            </TableRow>
          ) : (
            duplicates.map((row, index) => (
              <TableRow key={index} className="bg-amber-50/30">
                <TableCell>
                  <Copy className="text-amber-500 h-5 w-5" />
                </TableCell>
                <TableCell className="font-medium truncate max-w-[300px]" title={row.questionText}>
                  {row.questionText}
                </TableCell>
                <TableCell className="text-sm text-amber-700">
                  Existing ID: {row.id || 'N/A'}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-amber-600">Will be skipped</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
