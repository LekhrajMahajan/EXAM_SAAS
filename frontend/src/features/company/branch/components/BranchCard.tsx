import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BranchStatusBadge } from "./BranchStatusBadge";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Branch } from "../types/branch.types";

interface BranchCardProps {
  branch: Branch;
}

export const BranchCard = ({ branch }: BranchCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">
          {branch.branchName}
        </CardTitle>
        <BranchStatusBadge isActive={branch.isActive} />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium text-muted-foreground mb-4">
          Code: {branch.branchCode}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{branch.city}, {branch.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{branch.mobile}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{branch.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
