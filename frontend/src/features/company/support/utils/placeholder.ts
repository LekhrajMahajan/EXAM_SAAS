import type { SupportStatistics, SupportTicket, TicketComment, KnowledgeArticle, FaqItem, TicketTimelineEvent } from '../types';

export const DUMMY_SUPPORT_STATS: SupportStatistics = {
  totalTickets: 12450,
  openTickets: 142,
  inProgress: 56,
  resolved: 11200,
  closed: 1052,
  highPriority: 18,
  avgResolutionTimeHours: 4.5,
  slaCompliancePercent: 98.2,
};

export const DUMMY_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1001',
    ticketNumber: 'TKT-1001',
    subject: 'Unable to access Exam Portal',
    description: 'When I try to login to the exam portal, it says my account is locked.',
    category: 'Account Access',
    priority: 'Urgent',
    status: 'Open',
    raisedBy: { name: 'John Doe', role: 'Candidate', email: 'john@example.com' },
    createdDate: '2026-10-25 09:00:00',
    lastUpdated: '2026-10-25 09:15:00',
  },
  {
    id: 'TKT-1002',
    ticketNumber: 'TKT-1002',
    subject: 'Questions not loading for Mock Test',
    description: 'The math section in the mock test is showing blank questions.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'In Progress',
    raisedBy: { name: 'Jane Smith', role: 'Candidate', email: 'jane@example.com' },
    assignedTo: { name: 'Tech Support Team', team: 'L2 Support' },
    relatedModule: 'Exam Arena',
    createdDate: '2026-10-25 10:30:00',
    lastUpdated: '2026-10-25 11:45:00',
  },
  {
    id: 'TKT-1003',
    ticketNumber: 'TKT-1003',
    subject: 'Request for Name Change',
    description: 'My name is misspelled in the admit card.',
    category: 'Other',
    priority: 'Medium',
    status: 'Resolved',
    raisedBy: { name: 'Alex Johnson', role: 'Candidate', email: 'alex@example.com' },
    assignedTo: { name: 'Admin Staff', team: 'Operations' },
    createdDate: '2026-10-24 14:20:00',
    lastUpdated: '2026-10-25 09:00:00',
  },
  {
    id: 'TKT-1004',
    ticketNumber: 'TKT-1004',
    subject: 'Payment failed but amount deducted',
    description: 'I tried to pay for the premium mock tests but the transaction failed.',
    category: 'Billing',
    priority: 'High',
    status: 'Open',
    raisedBy: { name: 'Sam Wilson', role: 'Candidate', email: 'sam@example.com' },
    createdDate: '2026-10-25 13:10:00',
    lastUpdated: '2026-10-25 13:10:00',
  }
];

export const DUMMY_COMMENTS: TicketComment[] = [
  {
    id: 'CMT-1',
    ticketId: 'TKT-1002',
    author: { name: 'Jane Smith', role: 'Candidate' },
    content: 'Attached is a screenshot of the blank screen I am seeing.',
    timestamp: '2026-10-25 10:35:00',
    isInternal: false,
    attachments: [{ name: 'error.png', url: '#', size: '245 KB' }]
  },
  {
    id: 'CMT-2',
    ticketId: 'TKT-1002',
    author: { name: 'Support Agent Bob', role: 'L2 Support' },
    content: 'Looks like a CDN issue for the image assets. Escalating to engineering.',
    timestamp: '2026-10-25 11:00:00',
    isInternal: true,
  },
  {
    id: 'CMT-3',
    ticketId: 'TKT-1002',
    author: { name: 'Support Agent Bob', role: 'L2 Support' },
    content: 'Hi Jane, our engineering team is looking into this issue. We apologize for the inconvenience.',
    timestamp: '2026-10-25 11:05:00',
    isInternal: false,
  }
];

export const DUMMY_TIMELINE: TicketTimelineEvent[] = [
  {
    id: 'EV-1',
    timestamp: '2026-10-25 10:30:00',
    type: 'Creation',
    description: 'Ticket created via Web Portal',
    user: 'Jane Smith'
  },
  {
    id: 'EV-2',
    timestamp: '2026-10-25 10:45:00',
    type: 'Assignment',
    description: 'Ticket assigned to L2 Support Team',
    user: 'System'
  },
  {
    id: 'EV-3',
    timestamp: '2026-10-25 11:45:00',
    type: 'StatusChange',
    description: 'Status changed from Open to In Progress',
    user: 'Support Agent Bob'
  }
];

export const DUMMY_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'How to Reset Your Password',
    category: 'Account Access',
    excerpt: 'Step-by-step guide to resetting your password if you forgot it or are locked out.',
    author: 'Admin Team',
    lastUpdated: '2026-09-15',
    views: 4520,
    helpfulCount: 340
  },
  {
    id: 'KB-002',
    title: 'Browser Requirements for Exams',
    category: 'Technical Support',
    excerpt: 'List of supported browsers and required settings for a smooth exam experience.',
    author: 'Tech Support',
    lastUpdated: '2026-10-01',
    views: 12500,
    helpfulCount: 1102
  },
  {
    id: 'KB-003',
    title: 'Understanding Your Merit Rank',
    category: 'Results & Merit',
    excerpt: 'Detailed explanation of how merit ranks are calculated across different categories.',
    author: 'Exam Board',
    lastUpdated: '2026-08-20',
    views: 8900,
    helpfulCount: 850
  }
];

export const DUMMY_FAQS: FaqItem[] = [
  {
    id: 'FAQ-1',
    question: 'Can I change my exam center after submitting the application?',
    answer: 'Exam centers can only be changed during the official correction window. Once the correction window closes, no changes are permitted under any circumstances.',
    category: 'Application Process'
  },
  {
    id: 'FAQ-2',
    question: 'What documents do I need to bring on exam day?',
    answer: 'You must bring a printed copy of your Admit Card and an original, valid Photo ID (Aadhar, PAN, Passport, or Driving License). Digital copies will not be accepted.',
    category: 'Exam Day'
  },
  {
    id: 'FAQ-3',
    question: 'How long does it take for payment refunds?',
    answer: 'Refunds for failed transactions are automatically processed within 5-7 business days to the original payment method.',
    category: 'Billing & Payments'
  }
];
