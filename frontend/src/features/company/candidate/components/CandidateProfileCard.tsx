import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { CandidateStatusBadge } from "./CandidateStatusBadge";
import type { Candidate } from "../types/candidate.types";

interface CandidateProfileCardProps {
  candidate: Candidate;
}

export const CandidateProfileCard = ({ candidate }: CandidateProfileCardProps) => {
  const initials = `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-28 w-28 border-4 border-slate-100 shadow-sm rounded-md">
            <AvatarImage src={candidate.photoUrl || `https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`} className="rounded-md object-cover" />
            <AvatarFallback className="text-3xl rounded-md">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {candidate.firstName} {candidate.middleName ? candidate.middleName + ' ' : ''}{candidate.lastName}
                </h2>
                <div className="text-muted-foreground flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4" />
                  {candidate.applicationNo}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <CandidateStatusBadge status={candidate.status} />
                <CandidateStatusBadge status={candidate.approvalStatus} />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{candidate.exam}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {candidate.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                {candidate.mobile}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {candidate.city}, {candidate.state}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                DOB: {new Date(candidate.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
