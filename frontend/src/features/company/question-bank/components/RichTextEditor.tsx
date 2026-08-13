import React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

/**
 * Placeholder component for a Rich Text Editor (e.g. Quill, TinyMCE).
 * Currently wrapping a simple Textarea for demonstration.
 */
export function RichTextEditor({ value, onChange, placeholder, id, className }: RichTextEditorProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Mock Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border border-b-0 rounded-t-md text-gray-500">
        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold" title="Bold">B</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded italic" title="Italic">I</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded underline" title="Underline">U</button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="List">List</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Link">Link</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Image">Img</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Formula">fx</button>
      </div>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
