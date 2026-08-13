import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_CATEGORIES } from '../utils/placeholder';
import { CategoryCard } from '../components/CategoryCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader
          title="File Categories"
          description="Define and manage file categories with module mappings and allowed file types."
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_CATEGORIES.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
