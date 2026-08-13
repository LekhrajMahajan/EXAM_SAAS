import React from 'react';
import type { FolderRecord } from '../types';
import { Folder, FolderOpen, ChevronRight, Files, HardDrive } from 'lucide-react';

export function FolderTree({ folders }: { folders: FolderRecord[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Folder className="w-4 h-4 text-amber-500" /> Folder Tree
        </h3>
      </div>
      <div className="p-2 space-y-1">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-amber-400 group-hover:text-amber-500 transition-colors" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{folder.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{folder.module}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Files className="w-3.5 h-3.5" /> {folder.fileCount.toLocaleString()}</span>
              <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {folder.totalSize}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
