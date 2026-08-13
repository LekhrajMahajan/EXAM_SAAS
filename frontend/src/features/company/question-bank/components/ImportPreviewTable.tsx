import type { QuestionRow } from '../schemas/import-schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';

interface ImportPreviewTableProps {
  data: QuestionRow[];
}

export function ImportPreviewTable({ data }: ImportPreviewTableProps) {
  return (
    <div className="border rounded-md max-h-[500px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[300px]">Question</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                No data to preview
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium truncate max-w-[300px]" title={row.questionText}>
                  {row.questionText}
                </TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.topic}</TableCell>
                <TableCell>{row.difficulty}</TableCell>
                <TableCell>{row.marks}</TableCell>
                <TableCell>{row.questionType}</TableCell>
                <TableCell>{row.language}</TableCell>
                <TableCell className="text-right">
                  {row.validationStatus === 'valid' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Valid</Badge>}
                  {row.validationStatus === 'invalid' && <Badge variant="destructive">Invalid</Badge>}
                  {row.validationStatus === 'duplicate' && <Badge variant="outline" className="border-amber-500 text-amber-700">Duplicate</Badge>}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
