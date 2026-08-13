import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { MetricCard, InfoCard, BaseCard } from '@/shared/components/cards/CardComponents';
import { Users, Shield } from 'lucide-react';

export function CardsPage() {
  return (
    <div>
      <PageHeader 
        title="Cards"
        description="Containers for organizing related content and actions."
      />

      <Section title="Metric Cards">
        <ComponentPreview>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <MetricCard label="Total Candidates" value="1,234" trend="up" trendValue="12% vs last month" />
            <MetricCard label="Failed Exams" value="45" trend="down" trendValue="3% vs last month" />
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Info Cards">
        <ComponentPreview>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <InfoCard title="System Update" description="Version 2.0 is now live with new features." icon={Shield} />
            <InfoCard title="User Verification" description="30 users are pending document verification." icon={Users} />
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Base Card">
        <ComponentPreview>
          <BaseCard title="Recent Activity" className="w-full max-w-md">
            <p className="text-sm text-slate-500">This is a flexible base card where you can put any custom content, forms, or lists inside the content area.</p>
          </BaseCard>
        </ComponentPreview>
      </Section>
    </div>
  );
}
