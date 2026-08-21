export const queryKeys = {
  // Base factories
  all: ['all'] as const,
  
  // Specific domains
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.companies.lists(), { filters }] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.companies.details(), id] as const,
  },
  
  centers: {
    all: ['centers'] as const,
    lists: () => [...queryKeys.centers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.centers.lists(), { filters }] as const,
    details: () => [...queryKeys.centers.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.centers.details(), id] as const,
  },
  
  subjects: {
    all: ['subjects'] as const,
    lists: () => [...queryKeys.subjects.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.subjects.lists(), { filters }] as const,
    details: () => [...queryKeys.subjects.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.subjects.details(), id] as const,
  },
  
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.employees.lists(), { filters }] as const,
    details: () => [...queryKeys.employees.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.employees.details(), id] as const,
  },
  
  candidates: {
    all: ['candidates'] as const,
    lists: () => [...queryKeys.candidates.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.candidates.lists(), { filters }] as const,
    details: () => [...queryKeys.candidates.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.candidates.details(), id] as const,
  },
  
  questionBank: {
    all: ['questionBank'] as const,
    lists: () => [...queryKeys.questionBank.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.questionBank.lists(), { filters }] as const,
    details: () => [...queryKeys.questionBank.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.questionBank.details(), id] as const,
  },

  papers: {
    all: ['papers'] as const,
    lists: () => [...queryKeys.papers.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.papers.lists(), { filters }] as const,
    details: () => [...queryKeys.papers.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.papers.details(), id] as const,
  },

  paperReviews: {
    all: ['paperReviews'] as const,
    lists: () => [...queryKeys.paperReviews.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.paperReviews.lists(), { filters }] as const,
    details: () => [...queryKeys.paperReviews.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.paperReviews.details(), id] as const,
  },

  paperApprovals: {
    all: ['paperApprovals'] as const,
    lists: () => [...queryKeys.paperApprovals.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.paperApprovals.lists(), { filters }] as const,
    details: () => [...queryKeys.paperApprovals.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.paperApprovals.details(), id] as const,
  },

  exams: {
    all: ['exams'] as const,
    lists: () => [...queryKeys.exams.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.exams.lists(), { filters }] as const,
    details: () => [...queryKeys.exams.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.exams.details(), id] as const,
  },

  shifts: {
    all: ['shifts'] as const,
    lists: () => [...queryKeys.shifts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.shifts.lists(), { filters }] as const,
    details: () => [...queryKeys.shifts.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.shifts.details(), id] as const,
  },

  admitCards: {
    all: ['admitCards'] as const,
    lists: () => [...queryKeys.admitCards.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.admitCards.lists(), { filters }] as const,
    details: () => [...queryKeys.admitCards.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.admitCards.details(), id] as const,
  },

  attendance: {
    all: ['attendance'] as const,
    lists: () => [...queryKeys.attendance.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.attendance.lists(), { filters }] as const,
    details: () => [...queryKeys.attendance.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.attendance.details(), id] as const,
  },

  biometric: {
    all: ['biometric'] as const,
    lists: () => [...queryKeys.biometric.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.biometric.lists(), { filters }] as const,
    details: () => [...queryKeys.biometric.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.biometric.details(), id] as const,
  },

  examArena: {
    all: ['examArena'] as const,
    lists: () => [...queryKeys.examArena.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.examArena.lists(), { filters }] as const,
    details: () => [...queryKeys.examArena.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.examArena.details(), id] as const,
  },

  results: {
    all: ['results'] as const,
    lists: () => [...queryKeys.results.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.results.lists(), { filters }] as const,
    details: () => [...queryKeys.results.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.results.details(), id] as const,
  },

  merit: {
    all: ['merit'] as const,
    lists: () => [...queryKeys.merit.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.merit.lists(), { filters }] as const,
    details: () => [...queryKeys.merit.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.merit.details(), id] as const,
  },

  certificates: {
    all: ['certificates'] as const,
    lists: () => [...queryKeys.certificates.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.certificates.lists(), { filters }] as const,
    details: () => [...queryKeys.certificates.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.certificates.details(), id] as const,
  },

  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.reports.lists(), { filters }] as const,
    details: () => [...queryKeys.reports.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.reports.details(), id] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.notifications.lists(), { filters }] as const,
    details: () => [...queryKeys.notifications.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.notifications.details(), id] as const,
  },

  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.payments.lists(), { filters }] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.payments.details(), id] as const,
  },

  support: {
    all: ['support'] as const,
    lists: () => [...queryKeys.support.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.support.lists(), { filters }] as const,
    details: () => [...queryKeys.support.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.support.details(), id] as const,
  },

  audit: {
    all: ['audit'] as const,
    lists: () => [...queryKeys.audit.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.audit.lists(), { filters }] as const,
    details: () => [...queryKeys.audit.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.audit.details(), id] as const,
  },

  importExport: {
    all: ['importExport'] as const,
    lists: () => [...queryKeys.importExport.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.importExport.lists(), { filters }] as const,
    details: () => [...queryKeys.importExport.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.importExport.details(), id] as const,
  },

  fileManagement: {
    all: ['fileManagement'] as const,
    lists: () => [...queryKeys.fileManagement.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.fileManagement.lists(), { filters }] as const,
    details: () => [...queryKeys.fileManagement.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.fileManagement.details(), id] as const,
  },

  systemSettings: {
    all: ['systemSettings'] as const,
    lists: () => [...queryKeys.systemSettings.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.systemSettings.lists(), { filters }] as const,
    details: () => [...queryKeys.systemSettings.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.systemSettings.details(), id] as const,
  },

  developerTools: {
    all: ['developerTools'] as const,
    lists: () => [...queryKeys.developerTools.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.developerTools.lists(), { filters }] as const,
    details: () => [...queryKeys.developerTools.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.developerTools.details(), id] as const,
  },
};
