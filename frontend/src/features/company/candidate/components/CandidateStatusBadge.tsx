import { Badge } from "@/shared/components/ui/badge";
import type { CandidateStatus, ApprovalStatus } from "../types/candidate.types";

interface CandidateStatusBadgeProps {
  status: CandidateStatus | ApprovalStatus;
}

export const CandidateStatusBadge = ({ status }: CandidateStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Submitted':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor()} border-0`}>
      {status}
    </Badge>
  );
};
