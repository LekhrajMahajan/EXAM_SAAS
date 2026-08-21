import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Mail, Phone, MapPin, Building, Briefcase } from "lucide-react";
import { StaffStatusBadge } from "./StaffStatusBadge";
import type { StaffDetails } from "../types/staff.types";

interface ProfileCardProps {
  staff: StaffDetails;
}

export const ProfileCard = ({ staff }: ProfileCardProps) => {
  const initials = `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-24 w-24 border-4 border-slate-100">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${staff.firstName}+${staff.lastName}&background=random`} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{staff.firstName} {staff.lastName}</h2>
                <div className="text-muted-foreground flex items-center gap-2 font-medium">
                  <Briefcase className="h-4 w-4" />
                  {staff.role} - {staff.department}
                </div>
              </div>
              <StaffStatusBadge status={staff.status} />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{staff.employeeCode}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {staff.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                {staff.phone}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {staff.center || 'Unassigned'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
