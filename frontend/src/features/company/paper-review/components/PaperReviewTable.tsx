import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { PaperReview } from '../types';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { Link } from 'react-router-dom';
import { Eye, FileText, History } from 'lucide-react';

interface PaperReviewTableProps {
  reviews: PaperReview[];
}

export const PaperReviewTable: React.FC<PaperReviewTableProps> = ({ reviews }) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper Code</TableHead>
            <TableHead>Paper Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Questions / Marks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.paperCode}</TableCell>
                <TableCell>{review.paperName}</TableCell>
                <TableCell>{review.subject}</TableCell>
                <TableCell>{review.reviewerName}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {review.totalQuestions} Qs / {review.totalMarks} Mks
                  </div>
                </TableCell>
                <TableCell>
                  <ReviewStatusBadge status={review.status} />
                </TableCell>
                <TableCell>
                  <Badge variant={review.priority === 'High' ? 'destructive' : review.priority === 'Medium' ? 'default' : 'secondary'}>
                    {review.priority}
                  </Badge>
                </TableCell>
                <TableCell>{review.assignedDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/company/paper-review/${review.id}`}>
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/company/paper-review/${review.id}/review`}>
                      <Button variant="ghost" size="icon" title="Workspace">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/company/paper-review/history?paperId=${review.paperId}`}>
                      <Button variant="ghost" size="icon" title="History">
                        <History className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
