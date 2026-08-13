export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SortState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  id: string;
  value: unknown;
}

export interface TableColumn<TData> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  cell?: (props: { row: TData }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
  icon?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: StatusVariant;
  icon?: string;
  metadata?: Record<string, string>;
}
