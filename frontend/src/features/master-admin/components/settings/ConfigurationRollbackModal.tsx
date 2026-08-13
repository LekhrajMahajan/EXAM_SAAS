import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { useRollbackConfiguration } from '../../hooks/configuration-history.hooks';
import type { IConfigurationHistory } from '../../types/configuration-history.types';

interface ConfigurationRollbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: IConfigurationHistory;
}

export const ConfigurationRollbackModal: React.FC<ConfigurationRollbackModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const [reason, setReason] = useState('');
  const rollbackMutation = useRollbackConfiguration();

  const handleRollback = () => {
    rollbackMutation.mutate(
      { id: record._id, reason },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Rollback</DialogTitle>
          <DialogDescription>
            You are about to rollback <strong>{record.configurationName}</strong> to version {record.version - 1 || 'its previous state'}.
            This action will be logged in the history.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <label className="text-sm font-medium">Rollback Reason (Required)</label>
          <Textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            placeholder="Please provide a reason for rolling back this configuration..."
            className="mt-2"
          />
        </div>
        
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={rollbackMutation.isPending}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleRollback} 
            disabled={!reason.trim() || rollbackMutation.isPending}
          >
            {rollbackMutation.isPending ? 'Rolling back...' : 'Confirm Rollback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
