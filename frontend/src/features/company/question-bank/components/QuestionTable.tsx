import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Eye, Edit, MoreVertical, Trash, Copy } from 'lucide-react';
import type { Question } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { useNavigate } from 'react-router-dom';

interface QuestionTableProps {
  questions: Question[];
  onDelete?: (id: string) => void;
}

export function QuestionTable({ questions, onDelete }: QuestionTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject / Topic</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="font-medium">{q.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{q.subject}</span>
                  <span className="text-xs text-muted-foreground">{q.topic}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{q.questionType}</Badge>
              </TableCell>
              <TableCell>
                <DifficultyBadge level={q.difficulty} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">+{q.marks}</span>
                  <span className="text-xs text-red-500">-{q.negativeMarks}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 items-start">
                  <Badge 
                    variant={
                      q.status === 'Approved' ? 'default' : 
                      q.status === 'Pending Review' ? 'secondary' : 
                      q.status === 'Rejected' ? 'destructive' : 'outline'
                    }
                  >
                    {q.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-sm">{q.createdBy}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/company/question-bank/${q.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/company/question-bank/preview`)}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/company/question-bank/${q.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(q.id)}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {questions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                No questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
