export const getDisplayStatus = (exam: Record<string, any>, now: Date = new Date()) => {
  if (exam.displayStatus) return exam.displayStatus;
  
  if (exam.isResultPublished) return 'RESULT_PUBLISHED';
  if (exam.isResultGenerated) return 'PENDING_PUBLISH_RESULT';
  
  if (exam.status === 'EXAM_ENDED' || exam.status === 'COMPLETED') return 'PENDING_RESULT_GENERATE';
  
  if (['CANCELLED', 'ARCHIVED', 'PENDING_RESULT_GENERATE', 'PENDING_PUBLISH_RESULT', 'RESULT_PUBLISHED'].includes(exam.status)) return exam.status;

  if (exam.status === 'ACTIVE' || exam.status === 'EXAM_STARTED') {
    try {
      const examDate = new Date(exam.examDate);
      const [startH, startM] = (exam.startTime || '').split(':').map(Number);
      if (isNaN(startH) || isNaN(startM)) return exam.status;
      const startDT = new Date(examDate);
      startDT.setHours(startH, startM, 0, 0);

      const [endH, endM] = (exam.endTime || '').split(':').map(Number);
      if (!isNaN(endH) && !isNaN(endM)) {
        const endDT = new Date(examDate);
        endDT.setHours(endH, endM, 0, 0);
        
        if (endDT < startDT) {
          endDT.setDate(endDT.getDate() + 1);
        }

        if (now >= endDT) return 'PENDING_RESULT_GENERATE';
        if (now >= startDT) return 'EXAM_STARTED';
      } else {
        if (now >= startDT) return 'EXAM_STARTED';
      }
    } catch {
      // fallback
    }
  }
  return exam.status;
};

export const getStatusBadgeConfig = (status?: string): { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" } => {
  if (!status) return { label: 'UNKNOWN', variant: 'outline' };
  const s = status.toUpperCase();
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
    ACTIVE: { label: 'ACTIVE', variant: 'outline' },
    DRAFT: { label: 'DRAFT', variant: 'outline' },
    EXAM_STARTED: { label: 'EXAM STARTED', variant: 'outline' },
    EXAM_ENDED: { label: 'PENDING RESULT GENERATE', variant: 'outline' },
    PENDING_RESULT_GENERATE: { label: 'PENDING RESULT GENERATE', variant: 'outline' },
    PENDING_PUBLISH_RESULT: { label: 'PENDING PUBLISH RESULT', variant: 'outline' },
    RESULT_PUBLISHED: { label: 'RESULT PUBLISHED', variant: 'outline' },
    COMPLETED: { label: 'COMPLETED', variant: 'outline' },
    CANCELLED: { label: 'CANCELLED', variant: 'outline' },
    INACTIVE: { label: 'INACTIVE', variant: 'outline' },
  };
  return config[s] || { label: s.replace(/_/g, ' '), variant: 'outline' };
};
