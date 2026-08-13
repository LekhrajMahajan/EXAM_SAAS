import { StaffHeader } from "../components/StaffHeader";
import { StaffForm } from "../components/StaffForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStaffDetail } from "../hooks/staff.hooks";

export const EditStaffPage = () => {
  const { id } = useParams();
  const { data: res, isLoading } = useStaffDetail(id || "");
  const staff = res?.data;

  if (isLoading || !staff) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to={`/company/staff/${id || staff.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <StaffHeader
          title="Edit Staff Details"
          description={`Updating profile for ${staff.firstName || ''} ${staff.lastName || ''}`}
        />
      </div>

      <StaffForm initialValues={staff as unknown as Record<string, unknown>} isEditing />
    </div>
  );
};

