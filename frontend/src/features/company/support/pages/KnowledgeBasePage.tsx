import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ARTICLES } from '../utils/placeholder';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Knowledge Base" 
        description="Browse help articles, guides, and documentation." 
      />
      
      <div className="relative max-w-xl">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
         <Input className="pl-9 w-full" placeholder="Search articles by title or keyword..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {DUMMY_ARTICLES.map(article => (
            <KnowledgeCard key={article.id} article={article} />
         ))}
      </div>
    </div>
  );
}
