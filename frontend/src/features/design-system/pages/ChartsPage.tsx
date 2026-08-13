import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { BarChart, PieChart, LineChart, Activity } from 'lucide-react';

export function ChartsPage() {
  return (
    <div>
      <PageHeader 
        title="Charts & Visualizations"
        description="Placeholders for data visualizations."
      />

      <Section title="Chart Placeholders">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentPreview className="h-64 flex-col gap-4">
            <BarChart className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Bar Chart Placeholder</p>
          </ComponentPreview>
          
          <ComponentPreview className="h-64 flex-col gap-4">
            <LineChart className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Line Chart Placeholder</p>
          </ComponentPreview>

          <ComponentPreview className="h-64 flex-col gap-4">
            <PieChart className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Pie Chart Placeholder</p>
          </ComponentPreview>

          <ComponentPreview className="h-64 flex-col gap-4">
            <Activity className="w-12 h-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Area Chart Placeholder</p>
          </ComponentPreview>
        </div>
      </Section>
    </div>
  );
}
