import React from 'react';
import { UploadCloud, FileType2 } from 'lucide-react';

export function FileUploadCard() {
  return (
    <div className="border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/30 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/70 hover:border-indigo-400 transition-all">
       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-indigo-100 text-indigo-500">
          <UploadCloud className="w-8 h-8" />
       </div>
       <h3 className="text-lg font-bold text-indigo-900 mb-2">Click or drag file to this area to upload</h3>
       <p className="text-sm text-indigo-700/70 max-w-sm mb-6">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
       
       <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
             <FileType2 className="w-4 h-4 text-emerald-500" /> CSV
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
             <FileType2 className="w-4 h-4 text-emerald-500" /> XLSX
          </div>
       </div>
    </div>
  );
}
