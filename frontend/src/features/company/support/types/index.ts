export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketCategory = 'Technical Issue' | 'Billing' | 'Exam Rules' | 'Account Access' | 'Feature Request' | 'Other';

export interface SupportStatistics {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
  avgResolutionTimeHours: number;
  slaCompliancePercent: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  raisedBy: {
    name: string;
    role: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    team: string;
  };
  relatedModule?: string;
  createdDate: string;
  lastUpdated: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: { name: string; url: string; size: string }[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  lastUpdated: string;
  views: number;
  helpfulCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TicketTimelineEvent {
  id: string;
  timestamp: string;
  type: 'StatusChange' | 'Assignment' | 'Comment' | 'Creation';
  description: string;
  user: string;
}
