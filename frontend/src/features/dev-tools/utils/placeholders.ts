import type { AppRoute, ApiEndpoint, RolePermission, SystemHealth, BuildInfo } from '../types';

export const mockRoutes: AppRoute[] = [
  {
    path: '/',
    element: 'AppLayout',
    roles: ['All Authenticated'],
    children: [
      { path: 'dashboard', element: 'DashboardHome', description: 'Main entry point' },
      { 
        path: 'company', 
        element: 'CompanyModuleLayout',
        roles: ['Company Admin'],
        children: [
          { path: 'profile', element: 'CompanyProfilePage' },
          { path: 'centers', element: 'CenterListPage' }
        ]
      },
      {
        path: 'dev-tools',
        element: 'DevToolsLayout',
        roles: ['Super Admin', 'Developer'],
        children: [
          { path: 'routes', element: 'RouteExplorerPage' },
          { path: 'apis', element: 'ApiExplorerPage' }
        ]
      }
    ]
  },
  { path: '/login', element: 'LoginPage', layout: 'AuthLayout', description: 'Public login route' }
];

export const mockApis: ApiEndpoint[] = [
  { id: '1', method: 'GET', path: '/api/v1/users/me', module: 'Auth', status: 'active', description: 'Get current user profile' },
  { id: '2', method: 'POST', path: '/api/v1/auth/login', module: 'Auth', status: 'active', description: 'Authenticate user' },
  { id: '3', method: 'GET', path: '/api/v1/companies', module: 'Company', status: 'active', description: 'List companies' },
  { id: '4', method: 'POST', path: '/api/v1/exams', module: 'Examination', status: 'active', description: 'Create new exam' },
  { id: '5', method: 'GET', path: '/api/v0/legacy-export', module: 'Reporting', status: 'deprecated', description: 'Old export endpoint' },
];

export const mockPermissions: Record<string, RolePermission[]> = {
  'Super Admin': [
    { module: 'System', read: true, create: true, update: true, delete: true, approve: true, publish: true, export: true },
    { module: 'Companies', read: true, create: true, update: true, delete: true, approve: true, publish: true, export: true },
  ],
  'Company Admin': [
    { module: 'Staff', read: true, create: true, update: true, delete: true, approve: false, publish: false, export: true },
    { module: 'Exams', read: true, create: true, update: true, delete: false, approve: true, publish: true, export: true },
  ],
  'Observer': [
    { module: 'Exams', read: true, create: false, update: false, delete: false, approve: false, publish: false, export: false },
    { module: 'Incidents', read: true, create: true, update: false, delete: false, approve: false, publish: false, export: false },
  ]
};

export const mockHealth: SystemHealth[] = [
  { service: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.99%', lastChecked: 'Just now' },
  { service: 'Authentication Service', status: 'operational', latency: '32ms', uptime: '99.99%', lastChecked: 'Just now' },
  { service: 'PostgreSQL Primary DB', status: 'operational', latency: '12ms', uptime: '99.95%', lastChecked: 'Just now' },
  { service: 'Redis Cache', status: 'degraded', latency: '150ms', uptime: '99.90%', lastChecked: '2 mins ago' },
  { service: 'Storage Bucket', status: 'operational', latency: '85ms', uptime: '100%', lastChecked: 'Just now' },
];

export const mockBuildInfo: BuildInfo = {
  version: '2.4.1-beta',
  buildNumber: 'BUILD-9842',
  date: new Date().toISOString(),
  commit: 'a1b2c3d4e5f6g7h8i9j0',
  branch: 'main',
  environment: 'production'
};
