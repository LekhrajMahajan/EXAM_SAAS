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
      case 'Verified': return <span className="flex items-center text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>;
      case 'Failed': return <span className="flex items-center text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded border border-red-200"><XCircle className="w-3 h-3 mr-1" /> Failed</span>;
      default: return <span className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  const getDownloadBadge = (status: string) => {
    if (status === 'Downloaded') {
      return <span className="text-emerald-600 flex items-center gap-1 text-xs font-semibold"><Download className="w-3 h-3" /> Yes</span>;
    }
    return <span className="text-slate-400 text-xs">No</span>;
  };

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
        <p className="text-slate-500">No certificates found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
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
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="font-mono font-bold text-slate-900">{record.certificateNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{record.candidateName}</div>
                  <div className="text-xs font-mono text-slate-500">{record.applicationNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                     {record.certificateType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                  {record.issueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getVerificationBadge(record.verificationStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDownloadBadge(record.downloadStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="outline" size="sm" asChild>
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
