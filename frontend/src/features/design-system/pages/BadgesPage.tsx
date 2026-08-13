import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { StatusBadge, PriorityBadge, ApprovalBadge } from '@/shared/components/badges/BadgeComponents';

export function BadgesPage() {
  return (
    <div>
      <PageHeader 
        title="Badges"
        description="Visual indicators for status, priority, and state."
      />

      <Section title="Status Badges">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4">
            <StatusBadge config={{ label: 'Active', variant: 'success' }} />
            <StatusBadge config={{ label: 'Inactive', variant: 'default' }} />
            <StatusBadge config={{ label: 'Pending', variant: 'warning' }} />
            <StatusBadge config={{ label: 'Failed', variant: 'error' }} />
            <StatusBadge config={{ label: 'Processing', variant: 'info' }} />
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Priority Badges">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4">
            <PriorityBadge level="Low" />
            <PriorityBadge level="Medium" />
            <PriorityBadge level="High" />
            <PriorityBadge level="Critical" />
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Approval Badges">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4">
            <ApprovalBadge status="Draft" />
            <ApprovalBadge status="Pending" />
            <ApprovalBadge status="Approved" />
            <ApprovalBadge status="Rejected" />
          </div>
        </ComponentPreview>
      </Section>
    </div>
  );
}
