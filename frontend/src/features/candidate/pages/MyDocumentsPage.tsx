import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_DOCUMENTS } from '../utils/placeholder';
import { DocumentCard } from '../components/DocumentCard';
import { Button } from '@/shared/components/ui/button';
import { Upload } from 'lucide-react';

export function MyDocumentsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="My Documents" 
          description="Upload and manage your required documents." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      <div className="grid gap-4">
        {DUMMY_DOCUMENTS.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}
