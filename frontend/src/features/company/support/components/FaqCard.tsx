import React, { useState } from 'react';
import type { FaqItem } from '../types';
import { ChevronDown } from 'lucide-react';

export function FaqCard({ faq }: { faq: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
       >
          <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </button>
       {isOpen && (
         <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 text-sm text-slate-700">
            <div className="pt-3">
               <span className="inline-block mb-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">{faq.category}</span>
               <p>{faq.answer}</p>
            </div>
         </div>
       )}
    </div>
  );
}
