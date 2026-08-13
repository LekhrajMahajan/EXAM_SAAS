import React from 'react';
import type { FileStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Files, HardDrive, Image, FileText, FileType, Archive, Share2 } from 'lucide-react';

interface StatisticsGridProps {
  stats: FileStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  const storagePercent = Math.min(100, (stats.totalStorageUsedGB / 50) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Files className="w-5 h-5 text-indigo-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.totalFiles.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Total Files</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Image className="w-5 h-5 text-sky-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.images.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Images</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <FileType className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.pdfs.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">PDFs</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <FileText className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.documents.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Documents</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Archive className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.archivedFiles.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Archived</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Share2 className="w-5 h-5 text-violet-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{stats.sharedFiles.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Shared</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-slate-500" />
              <span className="font-bold text-slate-900">Storage Usage</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900">{stats.totalStorageUsedGB} GB</span>
              <span className="text-slate-400 text-sm"> / 50 GB</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${storagePercent > 80 ? 'bg-red-500' : storagePercent > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${storagePercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>{storagePercent.toFixed(1)}% used</span>
            <span>{(50 - stats.totalStorageUsedGB).toFixed(1)} GB free</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
