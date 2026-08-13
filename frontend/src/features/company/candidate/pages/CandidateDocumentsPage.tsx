import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, Upload } from 'lucide-react';
import { DocumentCard, type DocumentData } from '../components/DocumentCard';

const PLACEHOLDER_DOCUMENTS: DocumentData[] = [
  { id: '1', name: 'Passport Size Photo', type: 'image', url: 'https://placehold.co/400x400/png', uploadDate: '2023-10-01 10:00 AM', status: 'Verified', verifiedBy: 'Admin User' },
  { id: '2', name: 'Signature', type: 'image', url: 'https://placehold.co/400x200/png', uploadDate: '2023-10-01 10:05 AM', status: 'Pending' },
  { id: '3', name: 'Thumb Impression', type: 'image', url: 'https://placehold.co/400x400/png', uploadDate: '2023-10-01 10:10 AM', status: 'Pending' },
  { id: '4', name: 'Aadhaar Card', type: 'pdf', url: '', uploadDate: '2023-10-01 10:15 AM', status: 'Rejected', remarks: 'Blurry image, please re-upload a clear scanned copy.', verifiedBy: 'Super Admin' },
  { id: '5', name: 'Category Certificate', type: 'pdf', url: '', uploadDate: '2023-10-02 11:00 AM', status: 'Pending' },
  { id: '6', name: 'PWD Certificate', type: 'pdf', url: '', uploadDate: '2023-10-02 11:30 AM', status: 'Pending' },
  { id: '7', name: 'Income Certificate', type: 'pdf', url: '', uploadDate: '2023-10-03 09:00 AM', status: 'Verified', verifiedBy: 'Admin User' },
  { id: '8', name: 'Education Certificate', type: 'pdf', url: '', uploadDate: '2023-10-03 09:45 AM', status: 'Re-upload Requested', remarks: 'Missing final year mark sheet.', verifiedBy: 'Reviewer 1' },
  { id: '9', name: 'Identity Proof', type: 'image', url: 'https://placehold.co/600x400/png', uploadDate: '2023-10-04 14:00 PM', status: 'Pending' },
  { id: '10', name: 'Other Documents', type: 'pdf', url: '', uploadDate: '2023-10-04 14:30 PM', status: 'Pending' },
];

export function CandidateDocumentsPage() {
  const { id } = useParams();

  const handleVerifyAction = (docId: string, action: string, data?: any) => {
    console.log(`Action: ${action} on Document ${docId}`, data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/company/candidates/${id}`}>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Candidate Documents</h1>
            <p className="text-sm text-gray-500">Manage and view documents uploaded by the candidate.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/company/candidates/${id}/verification`}>Verification Mode</Link>
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PLACEHOLDER_DOCUMENTS.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc} 
            onVerifyAction={handleVerifyAction} 
          />
        ))}
      </div>
    </div>
  );
}
