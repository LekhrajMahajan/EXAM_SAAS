import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { QrCode, Medal, FileSignature } from 'lucide-react';

interface CertificatePreviewProps {
  candidateName?: string;
  exam?: string;
  issueDate?: string;
}

export function CertificatePreview({ candidateName = "CANDIDATE NAME", exam = "EXAMINATION NAME", issueDate = "MM/DD/YYYY" }: CertificatePreviewProps) {
  return (
    <Card className="border-slate-300 shadow-xl overflow-hidden max-w-4xl mx-auto w-full aspect-[1.414] relative bg-amber-50/30">
       <div className="absolute inset-0 m-4 sm:m-8 border-[12px] border-double border-slate-200 pointer-events-none z-10" />
       
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
         <Medal className="w-96 h-96" />
       </div>

       <CardContent className="h-full p-12 sm:p-24 flex flex-col items-center justify-center text-center relative z-20">
          <div className="text-amber-600 mb-6">
             <Medal className="w-16 h-16 mx-auto" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-slate-800 tracking-widest uppercase mb-4">Certificate of Merit</h2>
          <p className="text-slate-600 italic mb-8 sm:text-lg">This is to certify that</p>
          
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-8 border-b-2 border-slate-300 pb-2 px-12 inline-block">
             {candidateName}
          </h3>
          
          <p className="text-slate-600 italic mb-4 sm:text-lg">has successfully qualified the</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-wider mb-16">{exam}</p>

          <div className="w-full flex justify-between items-end px-12 mt-auto">
             <div className="flex flex-col items-center">
               <div className="w-32 h-32 bg-white border border-slate-200 p-2 shadow-sm rounded-sm mb-2">
                 <QrCode className="w-full h-full text-slate-800" />
               </div>
               <span className="text-[10px] font-mono text-slate-500">Scan to Verify</span>
             </div>

             <div className="flex flex-col items-center">
               <span className="text-slate-700 font-bold mb-1">{issueDate}</span>
               <span className="text-xs uppercase tracking-wider text-slate-500 border-t border-slate-300 pt-1 w-32 text-center">Issue Date</span>
             </div>

             <div className="flex flex-col items-center">
               <FileSignature className="w-16 h-16 text-indigo-800/60 mb-2" />
               <span className="text-xs uppercase tracking-wider text-slate-500 border-t border-slate-300 pt-1 w-48 text-center">Authorized Signatory</span>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}
