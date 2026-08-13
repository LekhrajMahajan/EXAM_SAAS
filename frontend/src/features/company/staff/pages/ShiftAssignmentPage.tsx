import { StaffHeader } from "../components/StaffHeader";
import { AssignmentCard } from "../components/AssignmentCard";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStaffDetail } from "../hooks/staff.hooks";

export const ShiftAssignmentPage = () => {
  const { id } = useParams();
  const { data: res, isLoading } = useStaffDetail(id || "");
  const staff = res?.data;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/staff">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <StaffHeader
            title="Shift & Duty Assignments"
            description="Manage center, exam, and shift duties for staff members."
            actions={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            }
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AssignmentCard assignments={staff?.assignments || []} />
      )}
    </div>
  );
};

