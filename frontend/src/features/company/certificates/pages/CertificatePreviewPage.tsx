import React from 'react';
import { CertificateDetailsPage } from './CertificateDetailsPage';

export function CertificatePreviewPage() {
  // Reuse CertificateDetailsPage as it effectively contains the preview logic
  return <CertificateDetailsPage />;
}
