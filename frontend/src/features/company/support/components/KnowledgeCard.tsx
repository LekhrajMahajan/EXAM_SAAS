import React from 'react';
import type { KnowledgeArticle } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { BookOpen, Eye, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function KnowledgeCard({ article }: { article: KnowledgeArticle }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors h-full">
       <CardContent className="p-5 flex flex-col h-full">
          <div className="mb-2">
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">{article.category}</span>
          </div>
          <Link to="#" className="font-bold text-slate-900 hover:text-indigo-600 text-lg mb-2 line-clamp-2">
             {article.title}
          </Link>
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
             {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
             <div className="flex items-center gap-3">
                <span className="flex items-center gap-1" title="Views"><Eye className="w-3.5 h-3.5" /> {article.views}</span>
                <span className="flex items-center gap-1" title="Helpful"><ThumbsUp className="w-3.5 h-3.5" /> {article.helpfulCount}</span>
             </div>
             <div>{article.lastUpdated}</div>
          </div>
       </CardContent>
    </Card>
  );
}
