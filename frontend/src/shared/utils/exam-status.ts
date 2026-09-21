export const getDisplayStatus = (exam: Record<string, any>, now: Date = new Date()) => {
  // If a displayStatus was explicitly set by the API, use it, otherwise fallback to status
  return exam.displayStatus || exam.status || 'UNKNOWN';
};

export const getStatusBadgeConfig = (status?: string): { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" } => {
  if (!status) return { label: 'UNKNOWN', variant: 'outline' };
  const s = status.toUpperCase();
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
    PENDING_EXAM: { label: 'PENDING EXAM', variant: 'outline' },
    ACTIVE: { label: 'ACTIVE', variant: 'outline' },
    EXAM_STARTED: { label: 'EXAM STARTED', variant: 'outline' },
    PENDING_RESULT_GENERATE: { label: 'PENDING RESULT GENERATE', variant: 'outline' },
    RESULT_GENERATED: { label: 'RESULT GENERATED', variant: 'outline' },
    // Keep legacy ones for safety if any old data remains
    DRAFT: { label: 'DRAFT', variant: 'outline' },
    EXAM_ENDED: { label: 'PENDING RESULT GENERATE', variant: 'outline' },
    COMPLETED: { label: 'COMPLETED', variant: 'outline' },
    CANCELLED: { label: 'CANCELLED', variant: 'outline' },
    INACTIVE: { label: 'INACTIVE', variant: 'outline' },
  };
  return config[s] || { label: s.replace(/_/g, ' '), variant: 'outline' };
};
