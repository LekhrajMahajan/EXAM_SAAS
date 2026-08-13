import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { topicApi, type Topic } from '@/features/exam-manager/api/topic.api';
import { examApi } from '@/features/exam-manager/api/exam.api';

export const CompanySubjectTopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;
    const loadTopics = async () => {
      try {
        const res = await topicApi.getAll({ search, limit: 100 });
        if (!ignore && res.success) {
          setTopics(res.data.topics || []);
        }
      } catch (error) {
        if (!ignore) console.error('Failed to fetch topics', error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    void loadTopics();
    return () => { ignore = true; };
  }, [search]);

  useEffect(() => {
    let ignore = false;
    const loadExams = async () => {
      try {
        const res = await examApi.getAll({ limit: 100 });
        if (!ignore && res.success) {
          setExams(res.data.exams || []);
        }
      } catch (error) {
        if (!ignore) console.error('Failed to fetch exams', error);
      }
    };
    void loadExams();
    return () => { ignore = true; };
  }, []);

  const groupedData = React.useMemo(() => {
    const examGroups: { exam: any, subjects: { subjectName: string, topics: Topic[] }[] }[] = [];
    const usedTopicIds = new Set<string>();

    exams.forEach(exam => {
      const examSubjects: { subjectName: string, topics: Topic[] }[] = [];
      if (exam.subjects) {
        exam.subjects.forEach((sub: any) => {
          const subjectTopics = topics.filter(t => 
            t.subjectId?.subjectName === sub.name || 
            t.subjectName === sub.name
          );
          subjectTopics.forEach(t => usedTopicIds.add(t._id));
          examSubjects.push({
            subjectName: sub.name,
            topics: subjectTopics
          });
        });
      }
      examGroups.push({
        exam,
        subjects: examSubjects
      });
    });

    const otherTopics = topics.filter(t => !usedTopicIds.has(t._id));

    return { examGroups, otherTopics };
  }, [exams, topics]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subject Topics</h1>
          <p className="text-muted-foreground">View topics assigned to subjects by the Exam Manager</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-9 bg-slate-800 border-slate-700"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsLoading(true);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading topics...</div>
      ) : (
        <div className="space-y-8">
          {groupedData.examGroups.map(({ exam, subjects }) => (
            <Card key={exam._id} className="bg-slate-900/40 border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{exam.examName || exam.examTitle}</h2>
                  {exam.description && <p className="text-sm text-slate-400 mt-1">{exam.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    {subjects.length} Subjects
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {subjects.map(({ subjectName, topics: subjectTopics }, idx) => (
                    <Card key={idx} className="bg-slate-900 border-slate-800 shadow-sm">
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-slate-200">{subjectName}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs bg-slate-800/50">
                          {subjectTopics.length} Topics
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {subjectTopics.length > 0 ? (
                            subjectTopics.map(t => (
                              <Badge key={t._id} variant="secondary" className="bg-slate-800 text-slate-300 font-normal px-2.5 py-1">
                                {t.topicName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500 italic">No topics assigned</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {groupedData.otherTopics.length > 0 && (
            <Card className="bg-slate-900/40 border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/60">
                <h2 className="text-xl font-semibold text-slate-100">Other Subjects</h2>
                <p className="text-sm text-slate-400 mt-1">Topics not associated with any exam&apos;s subjects</p>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {groupedData.otherTopics.map(t => (
                    <Badge key={t._id} variant="secondary" className="bg-slate-800 text-slate-300 font-normal px-2.5 py-1">
                      {t.topicName} {t.subjectName ? `(${t.subjectName})` : ''}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {groupedData.examGroups.length === 0 && groupedData.otherTopics.length === 0 && (
            <div className="text-center p-12 text-slate-500 border border-slate-800 rounded-lg bg-slate-900/20">
              No topics found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
