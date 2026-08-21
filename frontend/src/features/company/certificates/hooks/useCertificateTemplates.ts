import { useState, useEffect } from 'react';
import { DUMMY_TEMPLATES } from '../utils/placeholder';
import type { CertificateTemplate } from '../types';

export function useCertificateTemplates() {
  const [data, setData] = useState<{ data: CertificateTemplate[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({ data: DUMMY_TEMPLATES });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
