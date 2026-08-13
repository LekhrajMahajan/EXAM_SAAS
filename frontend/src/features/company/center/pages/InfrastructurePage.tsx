import { CenterHeader } from "../components/CenterHeader";
import { InfrastructureCard } from "../components/InfrastructureCard";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../hooks/center.hooks";
import type { Center, Infrastructure } from "../types/center.types";

export const InfrastructurePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCenter(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const center = data?.data as Center | undefined;
  const centerName = center?.centerName || 'Center';
  const infrastructure = (center as unknown as { infrastructure?: Infrastructure })?.infrastructure;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link to={`/company/centers/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CenterHeader
            title="Infrastructure Details"
            description={`Managing infrastructure for ${centerName}`}
            actions={
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Update Infrastructure
              </Button>
            }
          />
        </div>
      </div>

      {infrastructure ? (
        <InfrastructureCard data={infrastructure} />
      ) : (
        <div className="flex justify-center items-center h-40 border rounded-md bg-white text-muted-foreground">
          No infrastructure data available for this center yet.
        </div>
      )}
    </div>
  );
};

