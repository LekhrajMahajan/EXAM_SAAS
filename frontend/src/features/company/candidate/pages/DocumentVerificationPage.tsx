import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { DocumentData } from '../components/DocumentCard';
import { DocumentViewer } from '../components/DocumentViewer';
import { VerificationPanel } from '../components/VerificationPanel';

const PLACEHOLDER_DOCUMENTS: DocumentData[] = [
  { id: '1', name: 'Passport Size Photo', type: 'image', url: 'https://placehold.co/400x400/png', uploadDate: '2023-10-01 10:00 AM', status: 'Verified', verifiedBy: 'Admin User' },
  { id: '2', name: 'Signature', type: 'image', url: 'https://placehold.co/400x200/png', uploadDate: '2023-10-01 10:05 AM', status: 'Pending' },
  { id: '3', name: 'Thumb Impression', type: 'image', url: 'https://placehold.co/400x400/png', uploadDate: '2023-10-01 10:10 AM', status: 'Pending' },
  { id: '4', name: 'Aadhaar Card', type: 'pdf', url: '', uploadDate: '2023-10-01 10:15 AM', status: 'Rejected', remarks: 'Blurry image, please re-upload a clear scanned copy.', verifiedBy: 'Super Admin' },
  { id: '5', name: 'Category Certificate', type: 'pdf', url: '', uploadDate: '2023-10-02 11:00 AM', status: 'Pending' },
];

const CANDIDATE_INFO = {
  applicationNumber: 'APP-2023-0042',
  name: 'Rahul Sharma',
  exam: 'JEE Mains 2024',
  category: 'OBC-NCL',
  status: 'In Review',
};

export function DocumentVerificationPage() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<DocumentData[]>(PLACEHOLDER_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(documents[0]);

  const handleVerifyAction = (docId: string, action: 'approve' | 'reject' | 'reupload', data?: any) => {
    setDocuments((prevDocs) => 
      prevDocs.map(doc => {
        if (doc.id === docId) {
          let newStatus = doc.status;
          if (action === 'approve') newStatus = 'Verified';
          if (action === 'reject') newStatus = 'Rejected';
          if (action === 'reupload') newStatus = 'Re-upload Requested';
          
          return {
            ...doc,
            status: newStatus as any,
            remarks: data?.remarks || data?.reason || undefined,
            verifiedBy: 'Current Admin',
          };
        }
        return doc;
      })
    );
    
    // Update selected doc if it's the one modified
    if (selectedDocument?.id === docId) {
      setSelectedDocument((prev) => {
        if (!prev) return prev;
        let newStatus = prev.status;
        if (action === 'approve') newStatus = 'Verified';
        if (action === 'reject') newStatus = 'Rejected';
        if (action === 'reupload') newStatus = 'Re-upload Requested';
        return {
          ...prev,
          status: newStatus as any,
          remarks: data?.remarks || data?.reason || undefined,
          verifiedBy: 'Current Admin',
        };
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/company/candidates/${id}/documents`}>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Verification</h1>
            <p className="text-sm text-gray-500">Review and verify candidate documents side-by-side.</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/company/candidates/${id}/timeline`}>View Timeline</Link>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <DocumentViewer document={selectedDocument} />
        </div>
        <div className="h-full overflow-y-auto">
          <VerificationPanel 
            candidate={CANDIDATE_INFO}
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
            onVerifyAction={handleVerifyAction}
          />
        </div>
      </div>
    </div>
  );
}
