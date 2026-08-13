import React from 'react';
import type { FileRecord } from '../types';
import { FileTypeIcon } from './FileTable';
import { HardDrive, User, Calendar, Folder, Tag, FileType } from 'lucide-react';

export function PreviewPanel({ file }: { file: FileRecord }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Preview Area */}
      <div className="bg-slate-50 border-b border-slate-200 h-56 flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-400">
          <FileTypeIcon type={file.type} className="w-14 h-14" />
          <p className="text-sm mt-3">Preview not available</p>
          <p className="text-xs mt-1 font-mono">.{file.extension.toUpperCase()} files require a preview renderer</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-5 space-y-3">
        <h3 className="font-bold text-slate-900 text-lg break-all">{file.name}.{file.extension}</h3>

        <dl className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Size</dt>
            <dd className="font-bold text-slate-900">{file.size}</dd>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Owner</dt>
            <dd className="font-bold text-slate-900">{file.owner}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Module</dt>
            <dd className="font-bold text-slate-900">{file.module}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Folder</dt>
            <dd className="text-indigo-600 font-medium truncate">{file.folder}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Uploaded</dt>
            <dd className="font-bold text-slate-900">{new Date(file.uploadedAt).toLocaleDateString()}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <dt className="text-slate-500 w-24 flex-shrink-0">Modified</dt>
            <dd className="font-bold text-slate-900">{new Date(file.modifiedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
