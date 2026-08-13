export type FileType = 'Image' | 'PDF' | 'Document' | 'Spreadsheet' | 'Video' | 'Archive' | 'Other';
export type FileStatus = 'Active' | 'Archived' | 'Pending' | 'Processing';
export type FileModule = 'Candidates' | 'Employees' | 'Certificates' | 'Results' | 'Reports' | 'Exams' | 'General';

export interface FileStatistics {
  totalFiles: number;
  totalStorageUsedGB: number;
  images: number;
  documents: number;
  pdfs: number;
  archivedFiles: number;
  sharedFiles: number;
}

export interface FileRecord {
  id: string;
  name: string;
  extension: string;
  type: FileType;
  size: string;
  sizeBytes: number;
  module: FileModule;
  category: string;
  folder: string;
  owner: string;
  status: FileStatus;
  uploadedAt: string;
  modifiedAt: string;
  description?: string;
}

export interface FolderRecord {
  id: string;
  name: string;
  parentId?: string;
  module: FileModule;
  fileCount: number;
  totalSize: string;
  createdAt: string;
  createdBy: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  description: string;
  module: FileModule;
  allowedTypes: FileType[];
  retentionDays?: number;
  fileCount: number;
}

export interface FileVersion {
  id: string;
  fileId: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  changeNote?: string;
}

export interface FileActivity {
  id: string;
  fileId: string;
  fileName: string;
  action: 'Upload' | 'Download' | 'Rename' | 'Move' | 'Delete' | 'Restore' | 'Archive' | 'Share';
  performedBy: string;
  performedAt: string;
  details?: string;
}
