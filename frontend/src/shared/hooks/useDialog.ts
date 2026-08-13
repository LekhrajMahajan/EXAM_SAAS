import { useState, useCallback } from 'react';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const open = useCallback((dialogData?: any) => {
    setData(dialogData || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
  };
}
