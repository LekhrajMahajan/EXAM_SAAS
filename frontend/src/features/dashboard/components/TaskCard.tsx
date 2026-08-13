import React from 'react';
import type { TaskItem } from '../types';
import { WidgetCard } from './WidgetCard';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export function TaskCard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <WidgetCard title="Tasks & Deadlines" action={<button className="text-xs text-indigo-600 font-medium">View All</button>}>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors group">
            <button className="mt-0.5 w-4 h-4 rounded border border-slate-300 flex items-center justify-center text-white hover:border-indigo-600 group-hover:bg-white transition-colors">
              <CheckSquare className="w-3 h-3 opacity-0 group-hover:opacity-20 text-indigo-600" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{task.title}</h4>
                {task.priority === 'high' && <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className={task.priority === 'high' ? 'text-rose-600 font-medium' : ''}>{task.dueDate}</span>
                </div>
                {task.assignedTo && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{task.assignedTo}</span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className={`font-medium ${
                  task.status === 'Completed' ? 'text-emerald-600' :
                  task.status === 'In Progress' ? 'text-indigo-600' : 'text-amber-600'
                }`}>{task.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
