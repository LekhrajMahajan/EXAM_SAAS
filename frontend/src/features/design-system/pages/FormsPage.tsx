import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function FormsPage() {
  return (
    <div>
      <PageHeader 
        title="Forms"
        description="Inputs, selects, and structural form elements."
      />

      <Section title="Text Inputs">
        <ComponentPreview>
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-1.5">
              <Label>Standard Input</Label>
              <Input placeholder="Enter your name" />
            </div>
            <div className="space-y-1.5">
              <Label>Disabled Input</Label>
              <Input placeholder="Not allowed" disabled />
            </div>
            <div className="space-y-1.5">
              <Label>With Error</Label>
              <Input className="border-rose-300 focus-visible:ring-rose-500" defaultValue="Invalid value" />
              <p className="text-xs text-rose-500">This field is required.</p>
            </div>
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Select & Textarea">
        <ComponentPreview>
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-1.5">
              <Label>Select Dropdown</Label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Textarea</Label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message here."
              />
            </div>
          </div>
        </ComponentPreview>
      </Section>
    </div>
  );
}
