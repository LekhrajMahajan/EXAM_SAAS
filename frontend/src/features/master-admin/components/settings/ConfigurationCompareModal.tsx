import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface ConfigurationCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldValue: any;
  newValue: any;
}

export const ConfigurationCompareModal: React.FC<ConfigurationCompareModalProps> = ({
  isOpen,
  onClose,
  oldValue,
  newValue,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configuration Changes</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-4 bg-muted/20">
            <h3 className="text-sm font-semibold mb-2 text-destructive">Previous Value</h3>
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(oldValue, null, 2) || 'null'}
            </pre>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/20">
            <h3 className="text-sm font-semibold mb-2 text-success">New Value</h3>
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(newValue, null, 2) || 'null'}
            </pre>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
