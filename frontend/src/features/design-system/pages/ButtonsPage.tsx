import React from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { Button } from '@/shared/components/ui/button';
import { Loader2, Plus, ArrowRight } from 'lucide-react';

export function ButtonsPage() {
  return (
    <div>
      <PageHeader 
        title="Buttons"
        description="Actions and interactive elements."
      />

      <Section title="Variants" description="Different button styles for various levels of emphasis.">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4 items-center">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Primary</Button>
            <Button variant="outline">Secondary / Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700">Danger</Button>
          </div>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="sm" className="bg-indigo-600 text-white">Small</Button>
            <Button className="bg-indigo-600 text-white">Default</Button>
            <Button size="lg" className="bg-indigo-600 text-white">Large</Button>
          </div>
        </ComponentPreview>
      </Section>

      <Section title="States & Icons">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4 items-center">
            <Button className="bg-indigo-600 text-white" disabled>Disabled</Button>
            <Button className="bg-indigo-600 text-white" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing
            </Button>
            <Button className="bg-indigo-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
            <Button variant="outline">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </ComponentPreview>
      </Section>
    </div>
  );
}
