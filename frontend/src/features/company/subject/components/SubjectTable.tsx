import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { SubjectStatusBadge } from './SubjectStatusBadge';
import { Link } from 'react-router-dom';
import type { Subject } from '../types';

interface SubjectTableProps {
  subjects: Subject[];
  onDelete?: (id: string) => void;
}

export function SubjectTable({ subjects, onDelete }: SubjectTableProps) {
  if (subjects.length === 0) {
    return (
      <div className="bg-white border rounded-md p-8 text-center flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">No subjects found matching your criteria.</p>
        <Link to="/company/subjects/create">
          <Button>Create Subject</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="whitespace-nowrap">Subject Code</TableHead>
              <TableHead className="min-w-[200px]">Subject Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Exam Type</TableHead>
              <TableHead className="hidden xl:table-cell text-right">Marks (Total/Pass)</TableHead>
              <TableHead className="hidden xl:table-cell text-right">Duration</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => {
              const subjectId = String(subject.id || (subject as unknown as Record<string, unknown>)._id || '');
              return (
                <TableRow key={subjectId} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium whitespace-nowrap">{subject.code}</TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{subject.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[250px]" title={subject.description}>
                      {subject.description}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">{subject.category}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600">{subject.examType}</TableCell>
                  <TableCell className="hidden xl:table-cell text-right">
                    <span className="font-medium">{subject.totalMarks}</span> / <span className="text-gray-500">{subject.passingMarks}</span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-right text-gray-600">
                    {subject.durationMinutes} min
                  </TableCell>
                  <TableCell>
                    <SubjectStatusBadge status={subject.status} />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/company/subjects/${subjectId}`}>
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </Link>
                      <Link to={`/company/subjects/${subjectId}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit Subject">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => onDelete?.(subjectId)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

