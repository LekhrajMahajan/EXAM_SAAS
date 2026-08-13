import { Badge } from "@/shared/components/ui/badge";
import type { StaffStatus } from "../types/staff.types";

interface StaffStatusBadgeProps {
  status: StaffStatus;
}

export const StaffStatusBadge = ({ status }: StaffStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Inactive':
      case 'Suspended':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
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
