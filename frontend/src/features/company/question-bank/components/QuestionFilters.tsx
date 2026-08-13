import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSubjectList } from '../../subject/hooks/subject.hooks';

export function QuestionFilters() {
  const { data } = useSubjectList({ page: 1, limit: 100 });
  const subjectItems = (data?.data as unknown as { subjects?: { name: string }[]; items?: { name: string }[] }) || {};
  const subjects = subjectItems.subjects || subjectItems.items || [];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search questions..." className="pl-9" />
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s: { name: string }) => (
              <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

