import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AssignmentPreview } from '../components/AssignmentPreview';
import { Button } from '@/shared/components/ui/button';
import { Download, Share2 } from 'lucide-react';

export function AssignmentPreviewPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Assignment Summary" 
          description="Detailed view of the generated assignments." 
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <AssignmentPreview />
    </div>
  );
}
