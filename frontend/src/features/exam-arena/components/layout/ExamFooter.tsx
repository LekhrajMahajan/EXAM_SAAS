import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, Bookmark, X, Save } from 'lucide-react';

export function ExamFooter() {
  return (
    <footer className="h-16 flex-shrink-0 bg-white border-t border-slate-200 px-4 md:px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" size="icon" className="md:hidden">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="text-slate-600">
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 hidden md:flex">
          <Bookmark className="w-4 h-4 mr-2" />
          Mark for Review
        </Button>
        <Button variant="outline" size="icon" className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 md:hidden">
          <Bookmark className="w-4 h-4" />
        </Button>

        <Button className="bg-indigo-600 hover:bg-indigo-700 hidden md:flex">
          <Save className="w-4 h-4 mr-2" />
          Save & Next
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 md:hidden px-6">
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </footer>
  );
}
