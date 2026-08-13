import React from 'react';
import type { FileRecord } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileTypeIcon, StatusBadge } from './FileTable';
import { Eye, Download, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

export function FileGrid({ files }: { files: FileRecord[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map(file => (
        <Card key={file.id} className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
          <CardContent className="p-4">
            <div className="w-full aspect-square rounded-lg bg-slate-50 flex items-center justify-center mb-3 relative group-hover:bg-slate-100 transition-colors">
              <FileTypeIcon type={file.type} className="w-10 h-10" />
              <div className="absolute inset-0 rounded-lg bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20" asChild>
                  <Link to={`/company/file-management/${file.id}`}><Eye className="w-5 h-5" /></Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="font-bold text-slate-900 text-sm truncate" title={`${file.name}.${file.extension}`}>
              {file.name}
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">.{file.extension} · {file.size}</span>
              <StatusBadge status={file.status} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
