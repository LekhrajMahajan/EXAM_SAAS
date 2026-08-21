import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Loader2, UploadCloud, FileSpreadsheet } from "lucide-react";
import api from "@/services/api";
import * as XLSX from "xlsx";

interface BulkAddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string;
  subjectName: string;
  remainingQuota: number;
  onSuccess: () => void;
}

export function BulkAddQuestionModal({ isOpen, onClose, paperId, subjectName, remainingQuota, onSuccess }: BulkAddQuestionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setWarnings([]);
    }
  };

  const parseData = (dataLines: any[][]) => {
    // Filter empty rows
    const validLines = dataLines.filter(row => row.length > 0 && row.some(cell => cell !== undefined && cell !== null && cell !== ''));
    if (validLines.length < 2) throw new Error("File seems empty or missing headers");
    
    // Skip header line
    let rows = validLines.slice(1);
    
    // No slicing here anymore. We send all valid parsed rows to the backend,
    // and the backend will pick enough valid, non-duplicate questions to fill the quota.

    const parsedWarnings: string[] = [];
    const parsedQuestions: any[] = [];

    rows.forEach((row, rowIndex) => {
      try {
        const getString = (val: any) => (val != null ? String(val).trim() : "");
        const qText = getString(row[0]);
        const optA = getString(row[1]);
        const optB = getString(row[2]);
        const optC = getString(row[3]);
        const optD = getString(row[4]);
        const optE = getString(row[5]);
        const correct = getString(row[6]);
        
        if (!qText) throw new Error(`Question text missing`);
        
        const optionsRaw = [optA, optB, optC, optD, optE];
        const filledOptions = optionsRaw.map((opt, i) => ({ text: opt, originalIndex: i })).filter(o => o.text !== "");
        
        if (![2, 4, 5].includes(filledOptions.length)) {
          throw new Error(`Must provide exactly 2, 4, or 5 options.`);
        }

        if (!correct || !["A","B","C","D","E"].includes(correct.toUpperCase())) {
          throw new Error(`Correct option must be A, B, C, D, or E.`);
        }

        const correctIndex = correct.toUpperCase().charCodeAt(0) - 65;
        
        if (!optionsRaw[correctIndex]) {
          throw new Error(`Correct option ${correct.toUpperCase()} is empty.`);
        }

        const payloadOptions = filledOptions.map(o => ({
          optionId: String.fromCharCode(65 + o.originalIndex),
          optionLabel: String.fromCharCode(65 + o.originalIndex),
          optionText: o.text,
          isCorrect: o.originalIndex === correctIndex
        }));

        parsedQuestions.push({
          questionType: "SINGLE_CHOICE",
          question: qText,
          options: payloadOptions,
          subjectName,
          difficulty: "MEDIUM",
        });
      } catch (err: any) {
        parsedWarnings.push(`Row ${rowIndex + 2}: ${err.message}`);
      }
    });

    return { questions: parsedQuestions, warnings: parsedWarnings };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setWarnings([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const dataLines: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const { questions, warnings: parseWarnings } = parseData(dataLines);
      
      if (questions.length === 0) {
        throw new Error(parseWarnings.length > 0 ? "All rows were invalid. Please check format." : "No valid questions found.");
      }

      const response = await api.post(`/papers/${paperId}/questions/bulk`, {
        subjectName,
        questions
      });

      const backendWarnings = response.data?.data?.warnings || [];
      const allWarnings = [...parseWarnings, ...backendWarnings];

      if (allWarnings.length > 0) {
        setWarnings(allWarnings);
        onSuccess();
        // Do not close or clear file immediately if there are warnings so user can read them
        setFile(null);
      } else {
        onSuccess();
        onClose();
        setFile(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to process bulk upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Bulk Add Questions - {subjectName}</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing questions. Remaining Quota: <strong>{remainingQuota}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 w-full min-w-0 overflow-hidden">
          
          <div className="p-4 border rounded-lg bg-muted/50 text-sm w-full overflow-hidden">
            <h4 className="font-semibold mb-2 text-foreground">Format Required:</h4>
            <p className="text-muted-foreground">Header row must exist. Columns should be:</p>
              <div className="bg-background border text-foreground p-3 rounded mt-2 font-mono text-sm break-words whitespace-normal shadow-sm">
                QuestionText, OptionA, OptionB, OptionC, OptionD, OptionE, CorrectOption
              </div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Exactly 2, 4, or 5 options must be filled.</li>
                <li>CorrectOption must be A, B, C, D, or E.</li>
                <li className="break-words whitespace-normal">If the file contains more questions than your quota ({remainingQuota}), only the first {remainingQuota} questions will be processed.</li>
              </ul>
            </div>

          <div className="space-y-2">
            <Label>Upload File</Label>
            <div className="flex items-center gap-4 w-full">
              <Button type="button" variant="outline" className="shrink-0" onClick={() => document.getElementById('file-upload')?.click()}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Select File
              </Button>
              <span className="text-sm text-muted-foreground truncate flex-1 min-w-0 block" title={file?.name}>
                {file ? file.name : "No file selected"}
              </span>
              <input 
                id="file-upload"
                type="file" 
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="text-sm text-yellow-800 bg-yellow-100 p-3 rounded max-h-40 overflow-y-auto w-full">
              <p className="font-semibold mb-1 flex items-center gap-2">
                ⚠️ Upload Successful with Warnings:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {warnings.length > 0 ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting || !file}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload Questions
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
