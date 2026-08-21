import { Badge } from "@/shared/components/ui/badge";
import type { StaffStatus } from "../types/staff.types";

interface StaffStatusBadgeProps {
  status: StaffStatus;
}

export const StaffStatusBadge = ({ status }: StaffStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 border-transparent';
      case 'INACTIVE':
      case 'SUSPENDED':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
      case 'ON LEAVE':
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
