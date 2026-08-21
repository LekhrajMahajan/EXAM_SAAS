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

export const getStatusBadgeConfig = (status?: string) => {
  if (!status) return { label: 'UNKNOWN', className: 'bg-slate-500 text-white' };
  const s = status.toUpperCase();
  const config: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'ACTIVE', className: 'bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-[#E4FD97]' },
    DRAFT: { label: 'DRAFT', className: 'bg-slate-500 hover:bg-slate-600 text-white' },
    EXAM_STARTED: { label: 'EXAM STARTED', className: 'bg-amber-600 hover:bg-amber-700 text-white' },
    EXAM_ENDED: { label: 'PENDING RESULT GENERATE', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    PENDING_RESULT_GENERATE: { label: 'PENDING RESULT GENERATE', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    PENDING_PUBLISH_RESULT: { label: 'PENDING PUBLISH RESULT', className: 'bg-purple-600 hover:bg-purple-700 text-white' },
    RESULT_PUBLISHED: { label: 'RESULT PUBLISHED', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    COMPLETED: { label: 'COMPLETED', className: 'bg-slate-600 hover:bg-slate-700 text-white' },
    CANCELLED: { label: 'CANCELLED', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    INACTIVE: { label: 'INACTIVE', className: 'bg-gray-400 hover:bg-gray-500 text-white' },
  };
  return config[s] || { label: s.replace(/_/g, ' '), className: 'bg-slate-500 text-white' };
};
