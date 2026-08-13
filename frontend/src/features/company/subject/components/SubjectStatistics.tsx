import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileQuestion, CheckCircle, Clock, FileText, Calendar } from 'lucide-react';

export function SubjectStatistics() {
  const stats = [
    { label: 'Total Questions', value: '1,250', icon: FileQuestion, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Approved Questions', value: '980', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pending Review', value: '270', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Active Papers', value: '15', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Scheduled Exams', value: '3', icon: Calendar, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h4 className="text-xl font-bold">{stat.value}</h4>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
