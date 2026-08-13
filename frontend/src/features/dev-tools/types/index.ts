export interface AppRoute {
  path: string;
  element: string;
  children?: AppRoute[];
  roles?: string[];
  layout?: string;
  description?: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  module: string;
  status: 'active' | 'deprecated' | 'planned';
  description?: string;
}

export interface RolePermission {
  module: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  publish: boolean;
  export: boolean;
}

export interface SystemHealth {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  latency: string;
  uptime: string;
  lastChecked: string;
}

export interface BuildInfo {
  version: string;
  buildNumber: string;
  date: string;
  commit: string;
  branch: string;
  environment: string;
}
