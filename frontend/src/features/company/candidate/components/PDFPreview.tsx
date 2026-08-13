import React from 'react';
import { FileText } from 'lucide-react';

interface PDFPreviewProps {
  url: string;
  className?: string;
}

export function PDFPreview({ url, className = '' }: PDFPreviewProps) {
  // A true PDF preview might use react-pdf, but for placeholder we just show an icon
  // or a simple iframe. Using iframe for basic rendering if possible.
  return (
    <div className={`relative bg-gray-50 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center ${className}`}>
      {url ? (
        <iframe src={`${url}#toolbar=0`} className="w-full h-full object-contain" title="PDF Preview" />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <FileText className="w-8 h-8 mb-2" />
          <span className="text-sm">PDF Document</span>
        </div>
      )}
      {/* Overlay to prevent interaction in thumbnail view if we wanted, but iframe handles it ok */}
    </div>
  );
}
