import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateCertificateSchema, type GenerateCertificateForm } from '../schemas/certificate-schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DUMMY_EXAMS, DUMMY_CERT_TYPES, DUMMY_TEMPLATES } from '../utils/placeholder';
import { FileDown, Settings, Paintbrush } from 'lucide-react';
import { CertificateTemplateCard } from '../components/CertificateTemplateCard';
import { useCertificateTemplates } from '../hooks/useCertificateTemplates';

export function GenerateCertificatesPage() {
  const { data: templatesData } = useCertificateTemplates();
  const templates = templatesData?.data || DUMMY_TEMPLATES;
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0]?.id || '');

  const { register, handleSubmit, formState: { errors } } = useForm<GenerateCertificateForm>({
    resolver: zodResolver(generateCertificateSchema),
    defaultValues: {
      sourceData: 'Result List',
      templateId: DUMMY_TEMPLATES[0].id,
      includeDigitalSignature: true,
      includeQrCode: true,
      includeWatermark: true,
    }
  });

  const onSubmit = (data: GenerateCertificateForm) => {
    console.log({ ...data, templateId: selectedTemplate });
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Generate Certificates" 
        description="Batch generate certificates for candidates based on results or merit lists." 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
         <Card className="border-border shadow-sm">
           <CardHeader className="bg-muted/50 border-b border-border">
             <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Data Source & Type</CardTitle>
             <CardDescription>Select who should receive the certificates.</CardDescription>
           </CardHeader>
           <CardContent className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Exam Batch <span className="text-destructive">*</span></label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('exam')}
                  >
                    <option value="">Select Exam Batch</option>
                    {DUMMY_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                  {errors.exam && <p className="text-xs text-destructive">{errors.exam.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Source Data <span className="text-destructive">*</span></label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('sourceData')}
                  >
                    <option value="Result List">All Passed Candidates (Result List)</option>
                    <option value="Merit List">Top Ranked Only (Merit List)</option>
                  </select>
                  {errors.sourceData && <p className="text-xs text-destructive">{errors.sourceData.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Certificate Type <span className="text-destructive">*</span></label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('certificateType')}
                  >
                    <option value="">Select Certificate Type</option>
                    {DUMMY_CERT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.certificateType && <p className="text-xs text-destructive">{errors.certificateType.message}</p>}
                </div>
             </div>
           </CardContent>
         </Card>

         <Card className="border-border shadow-sm">
           <CardHeader className="bg-muted/50 border-b border-border">
             <CardTitle className="text-lg flex items-center gap-2"><Paintbrush className="w-5 h-5 text-primary" /> Template & Design</CardTitle>
             <CardDescription>Select the template design to apply.</CardDescription>
           </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                 {templates.map((template) => (
                    <CertificateTemplateCard 
                       key={template.id} 
                       template={template} 
                       selected={selectedTemplate === template.id}
                       onSelect={() => setSelectedTemplate(template.id)}
                    />
                 ))}
              </div>

              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">Security Features</h4>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('includeQrCode')} className="w-4 h-4 text-primary rounded border-input" />
                  <span className="text-sm font-medium text-foreground">Include QR Code (Verification)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('includeDigitalSignature')} className="w-4 h-4 text-primary rounded border-input" />
                  <span className="text-sm font-medium text-foreground">Digital Signature (Cryptographic)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('includeWatermark')} className="w-4 h-4 text-primary rounded border-input" />
                  <span className="text-sm font-medium text-foreground">Authority Watermark</span>
                </label>
              </div>
           </CardContent>
         </Card>

         <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="bg-card">Save as Draft</Button>
            <Button type="submit">
               <FileDown className="w-4 h-4 mr-2" />
               Generate Certificates
            </Button>
         </div>
      </form>
    </div>
  );
}
