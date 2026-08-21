import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/core/api/http/axios-client';

interface ExportResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uniqueExams: { id: string, name: string }[];
}

export function ExportResultsModal({ open, onOpenChange, uniqueExams }: ExportResultsModalProps) {
  const [format, setFormat] = useState<"csv" | "excel">("excel");
  const [selectedExam, setSelectedExam] = useState<string>("");

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedExam) {
      toast.error("Please select an exam to export.");
      return;
    }

    const examObj = uniqueExams.find(e => e.name === selectedExam);
    if (!examObj) {
      toast.error("Invalid exam selected.");
      return;
    }

    try {
      setIsExporting(true);
      const res = await apiClient.get(`/results/export/${examObj.id}`);
      
      if (!res.data?.data || res.data.data.length === 0) {
        toast.error("No results found for the selected exam.");
        return;
      }
      
      const examResults = res.data.data;

      const combinedData: Record<string, string | number>[] = [];

      examResults.forEach((r: Record<string, any>) => {
        const summary = {
          "Application Number": r.applicationNumber,
          "Candidate Name": r.candidateName,
          "Exam": r.exam,
          "Subject": r.subject,
          "Shift": r.shift,
          "Center": r.center,
          "Marks Obtained": r.marksObtained,
          "Total Marks": r.totalMarks,
          "Percentage": `${r.percentage}%`,
          "Grade": r.grade,
          "Status": r.status,
        };

        if (r.answers && r.answers.length > 0) {
          r.answers.forEach((ans: Record<string, any>, index: number) => {
            combinedData.push({
              ...summary,
              "Q.No": index + 1,
              "Question Text": ans.questionText?.replace(/<[^>]+>/g, '') || '', // Strip HTML
              "Candidate Answer": ans.selectedAnswer || 'Not Attempted',
              "Correct Answer": ans.correctAnswer || '',
              "Is Correct": ans.isCorrect ? 'Yes' : 'No',
              "Question Marks": ans.isCorrect ? ans.marks : -(ans.negativeMarks || 0)
            });
          });
        } else {
          // If no answers exist, at least output the summary row
          combinedData.push(summary);
        }
      });

      const workbook = XLSX.utils.book_new();
      const fileName = `Results_${selectedExam.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}`;

      const worksheet = XLSX.utils.json_to_sheet(combinedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed Results");

      if (format === 'excel') {
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else {
        XLSX.writeFile(workbook, `${fileName}.csv`);
      }

      toast.success("Results exported successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Failed to export results.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Results</DialogTitle>
          <DialogDescription>
            Select the format and the exam to download candidate results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <div className="col-span-3">
              <Select value={format} onValueChange={(v: "csv" | "excel") => setFormat(v)}>
                <SelectTrigger id="format" className="w-full bg-white dark:bg-[#16191F]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exam" className="text-right">
              Exam
            </Label>
            <div className="col-span-3">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger id="exam" className="w-full bg-white dark:bg-[#16191F]">
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueExams.map(exam => (
                    <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleExport} disabled={isExporting} className="bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-secondary">
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
