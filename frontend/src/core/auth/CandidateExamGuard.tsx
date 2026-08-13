import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const CandidateExamGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('candidate_exam_token');
  const info = localStorage.getItem('candidate_info');

  if (!token || !info) {
    return <Navigate to="/auth/candidate-login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
