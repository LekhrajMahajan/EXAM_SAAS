import React from 'react';
import type { CertificateRecord } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CertificateTableProps {
  records: CertificateRecord[];
}

export function CertificateTable({ records }: CertificateTableProps) {

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'Verified': return <span className="flex items-center text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded border border-primary/20"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>;
      case 'Failed': return <span className="flex items-center text-destructive text-xs font-medium bg-destructive/10 px-2 py-1 rounded border border-destructive/20"><XCircle className="w-3 h-3 mr-1" /> Failed</span>;
      default: return <span className="flex items-center text-warning text-xs font-medium bg-warning/10 px-2 py-1 rounded border border-warning/20"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  const getDownloadBadge = (status: string) => {
    if (status === 'Downloaded') {
      return <span className="text-primary flex items-center gap-1 text-xs font-semibold"><Download className="w-3 h-3" /> Yes</span>;
    }
    return <span className="text-muted-foreground text-xs">No</span>;
  };

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-card border border-border border-dashed rounded-xl">
        <p className="text-muted-foreground">No certificates found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs text-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-4">Certificate No.</th>
              <th scope="col" className="px-6 py-4">Candidate</th>
              <th scope="col" className="px-6 py-4">Type</th>
              <th scope="col" className="px-6 py-4">Issue Date</th>
              <th scope="col" className="px-6 py-4">Verification</th>
              <th scope="col" className="px-6 py-4">Downloaded</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="font-mono font-bold text-foreground">{record.certificateNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-foreground">{record.candidateName}</div>
                  <div className="text-xs font-mono text-muted-foreground">{record.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className="px-2 py-1 rounded bg-muted border border-border text-foreground font-medium">
                     {record.certificateType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                  {record.issueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getVerificationBadge(record.verificationStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDownloadBadge(record.downloadStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="outline" size="sm" asChild className="bg-card text-muted-foreground hover:text-foreground">
                    <Link to={`/company/certificates/${record.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
