export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavigationItem {
  id: string;
  title: string;
  path?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  roles?: string[];
}

export interface MenuGroup {
  id: string;
  title: string;
  items: NavigationItem[];
}

export interface BreadcrumbItem {
  id: string;
  title: string;
  path?: string;
  icon?: string;
}

export interface TabItem {
  id: string;
  title: string;
  path: string;
  isPinned?: boolean;
}

export interface FavoriteItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
}

export interface RecentItem {
  id: string;
  title: string;
  path: string;
  timestamp: string;
  icon?: string;
}
