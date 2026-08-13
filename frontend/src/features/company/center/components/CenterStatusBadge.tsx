import { Badge } from "@/shared/components/ui/badge";

interface CenterStatusBadgeProps {
  status: 'Active' | 'Inactive' | 'Pending' | 'Approved' | 'Rejected' | 'Maintenance' | 'Working' | 'Faulty' | 'Repair';
}

export const CenterStatusBadge = ({ status }: CenterStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Working':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Inactive':
      case 'Rejected':
      case 'Faulty':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Pending':
      case 'Maintenance':
      case 'Repair':
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
