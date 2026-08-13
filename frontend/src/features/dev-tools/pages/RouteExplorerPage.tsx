import React from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import { mockRoutes } from '../utils/placeholders';
import type { AppRoute } from '../types';
import { ChevronRight, ChevronDown, Shield, Layout } from 'lucide-react';

function RouteNode({ route, depth = 0 }: { route: AppRoute, depth?: number }) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = route.children && route.children.length > 0;

  return (
    <div className="font-mono text-sm">
      <div 
        className={`flex items-center py-2 px-4 hover:bg-slate-50 border-b border-slate-100 ${depth === 0 ? 'bg-slate-50/50 font-bold' : ''}`}
        style={{ paddingLeft: `${(depth * 1.5) + 1}rem` }}
      >
        <button 
          className={`w-5 h-5 flex items-center justify-center mr-2 text-slate-400 hover:text-slate-700 ${!hasChildren && 'invisible'}`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <span className="text-indigo-600 font-semibold mr-4 w-48">{route.path}</span>
        
        <span className="text-slate-600 w-48 flex items-center gap-2">
          {route.element}
        </span>
        
        <div className="flex-1 flex items-center gap-3">
          {route.roles && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200">
              <Shield className="w-3 h-3" /> {route.roles.join(', ')}
            </span>
          )}
          {route.layout && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs border border-sky-200">
              <Layout className="w-3 h-3" /> {route.layout}
            </span>
          )}
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div>
          {route.children!.map((child, idx) => (
            <RouteNode key={idx} route={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RouteExplorerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Route Explorer</h1>
        <p className="text-sm text-slate-500">Visualize the application's routing tree, layouts, and RBAC guards.</p>
      </div>

      <DeveloperCard title="Application Routes">
        <div className="flex items-center py-3 px-4 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="w-7 mr-2"></div>
          <div className="w-48">Path</div>
          <div className="w-48">Component</div>
          <div className="flex-1">Metadata (Guards / Layouts)</div>
        </div>
        <div className="divide-y divide-slate-100">
          {mockRoutes.map((route, idx) => (
            <RouteNode key={idx} route={route} />
          ))}
        </div>
      </DeveloperCard>
    </div>
  );
}
