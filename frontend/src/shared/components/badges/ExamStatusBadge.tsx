import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { getDisplayStatus, getStatusBadgeConfig } from '@/shared/utils/exam-status';

interface ExamStatusBadgeProps {
  exam: any;
  className?: string;
}

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ exam, className = '' }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Re-evaluate the time every 30 seconds to update dynamic states
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!exam) return null;

  const currentStatus = getDisplayStatus(exam, now);
  const config = getStatusBadgeConfig(currentStatus);

  return (
    <Badge className={`text-[11px] px-2.5 py-0.5 font-medium border-transparent uppercase tracking-wide ${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
};
