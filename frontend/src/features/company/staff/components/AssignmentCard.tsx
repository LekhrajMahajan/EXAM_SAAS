import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import type { StaffDetails } from "../types/staff.types";

interface AssignmentCardProps {
  assignments: StaffDetails['assignments'];
}

export const AssignmentCard = ({ assignments }: AssignmentCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-bold">{assignment.name}</CardTitle>
              <Badge variant={assignment.status === 'Active' ? 'default' : 'secondary'}>
                {assignment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium text-foreground">{assignment.role}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">{assignment.type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(assignment.startDate).toLocaleDateString()} 
                  {assignment.endDate ? ` - ${new Date(assignment.endDate).toLocaleDateString()}` : ' - Present'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {assignments.length === 0 && (
        <div className="col-span-full p-8 text-center border rounded-md bg-muted/20">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No current assignments.</p>
        </div>
      )}
    </div>
  );
};
