import { PageHeader } from '@/shared/components/layout/page-header';
import { TemplateDownloadCard } from '../components/TemplateDownloadCard';

export function DownloadTemplatePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Download Import Template" 
        description="Get the standard CSV or Excel template for uploading questions." 
      />
      <TemplateDownloadCard />
    </div>
  );
}

