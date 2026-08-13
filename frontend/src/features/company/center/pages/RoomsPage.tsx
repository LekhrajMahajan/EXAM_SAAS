import { CenterHeader } from "../components/CenterHeader";
import { RoomTable } from "../components/RoomTable";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../hooks/center.hooks";
import type { Center, Room } from "../types/center.types";

export const RoomsPage = () => {
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
  const rooms = ((center as unknown as { rooms?: Room[] })?.rooms || []) as Room[];

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
            title="Manage Rooms"
            description={`Configuring rooms for ${centerName}`}
            actions={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            }
          />
        </div>
      </div>

      <RoomTable rooms={rooms} />
    </div>
  );
};

