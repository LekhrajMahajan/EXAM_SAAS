import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { BranchStatusBadge } from "./BranchStatusBadge";
import { Link } from "react-router-dom";
import type { Branch } from "../types/branch.types";

interface BranchTableProps {
  branches: Branch[];
}

export const BranchTable = ({ branches }: BranchTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <TableRow key={branch._id}>
                <TableCell className="font-medium">{branch.branchCode}</TableCell>
                <TableCell>{branch.branchName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{branch.city}</span>
                    <span className="text-xs text-muted-foreground">{branch.state}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{branch.managerName || '-'}</span>
                    <span className="text-xs text-muted-foreground">{branch.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <BranchStatusBadge status={branch.status} />
                </TableCell>
                <TableCell>{new Date(branch.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/company/branches/${branch._id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/company/branches/${branch._id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No branches found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
