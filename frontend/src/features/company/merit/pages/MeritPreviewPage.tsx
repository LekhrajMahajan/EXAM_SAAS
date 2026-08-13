import React from 'react';
import { MeritDetailsPage } from './MeritDetailsPage';

export function MeritPreviewPage() {
  // Reuse MeritDetailsPage since it displays the CandidateRankCard
  // which acts as the perfect preview of the candidate's rank.
  return <MeritDetailsPage />;
}
