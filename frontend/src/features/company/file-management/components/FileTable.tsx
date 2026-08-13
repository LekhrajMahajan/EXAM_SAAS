import React from 'react';
import type { FileRecord, FileType } from '../types';
import { Image, FileText, FileType as LucideFileType, Archive, Table, File, Eye, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

export function FileTypeIcon({ type, className }: { type: FileType; className?: string }) {
  switch (type) {
    case 'Image': return <Image className={className ?? 'w-4 h-4 text-sky-500'} />;
    case 'PDF': return <LucideFileType className={className ?? 'w-4 h-4 text-red-500'} />;
    case 'Document': return <FileText className={className ?? 'w-4 h-4 text-blue-500'} />;
    case 'Spreadsheet': return <Table className={className ?? 'w-4 h-4 text-emerald-500'} />;
    case 'Archive': return <Archive className={className ?? 'w-4 h-4 text-amber-500'} />;
    default: return <File className={className ?? 'w-4 h-4 text-slate-400'} />;
  }
}

export function StatusBadge({ status }: { status: FileRecord['status'] }) {
  switch (status) {
    case 'Active': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>;
    case 'Archived': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">Archived</span>;
    case 'Processing': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 border border-indigo-200">Processing</span>;
    case 'Pending': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">Pending</span>;
  }
}

export function FileTable({ files }: { files: FileRecord[] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">File</th>
              <th scope="col" className="px-4 py-3 font-semibold">Module / Category</th>
              <th scope="col" className="px-4 py-3 font-semibold">Size</th>
              <th scope="col" className="px-4 py-3 font-semibold">Owner</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Uploaded</th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileTypeIcon type={file.type} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 max-w-[200px] truncate" title={file.name}>{file.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">.{file.extension}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{file.module}</div>
                  <div className="text-[10px] text-slate-500">{file.category}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-600">{file.size}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{file.owner}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="flex justify-center"><StatusBadge status={file.status} /></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs text-slate-600">{new Date(file.uploadedAt).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600" asChild>
                    <Link to={`/company/file-management/${file.id}`}><Eye className="w-4 h-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
