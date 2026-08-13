import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { AlertBanner, InlineMessage } from '@/shared/components/feedback/FeedbackComponents';
import { GenericEmptyState } from '@/shared/components/empty-state/EmptyStateComponents';
import { TableSkeleton } from '@/shared/components/loading/LoadingComponents';

export function FeedbackPage() {
  return (
    <div>
      <PageHeader 
        title="Feedback & States"
        description="Alerts, empty states, and loading skeletons."
      />

      <Section title="Alert Banners">
        <ComponentPreview className="flex-col gap-4 !items-stretch">
          <AlertBanner type="info" title="System Update" message="The system will undergo maintenance at midnight." />
          <AlertBanner type="success" title="Profile Saved" message="Your changes have been saved successfully." />
          <AlertBanner type="warning" title="Storage Almost Full" message="You have used 90% of your storage quota." />
          <AlertBanner type="error" title="Connection Lost" message="Please check your internet connection." />
        </ComponentPreview>
      </Section>

      <Section title="Inline Messages">
        <ComponentPreview className="flex-col gap-4 !items-start">
          <InlineMessage type="info" message="Password must be 8 characters long." />
          <InlineMessage type="error" message="Invalid email format." />
        </ComponentPreview>
      </Section>

      <Section title="Empty States">
        <ComponentPreview>
          <GenericEmptyState 
            icon="search" 
            title="No Results Found" 
            description="We couldn't find anything matching your search criteria. Try adjusting your filters."
            actionLabel="Clear Filters"
            onAction={() => {}}
          />
        </ComponentPreview>
      </Section>

      <Section title="Loading Skeletons">
        <ComponentPreview>
          <div className="w-full max-w-2xl">
            <TableSkeleton rows={3} cols={3} />
          </div>
        </ComponentPreview>
      </Section>
    </div>
  );
}
