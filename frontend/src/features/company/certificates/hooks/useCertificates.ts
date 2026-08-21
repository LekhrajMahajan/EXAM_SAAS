import { useState, useEffect } from 'react';
import type { CertificateRecord, CertificateStatistics } from '../types';

export function useCertificates() {
  const [data, setData] = useState<{ data: CertificateRecord[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({ data: [] });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

export function useCertificateStats() {
  const [data, setData] = useState<{ data: CertificateStatistics } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({ 
        data: {
          totalCertificates: 0,
          generatedCertificates: 0,
          downloadedCertificates: 0,
          verifiedCertificates: 0,
          pendingCertificates: 0,
          expiredCertificates: 0
        }
      });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
