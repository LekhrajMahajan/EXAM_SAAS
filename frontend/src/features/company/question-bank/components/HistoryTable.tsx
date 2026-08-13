import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Download, FileText } from 'lucide-react';

export interface ImportHistoryJob {
  id: string;
  fileName: string;
  importedBy: string;
  importDate: string;
  totalRecords: number;
  successCount: number;
  failedCount: number;
  status: 'Completed' | 'Partial' | 'Failed';
}

interface HistoryTableProps {
  jobs: ImportHistoryJob[];
}

export function HistoryTable({ jobs }: HistoryTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Imported By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right text-green-600">Success</TableHead>
            <TableHead className="text-right text-red-600">Failed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                No past imports found.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>{job.fileName}</span>
                </TableCell>
                <TableCell>{job.importedBy}</TableCell>
                <TableCell>{job.importDate}</TableCell>
                <TableCell className="text-right font-medium">{job.totalRecords}</TableCell>
                <TableCell className="text-right text-green-600">{job.successCount}</TableCell>
                <TableCell className="text-right text-red-600">{job.failedCount}</TableCell>
                <TableCell>
                  {job.status === 'Completed' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>}
                  {job.status === 'Partial' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Partial</Badge>}
                  {job.status === 'Failed' && <Badge variant="destructive">Failed</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {job.failedCount > 0 && (
                      <Button variant="outline" size="sm" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">
                        <Download className="mr-1 h-3 w-3" /> Errors
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Download className="mr-1 h-3 w-3" /> Report
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
