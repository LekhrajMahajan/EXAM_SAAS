
import type { QuickAction } from '../types';
import { WidgetCard } from './WidgetCard';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActionCard({ actions }: { actions: QuickAction[] }) {
  return (
    <WidgetCard title="Quick Actions">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full content-start">
        {actions.map(action => {
          const Icon = (Icons as any)[action.iconName] || Icons.Zap;
          return (
            <Link key={action.id} to={action.path} className="flex flex-col items-center justify-center p-3 rounded-xl border transition-colors text-center border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-[#2D3E2C]">
              <Icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-bold leading-tight">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </WidgetCard>
  );
}
