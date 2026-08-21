import { Badge } from "@/shared/components/ui/badge";

interface CenterStatusBadgeProps {
  status: 'Active' | 'Inactive' | 'Pending' | 'Approved' | 'Rejected' | 'Maintenance' | 'Working' | 'Faulty' | 'Repair';
}

export const CenterStatusBadge = ({ status }: CenterStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'APPROVED':
      case 'WORKING':
        return 'bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 border-transparent';
      case 'INACTIVE':
      case 'REJECTED':
      case 'FAULTY':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
      case 'PENDING':
      case 'MAINTENANCE':
      case 'REPAIR':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80 border-border';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor()} border-0`}>
      {status}
    </Badge>
  );
};
