import React from 'react';
import type { ExamQuestion } from '../types';
import { Input } from '@/shared/components/ui/input';

interface OptionGroupProps {
  question: ExamQuestion;
  selectedOption?: string;
  onSelect?: (value: string) => void;
}

export function OptionGroup({ question, selectedOption, onSelect }: OptionGroupProps) {
  
  if (question.type === 'Numerical') {
    return (
      <div className="max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">Enter your numerical answer:</label>
        <Input 
          type="number" 
          placeholder="e.g. 42" 
          className="text-lg py-6"
          value={selectedOption || ''}
          onChange={(e) => onSelect && onSelect(e.target.value)}
        />
      </div>
    );
  }

  if (question.type === 'True/False') {
    return (
      <div className="space-y-3">
        <label 
          className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white"
          onClick={(e) => { e.preventDefault(); if (onSelect) onSelect('True'); }}
        >
          <input type="radio" name={`q-${question.id}`} className="w-5 h-5 text-indigo-600" checked={selectedOption === 'True'} readOnly />
          <span className="ml-3 text-slate-700 font-medium">True</span>
        </label>
        <label 
          className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white"
          onClick={(e) => { e.preventDefault(); if (onSelect) onSelect('False'); }}
        >
          <input type="radio" name={`q-${question.id}`} className="w-5 h-5 text-indigo-600" checked={selectedOption === 'False'} readOnly />
          <span className="ml-3 text-slate-700 font-medium">False</span>
        </label>
      </div>
    );
  }

  const isMulti = question.type === 'Multiple Choice';

  return (
    <div className="space-y-3">
      {question.options?.map((option, idx) => (
        <label 
          key={option.id} 
          className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors bg-white group"
          onClick={(e) => { e.preventDefault(); if (onSelect) onSelect(option.id); }}
        >
          <div className="flex items-center justify-center w-6 h-6 rounded border border-slate-300 bg-slate-50 mr-4 text-xs font-bold text-slate-500 group-hover:bg-white group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
            {String.fromCharCode(65 + idx)}
          </div>
          <input 
            type={isMulti ? 'checkbox' : 'radio'} 
            name={`q-${question.id}`} 
            className={`w-5 h-5 text-indigo-600 border-slate-300 ${isMulti ? 'rounded' : ''}`}
            checked={selectedOption === option.id}
            readOnly
          />
          <span className="ml-3 text-slate-700">{option.text}</span>
        </label>
      ))}
    </div>
  );
}
