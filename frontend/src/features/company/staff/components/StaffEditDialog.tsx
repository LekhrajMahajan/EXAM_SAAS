import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { StaffForm } from './StaffForm';
import type { Staff } from '../types/staff.types';

interface StaffEditDialogProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffEditDialog = ({ staff, isOpen, onClose, onSuccess }: StaffEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800 text-slate-50 overflow-y-auto max-h-[90vh]">
        {staff && (
          <StaffForm 
            initialValues={staff} 
            isEditing 
            onSuccess={onSuccess} 
            onCancel={onClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
