import { 
  Home, 
  Users, 
  Settings, 
  ShieldCheck, 
  BarChart, 
  Building2,
  ClipboardCheck,
  CreditCard,
  Package,
  Receipt,
  UserCog,
  FileSignature,
  Activity,
  Ticket,
  UserCircle,
  LayoutDashboard,
  IndianRupee,
  UserCheck,
  CalendarCheck,
  Award,
  PieChart,
  Shield,
  History,
  Smartphone,
  Bell,
  Mail,
  HardDrive,
  Database,
  Plug,
  Monitor,
  UserPlus,
  Upload,
  ImageIcon,
  MapPin,
  Network,
  ClipboardList,
  FileText
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LucideProps } from 'lucide-react';

export type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export interface SidebarMenuItem {
  id: string;
  title: string;
  icon?: IconComponent;
  path: string;
  children?: SidebarMenuItem[];
  roles?: string[];
  permissions?: string[];
  requiredFeature?: string;
  badgeValue?: string | number;
  category?: string;
  moduleKey?: string;
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  // --- Standard / Shared Routes ---

  // --- Master Admin Routes ---
  {
    id: 'ma-dashboard',
    title: 'Master Dashboard',
    icon: Home,
    path: '/master-admin/dashboard',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-companies',
    title: 'Companies',
    icon: Building2,
    path: '/master-admin/companies',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-company-approval',
    title: 'Company Approval',
    icon: ClipboardCheck,
    path: '/master-admin/company-approvals',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-subscriptions',
    title: 'Subscriptions',
    icon: CreditCard,
    path: '/master-admin/subscriptions',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-plans',
    title: 'Plans',
    icon: Package,
    path: '/master-admin/plans',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-invoices',
    title: 'Invoices',
    icon: IndianRupee,
    path: '/master-admin/invoices',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-access-management',
    title: 'Access Management',
    icon: UserCog,
    path: '/master-admin/access-management',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-security',
    title: 'Security',
    icon: ShieldCheck,
    path: '/master-admin/security',
    roles: ['Master Admin'],
    children: [
      {
        id: 'ma-security-dashboard',
        title: 'Security Dashboard',
        path: '/master-admin/security',
        icon: LayoutDashboard,
      },
      {
        id: 'ma-login-sessions',
        title: 'Login Sessions',
        path: '/master-admin/security/sessions',
        icon: History,
      },
      {
        id: 'ma-trusted-devices',
        title: 'Trusted Devices',
        path: '/master-admin/security/devices',
        icon: Smartphone,
      }
    ]
  },
  {
    id: 'ma-activity-logs',
    title: 'Activity Logs',
    icon: Activity,
    path: '/master-admin/activity-logs',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-reports',
    title: 'Reports',
    icon: BarChart,
    path: '/master-admin/reports',
    roles: ['Master Admin'],
    children: [
      {
        id: "ma-reports-dashboard",
        title: "Reports Dashboard",
        path: "/master-admin/reports/dashboard",
        icon: LayoutDashboard,
      },

      {
        id: 'ma-reports-user-access',
        title: 'User & Access Reports',
        path: '/master-admin/reports/user-access',
        icon: Users,
      },
      {
        id: 'ma-reports-candidates',
        title: 'Candidate Reports',
        path: '/master-admin/reports/candidates',
        icon: UserCheck,
      },
      {
        id: 'ma-reports-exams',
        title: 'Exam Reports',
        path: '/master-admin/reports/exams',
        icon: ClipboardCheck,
      },
      {
        id: 'ma-reports-attendance',
        title: 'Attendance Reports',
        path: '/master-admin/reports/attendance',
        icon: CalendarCheck,
      },
      {
        id: 'ma-reports-results',
        title: 'Result & Merit Reports',
        path: '/master-admin/reports/results',
        icon: Award,
      },
      {
        id: 'ma-reports-financial',
        title: 'Financial Reports',
        path: '/master-admin/reports/financial',
        icon: PieChart,
      },
      {
        id: 'ma-reports-security',
        title: 'Security Reports',
        path: '/master-admin/reports/security',
        icon: ShieldCheck,
      }
    ]
  },
  {
    id: 'ma-system-settings',
    title: 'System Settings',
    icon: Settings,
    path: '/master-admin/system-settings',
    roles: ['Master Admin'],
    children: [
      {
        id: 'ma-system-settings-general',
        title: 'General Settings',
        path: '/master-admin/settings/general',
        icon: Settings,
      },
      {
        id: 'ma-system-settings-organization',
        title: 'Organization Settings',
        path: '/master-admin/settings/organization',
        icon: Building2,
      },
      {
        id: 'ma-system-settings-security',
        title: 'Security Policies',
        path: '/master-admin/settings/security',
        icon: Shield,
      },
      {
        id: 'ma-system-settings-notifications',
        title: 'Notification Settings',
        path: '/master-admin/settings/notifications',
        icon: Bell,
      },
      {
        id: 'ma-system-settings-gateways',
        title: 'Email & SMS Gateways',
        path: '/master-admin/settings/gateways',
        icon: Mail,
      },
      {
        id: 'ma-system-settings-integrations',
        title: 'Dynamic Integrations',
        path: '/master-admin/settings/integrations',
        icon: Plug,
      },
      {
        id: 'ma-system-settings-storage',
        title: 'Storage & File Management',
        path: '/master-admin/settings/storage',
        icon: HardDrive,
      },
      {
        id: 'ma-system-settings-backup',
        title: 'Backup & Restore',
        path: '/master-admin/settings/backup',
        icon: Database,
      },
      {
        id: 'ma-system-settings-exam',
        title: 'Exam Configuration',
        path: '/master-admin/settings/exam-configuration',
        icon: ClipboardCheck,
      },
      {
        id: 'ma-system-settings-configuration-history',
        title: 'Audit & Configuration History',
        path: '/master-admin/settings/configuration-history',
        icon: History,
      }
    ]
  },
  {
    id: 'ma-support-tickets',
    title: 'Support Tickets',
    icon: Ticket,
    path: '/master-admin/support-tickets',
    roles: ['Master Admin'],
  },
  {
    id: 'ma-profile',
    title: 'Profile',
    icon: UserCircle,
    path: '/master-admin/profile',
    roles: ['Master Admin'],
  },
  
  // --- Company Admin Routes ---
  {
    id: 'ca-dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/company/dashboard',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-subscription',
    title: 'Subscription',
    icon: Award,
    path: '/company/subscription',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-branches',
    title: 'Branches & Centers',
    icon: Building2,
    path: '/company/branches',
    roles: ['Company Admin'],
    children: [
      {
        id: 'ca-branches-list',
        title: 'Branches',
        path: '/company/branches',
        roles: ['Company Admin'],
      },
      {
        id: 'ca-centers-list',
        title: 'Centers',
        path: '/company/centers',
        roles: ['Company Admin'],
      }
    ]
  },
  {
    id: 'ca-staff',
    title: 'Generate Role Credentials',
    icon: Users,
    path: '/company/staff',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-exam-manager-details',
    title: 'Exam Manager Details',
    icon: FileSignature,
    path: '/company/exam-manager-details',
    roles: ['Company Admin'],
    children: [
      {
        id: 'ca-show-exams',
        title: 'Show Exam',
        icon: FileSignature,
        path: '/company/exams',
        roles: ['Company Admin'],
      },
      {
        id: 'ca-subject-topics',
        title: 'Subject Topics',
        icon: FileSignature,
        path: '/company/subject-topics',
        roles: ['Company Admin'],
      }
    ]
  },
  {
    id: 'ca-paper-setter-group',
    title: 'Paper Setter',
    icon: UserPlus,
    path: '/company/paper-setter-group',
    roles: ['Company Admin'],
    children: [
      {
        id: 'ca-paper-setter-create',
        title: 'Paper Setter Create',
        icon: UserPlus,
        path: '/company/paper-setters',
        roles: ['Company Admin'],
      },
      {
        id: 'ca-final-papers',
        title: 'Final Papers',
        icon: FileSignature,
        path: '/company/final-papers',
        roles: ['Company Admin'],
      }
    ]
  },
  {
    id: 'ca-candidates',
    title: 'Candidates',
    icon: UserCircle,
    path: '/company/candidates',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-papers',
    title: 'Send center assign exam',
    icon: FileSignature,
    path: '/company/papers',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-question-bank',
    title: 'Question Bank',
    icon: Package,
    path: '/company/question-bank',
    roles: ['Company Admin'],
    requiredFeature: 'questionBank',
  },
  {
    id: 'ca-shifts',
    title: 'Shift & Scheduling',
    icon: Activity,
    path: '/company/shifts',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-results',
    title: 'Results',
    icon: Receipt,
    path: '/company/results',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-live-monitoring',
    title: 'Live Monitoring',
    icon: Activity,
    path: '/company/live-monitoring',
    roles: ['Company Admin'],
    requiredFeature: 'liveMonitoring',
  },
  {
    id: 'ca-merit',
    title: 'Merit List',
    icon: Ticket,
    path: '/company/merit',
    roles: ['Company Admin'],
    requiredFeature: 'meritList',
  },
  {
    id: 'ca-certificates',
    title: 'Certificates',
    icon: ClipboardCheck,
    path: '/company/certificates',
    roles: ['Company Admin'],
    requiredFeature: 'certificate',
  },
  {
    id: 'ca-reports',
    title: 'Reports & Analytics',
    icon: BarChart,
    path: '/company/reports',
    roles: ['Company Admin'],
    requiredFeature: 'reports',
  },
  {
    id: 'ca-profile',
    title: 'Company Profile',
    icon: Building2,
    path: '/company/profile',
    roles: ['Company Admin'],
  },
  {
    id: 'ca-settings',
    title: 'Settings',
    icon: Settings,
    path: '/company/settings',
    roles: ['Company Admin'],
  },
  // --- Branch Manager Routes ---
  {
    id: 'bm-dashboard',
    title: 'Branch Dashboard',
    icon: Home,
    path: '/dashboard/branch-manager',
    roles: ['BRANCH_MANAGER', 'Branch Manager'],
  },
  {
    id: 'bm-centers',
    title: 'Assigned Centers',
    icon: Building2,
    path: '/dashboard/branch-manager/centers',
    roles: ['BRANCH_MANAGER', 'Branch Manager'],
  },
  {
    id: 'bm-staff',
    title: 'Branch Staff',
    icon: Users,
    path: '/dashboard/branch-manager/staff',
    roles: ['BRANCH_MANAGER', 'Branch Manager'],
  },
  {
    id: 'bm-labs',
    title: 'Branch Lab Details',
    icon: Monitor,
    path: '/dashboard/branch-manager/labs',
    roles: ['BRANCH_MANAGER', 'Branch Manager'],
  },
  // --- Center Manager Routes ---
  {
    id: 'cm-dashboard',
    title: 'Center Dashboard',
    icon: Home,
    path: '/dashboard/center-manager',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-staff',
    title: 'Center Staff Add',
    icon: UserPlus,
    path: '/dashboard/center-manager/staff',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-labs',
    title: 'Center Lab Add',
    icon: Monitor,
    path: '/dashboard/center-manager/labs',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-assigned-exams',
    title: 'Assigned Exams',
    icon: Monitor,
    path: '/dashboard/center-manager/assigned-exams',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-infrastructure',
    title: 'Center Infrastructure',
    icon: Upload,
    path: '/dashboard/center-manager/infrastructure',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-center-photos',
    title: 'Center Photos',
    icon: ImageIcon,
    path: '/dashboard/center-manager/photos',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-center-location',
    title: 'Center Location',
    icon: MapPin,
    path: '/dashboard/center-manager/location',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-system-network',
    title: 'System Network',
    icon: Network,
    path: '/dashboard/center-manager/system-network',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-assign-exam-staff',
    title: 'Assign Exam Staff',
    icon: ClipboardList,
    path: '/dashboard/center-manager/assign-exam-staff',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-assign-candidate-seat-allocation',
    title: 'Assign Candidate Seat Allocation',
    icon: Users,
    path: '/dashboard/center-manager/assign-candidate-seat-allocation',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-assigned-candidate-attendance',
    title: 'Assigned Candidate Attendance',
    icon: Users,
    path: '/dashboard/center-manager/assigned-candidate-attendance',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  {
    id: 'cm-payments',
    title: 'Payments',
    icon: CreditCard,
    path: '/dashboard/center-manager/payments',
    roles: ['CENTER_MANAGER', 'Center Manager'],
  },
  // --- Exam Manager Routes ---
  {
    id: 'em-dashboard',
    title: 'Exam Dashboard',
    icon: Home,
    path: '/exam-manager/dashboard',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  {
    id: 'em-exams',
    title: 'Exams',
    icon: ClipboardCheck,
    path: '/exam-manager/exams',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  {
    id: 'em-topics',
    title: 'Topics',
    icon: FileSignature,
    path: '/exam-manager/topics',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  {
    id: 'em-scheduling',
    title: 'Exam Scheduling',
    icon: CalendarCheck,
    path: '/exam-manager/scheduling',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  {
    id: 'em-shifts',
    title: 'Shifts',
    icon: Activity,
    path: '/exam-manager/shifts',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  {
    id: 'em-candidate-import',
    title: 'Candidate Import',
    icon: Upload,
    path: '/exam-manager/candidate-import',
    roles: ['EXAM_MANAGER', 'Exam Manager'],
  },
  // --- Paper Setter Routes ---
  {
    id: 'ps-dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard/paper-setter',
    roles: ['PAPER_SETTER', 'Paper Setter'],
  },
  // --- Govt Authority Routes ---
  {
    id: 'govt-dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard/govt-authority',
    roles: ['GOVT_AUTHORITY', 'Govt Authority', 'Government Authority'],
  },
  {
    id: 'govt-candidates',
    title: 'Import Candidate',
    icon: Upload,
    path: '/dashboard/govt-authority/import-candidates',
    roles: ['GOVT_AUTHORITY', 'Govt Authority', 'Government Authority'],
  },
  {
    id: 'govt-import-centers',
    title: 'Import center assign exam',
    icon: Upload,
    path: '/dashboard/govt-authority/import-centers',
    roles: ['GOVT_AUTHORITY', 'Govt Authority', 'Government Authority'],
  }
];
