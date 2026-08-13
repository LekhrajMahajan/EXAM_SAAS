import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Filter, Search } from 'lucide-react';

export function SubjectFilters() {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search subjects..." className="pl-9 w-full" />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2 border-t">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Subject Code</label>
          <Input placeholder="E.g. MATH-101" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Category</label>
          <Select>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Competitive">Competitive</SelectItem>
              <SelectItem value="University">University</SelectItem>
              <SelectItem value="School">School</SelectItem>
              <SelectItem value="Recruitment">Recruitment</SelectItem>
              <SelectItem value="Certification">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Exam Type</label>
          <Select>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
              <SelectItem value="Subjective">Subjective</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Language</label>
          <Select>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Status</label>
          <Select>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
