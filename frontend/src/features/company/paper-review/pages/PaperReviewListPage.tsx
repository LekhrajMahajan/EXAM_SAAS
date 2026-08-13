import React, { useState } from 'react';
import { PaperReviewTable } from '../components/PaperReviewTable';
import { DUMMY_PAPER_REVIEWS } from '../utils/placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, ClipboardList, CheckCircle, Clock, FileX } from 'lucide-react';

export const PaperReviewListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dashboard Stats
  const pendingCount = DUMMY_PAPER_REVIEWS.filter(r => r.status === 'Pending').length;
  const inProgressCount = DUMMY_PAPER_REVIEWS.filter(r => r.status === 'In Progress').length;
  const completedCount = DUMMY_PAPER_REVIEWS.filter(r => r.status === 'Completed').length;
  const returnedCount = DUMMY_PAPER_REVIEWS.filter(r => r.status === 'Returned').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Paper Review</h1>
          <p className="text-slate-500 mt-1">Manage and review examination papers.</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-slate-800">{pendingCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <h3 className="text-2xl font-bold text-slate-800">{inProgressCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-800">{completedCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <FileX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Returned Papers</p>
              <h3 className="text-2xl font-bold text-slate-800">{returnedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <CardTitle>Review Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by paper name or code..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all-subjects">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          <PaperReviewTable reviews={DUMMY_PAPER_REVIEWS} />
        </CardContent>
      </Card>
    </div>
  );
};
