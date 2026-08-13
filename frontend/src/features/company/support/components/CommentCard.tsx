import React from 'react';
import type { TicketComment } from '../types';
import { Paperclip, Lock, User } from 'lucide-react';

export function CommentCard({ comment }: { comment: TicketComment }) {
  return (
    <div className={`p-4 rounded-lg border ${comment.isInternal ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'} shadow-sm`}>
       <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${comment.isInternal ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                <User className="w-4 h-4" />
             </div>
             <div>
                <p className="font-bold text-sm text-slate-900">{comment.author.name}</p>
                <p className="text-xs text-slate-500 uppercase">{comment.author.role}</p>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-xs font-mono text-slate-400">{comment.timestamp}</span>
             {comment.isInternal && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase"><Lock className="w-3 h-3" /> Internal Note</span>}
          </div>
       </div>
       
       <div className="text-sm text-slate-700 whitespace-pre-wrap">
          {comment.content}
       </div>

       {comment.attachments && comment.attachments.length > 0 && (
         <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Attachments</p>
            <div className="flex flex-wrap gap-2">
               {comment.attachments.map((file, i) => (
                 <a key={i} href={file.url} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-indigo-600">{file.name}</span>
                    <span className="text-slate-400 ml-1">({file.size})</span>
                 </a>
               ))}
            </div>
         </div>
       )}
    </div>
  );
}
