import React from 'react'
import { DocumentPreview } from './DocumentPreview'
import { Button } from '@/shared/components/ui/button'
import { Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import type { DocumentData } from './DocumentCard'

interface DocumentViewerProps {
  document: DocumentData | null
}

export function DocumentViewer ({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className='flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border rounded-lg text-gray-400'>
        <p>Select a document to view</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full border rounded-lg overflow-hidden bg-gray-100'>
      <div className='flex items-center justify-between p-2 bg-card border-b shadow-sm z-10'>
        <h3 className='font-medium text-sm px-2 truncate max-w-[50%]'>{document.name}</h3>
        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='icon' title='Zoom Out'>
            <ZoomOut className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' title='Zoom In'>
            <ZoomIn className='w-4 h-4' />
          </Button>
          <div className='w-px h-4 bg-gray-300 mx-1' />
          <Button variant='ghost' size='icon' title='Download'>
            <Download className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' title='Full Screen'>
            <Maximize2 className='w-4 h-4' />
          </Button>
        </div>
      </div>
      <div className='flex-1 relative overflow-auto p-4 flex items-center justify-center min-h-[500px]'>
        <div className='max-w-4xl w-full h-full shadow-lg rounded bg-card'>
          <DocumentPreview
            url={document.url}
            type={document.type}
            className='w-full h-full object-contain'
          />
        </div>
      </div>
    </div>
  )
}
