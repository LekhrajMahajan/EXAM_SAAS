import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, Building, Monitor } from "lucide-react";

interface CenterStatisticsProps {
  capacity: {
    maxCandidates: number;
    maxRooms: number;
    maxSystems: number;
  };
}

export const CenterStatistics = ({ capacity }: CenterStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Max Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{capacity.maxCandidates}</div>
          <p className="text-xs text-muted-foreground">Total seating capacity</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{capacity.maxRooms}</div>
          <p className="text-xs text-muted-foreground">Available examination rooms</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
          <Monitor className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{capacity.maxSystems}</div>
          <p className="text-xs text-muted-foreground">Total computer systems</p>
        </CardContent>
      </Card>
    </div>
  );
};
