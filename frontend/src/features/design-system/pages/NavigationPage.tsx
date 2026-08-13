import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { BreadcrumbBar } from '@/features/app-shell/components/breadcrumb/BreadcrumbBar';
import { TabManager } from '@/features/app-shell/components/tabs/TabManager';

export function NavigationPage() {
  const breadcrumbItems = [
    { id: '1', title: 'Dashboard', path: '/dashboard' },
    { id: '2', title: 'Candidates', path: '/candidates' },
    { id: '3', title: 'John Doe' },
  ];

  const tabItems = [
    { id: 'overview', title: 'Overview', path: '#' },
    { id: 'settings', title: 'Settings', path: '#' },
    { id: 'history', title: 'History', path: '#' },
  ];

  return (
    <div>
      <PageHeader 
        title="Navigation"
        description="Breadcrumbs, tabs, and local navigation components."
      />

      <Section title="Breadcrumbs">
        <ComponentPreview>
          <div className="w-full">
            <BreadcrumbBar items={breadcrumbItems} />
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Tabs">
        <ComponentPreview>
          <div className="w-full">
            <TabManager 
              tabs={tabItems}
              activeTabId="overview"
              onTabChange={() => {}}
              onTabClose={() => {}}
            />
          </div>
        </ComponentPreview>
      </Section>
    </div>
  );
}
