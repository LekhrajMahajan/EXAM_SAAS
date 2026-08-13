import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { GenericDialog, type DialogType } from '@/shared/components/dialogs/DialogComponents';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: DialogType;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => () => {});

  const confirm = useCallback((opts: ConfirmOptions | string): Promise<boolean> => {
    if (typeof opts === 'string') {
      setOptions({ message: opts });
    } else {
      setOptions(opts);
    }
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolver(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolver(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <GenericDialog
        isOpen={isOpen}
        title={options.title || 'Please Confirm'}
        message={options.message}
        confirmLabel={options.confirmLabel || 'Confirm'}
        cancelLabel={options.cancelLabel || 'Cancel'}
        type={options.type || 'confirm'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
