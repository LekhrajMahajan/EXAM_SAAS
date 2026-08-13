import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  alt?: string;
  className?: string;
}

export function ImagePreview({ url, alt = 'Document Preview', className = '' }: ImagePreviewProps) {
  const [error, setError] = React.useState(false);

  if (error || !url) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-500 rounded-md ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2" />
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`object-cover rounded-md ${className}`}
      onError={() => setError(true)}
    />
  );
}
