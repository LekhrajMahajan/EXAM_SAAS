import React from 'react';
import { UploadCloud, FileType2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function UploadCard() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/30 p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50/70 hover:border-indigo-400 transition-all cursor-pointer">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-indigo-100 text-indigo-500">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-indigo-900 mb-2">Click or drag files here to upload</h3>
        <p className="text-sm text-indigo-700/70 max-w-sm mb-6">Support for multiple file uploads. Files are scanned and validated before storage.</p>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['PDF', 'JPG/PNG', 'DOCX/XLSX', 'ZIP'].map(fmt => (
            <div key={fmt} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <FileType2 className="w-4 h-4 text-indigo-500" /> {fmt}
            </div>
          ))}
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Browse Files</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Upload Queue</h3>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <UploadCloud className="w-8 h-8 mb-2" />
          <p className="text-sm">No files in queue. Select files to upload.</p>
        </div>
      </div>
    </div>
  );
}
