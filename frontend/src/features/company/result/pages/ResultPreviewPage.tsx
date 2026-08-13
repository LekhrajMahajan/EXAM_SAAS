import React from 'react';
import { ResultDetailsPage } from './ResultDetailsPage';

export function ResultPreviewPage() {
  // We can just reuse ResultDetailsPage since they are visually similar based on the components built.
  // In a real app, this might have specific printing/downloading features.
  return <ResultDetailsPage />;
}
