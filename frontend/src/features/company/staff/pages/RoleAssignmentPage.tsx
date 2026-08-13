import { StaffHeader } from "../components/StaffHeader";
import { RoleSelector } from "../components/RoleSelector";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const RoleAssignmentPage = () => {
  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/staff">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <StaffHeader
          title="Role Assignments"
          description="Assign roles and designation categories to staff members."
        />
      </div>

      <RoleSelector />
    </div>
  );
};
