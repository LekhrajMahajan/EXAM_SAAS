import React from 'react';
import type { AdmitCard } from '../types';
import { QRCodePlaceholder } from './QRCodePlaceholder';
import { BarcodePlaceholder } from './BarcodePlaceholder';
import { User } from 'lucide-react';

interface AdmitCardPreviewProps {
  card: AdmitCard;
}

export function AdmitCardPreview({ card }: AdmitCardPreviewProps) {
  return (
    <div className="bg-white shadow-lg mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 font-sans border border-slate-200 relative print:shadow-none print:border-none print:p-0">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">ADMIT CARD</h1>
          <p className="text-slate-600 text-sm mt-1">{card.examName}</p>
        </div>
        <div className="text-right">
          <BarcodePlaceholder value={card.applicationNumber} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        
        {/* Candidate Info (Left 3 Columns) */}
        <div className="col-span-3 space-y-6">
          <div className="border border-slate-300 rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300">
              <h2 className="text-xs font-bold text-slate-800 uppercase">Candidate Details</h2>
            </div>
            <div className="p-3 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Application Number</span>
                <span className="font-bold text-slate-900">{card.applicationNumber}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Candidate Name</span>
                <span className="font-bold text-slate-900">{card.candidateName}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-300 rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300">
              <h2 className="text-xs font-bold text-slate-800 uppercase">Test Center Details</h2>
            </div>
            <div className="p-3 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Center Code</span>
                  <span className="font-bold text-slate-900">{card.centerId}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Room & Seat</span>
                  <span className="font-bold text-slate-900">{card.roomId} / Seat {card.seatNumber}</span>
                </div>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Center Address</span>
                <span className="font-medium text-slate-900 leading-tight block mt-0.5">{card.centerName}<br/>{card.centerAddress}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-300 rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300">
              <h2 className="text-xs font-bold text-slate-800 uppercase">Exam Schedule</h2>
            </div>
            <div className="p-3 grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Exam Date</span>
                <span className="font-bold text-slate-900">{new Date(card.examDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Reporting Time</span>
                <span className="font-bold text-slate-900">{card.reportingTime}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Gate Closing Time</span>
                <span className="font-bold text-red-600">{card.gateClosingTime}</span>
              </div>
              <div className="col-span-3 mt-1 pt-2 border-t border-slate-100">
                <span className="block text-[10px] text-slate-500 uppercase">Exam Duration</span>
                <span className="font-bold text-slate-900">{card.examStartTime} to {card.examEndTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Media & QR (Right 1 Column) */}
        <div className="col-span-1 space-y-4 flex flex-col items-center">
          <div className="w-32 h-32 border-2 border-slate-300 bg-slate-50 flex items-center justify-center p-1">
            <div className="w-full h-full border border-slate-200 bg-slate-100 flex flex-col items-center justify-center text-slate-400">
              <User className="w-10 h-10 mb-1 opacity-50" />
              <span className="text-[10px] uppercase">Candidate<br/>Photo</span>
            </div>
          </div>
          <div className="w-32 h-12 border-2 border-slate-300 bg-slate-50 flex items-center justify-center p-1">
             <div className="w-full h-full border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
              <span className="text-[10px] uppercase">Signature</span>
            </div>
          </div>
          <div className="mt-4">
            <QRCodePlaceholder value={card.applicationNumber} />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 border-t-2 border-slate-900 pt-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">Important Instructions for Candidates</h3>
        <ul className="text-[11px] text-slate-700 space-y-2 list-decimal pl-4 leading-relaxed">
          <li>The candidate must carry this printed Admit Card and a valid Original Photo ID proof to the exam center.</li>
          <li>Candidates must reach the test center strictly as per the Reporting Time mentioned above.</li>
          <li><strong>No candidate will be allowed entry after the Gate Closing Time.</strong></li>
          <li>Electronic devices, calculators, smartwatches, or any unauthorized materials are strictly prohibited inside the exam hall.</li>
          <li>Please follow all instructions provided by the invigilator. Violation of rules will result in immediate disqualification.</li>
        </ul>
      </div>

    </div>
  );
}
