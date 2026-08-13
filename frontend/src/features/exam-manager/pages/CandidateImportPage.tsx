import React, { useState, useRef } from 'react';
import { Upload, FileDown, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { importExportApi } from '../api/import-export.api';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

export const CandidateImportPage = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await importExportApi.getTemplate('CANDIDATE');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'candidate_import_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download template', variant: 'destructive' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'Error', description: 'Please select a file first', variant: 'destructive' });
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('idle');
      
      await importExportApi.importData({
        type: 'CANDIDATE',
        file: file,
      });

      setUploadStatus('success');
      toast({ title: 'Success', description: 'Candidates imported successfully', variant: 'success' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to import candidates. Please check file format.');
      toast({ title: 'Error', description: 'Import failed', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Government Candidate Import</h1>
          <p className="text-muted-foreground">Import government candidates data dynamically</p>
        </div>
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <FileDown className="mr-2 h-4 w-4" /> Download Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Upload Data</CardTitle>
            <CardDescription>
              Upload CSV or Excel file containing candidate details. Registration Number will be assigned dynamically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${file ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-primary/50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv, .xlsx, .xls" 
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-primary/20 text-primary rounded-full">
                    <FileUp className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-lg mt-2">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-800 rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mt-2">Click or drag file to this area to upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for a single CSV or Excel upload.
                  </p>
                </div>
              )}
            </div>

            {uploadStatus === 'error' && (
              <Alert variant="destructive" className="mt-4 bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {uploadStatus === 'success' && (
              <Alert className="mt-4 bg-success/10 text-success border-success/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>The candidates have been successfully imported and processed.</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? 'Uploading & Processing...' : 'Start Import'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Please ensure your import file follows the required format:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Full Name (Required)</li>
              <li>Gender (Male/Female/Other)</li>
              <li>Date of Birth (YYYY-MM-DD)</li>
              <li>Email (Must be unique)</li>
              <li>Phone (Required)</li>
              <li>Unique Govt ID (Aadhar/PAN/etc)</li>
              <li>Exam Applied For</li>
              <li>Preferred City</li>
            </ul>
            <div className="bg-slate-800 p-3 rounded-md mt-4">
              <p className="font-medium text-slate-200 text-xs mb-1">Note:</p>
              <p className="text-xs">
                Registration numbers are assigned automatically by the system. Room and seat allocation are not required at this stage as they are managed externally.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
