import React from 'react';
import { ImagePreview } from './ImagePreview';
import { PDFPreview } from './PDFPreview';

interface DocumentPreviewProps {
  url: string;
  type: 'image' | 'pdf';
  alt?: string;
  className?: string;
}

export function DocumentPreview({ url, type, alt, className = '' }: DocumentPreviewProps) {
  if (type === 'pdf') {
    return <PDFPreview url={url} className={className} />;
  }
  
  return <ImagePreview url={url} alt={alt} className={className} />;
}
