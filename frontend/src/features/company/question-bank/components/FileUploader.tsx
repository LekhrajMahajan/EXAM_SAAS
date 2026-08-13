import { UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFormats: string;
  formatDescription: string;
}

export function FileUploader({ onFileSelect, acceptedFormats, formatDescription }: FileUploaderProps) {
  return (
    <Card className="border-dashed border-2 border-muted hover:border-primary transition-colors">
      <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Click to upload or drag and drop</h3>
          <p className="text-sm text-muted-foreground">{formatDescription}</p>
        </div>
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            Browse Files
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept={acceptedFormats}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function CSVUploader({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  return (
    <FileUploader
      onFileSelect={onFileSelect}
      acceptedFormats=".csv, text/csv"
      formatDescription="CSV Files (.csv)"
    />
  );
}

export function ExcelUploader({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  return (
    <FileUploader
      onFileSelect={onFileSelect}
      acceptedFormats=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      formatDescription="Excel Files (.xlsx)"
    />
  );
}
