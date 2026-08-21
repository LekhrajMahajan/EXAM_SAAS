import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { UploadCloud, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import api from '@/services/api';
import * as XLSX from 'xlsx';
import { examApi } from '@/features/exam-manager/api/exam.api';
import type { Exam } from '@/features/exam-manager/api/exam.api';
import { getDisplayStatus } from '@/shared/utils/exam-status';

export function ImportCenterModalGovt({ onSuccess }: { onSuccess?: (importId: string, examName: string, count: number) => void } = {}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoadingExams(true);
        const res = await examApi.getAll({ limit: 100 });
        if (res.success) {
          const activeOnlineExams = res.data.exams.filter(
            (exam: Exam) => getDisplayStatus(exam) === 'ACTIVE' && exam.examMode === 'ONLINE'
          );
          setExams(activeOnlineExams);
        }
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      } finally {
        setIsLoadingExams(false);
      }
    };
    if (open) {
      fetchExams();
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedExamId) {
      setError('Please select an Exam.');
      return;
    }
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsed = XLSX.utils.sheet_to_json(sheet) as any[];

          const requiredFields = [
            'Center name',
            'Center type',
            'Center code',
            'Exam name',
            'Street address & landmark',
            'City/town',
            'State / province',
            'Pincode / postal code',
            'Country'
          ];

          if (parsed.length === 0) {
            setError('The uploaded Excel file is empty.');
            setIsUploading(false);
            return;
          }

          const firstRow = parsed[0];
          const missingFields = requiredFields.filter(field => !(field in firstRow));

          if (missingFields.length > 0) {
            setError(`Missing required columns: ${missingFields.join(', ')}`);
            setIsUploading(false);
            return;
          }

          const centersToSave = parsed.map(row => ({
            centerName: row['Center name'],
            centerType: row['Center type'],
            centerCode: String(row['Center code']),
            examName: row['Exam name'],
            streetAddress: row['Street address & landmark'],
            city: row['City/town'],
            state: row['State / province'],
            pincode: String(row['Pincode / postal code']),
            country: row['Country']
          }));

          const response = await api.post('/import-center-assign-exam', {
            examId: selectedExamId,
            centers: centersToSave
          });

          if (response.data.success) {
            setSuccessMsg('Centers imported successfully!');
            const savedImportId = response.data.data._id;
            const examObj = exams.find(e => e._id === selectedExamId);
            const examName = examObj ? examObj.examTitle || 'Unknown Exam' : 'Unknown Exam';
            setTimeout(() => {
              setOpen(false);
              setFile(null);
              setSelectedExamId('');
              setSuccessMsg(null);
              onSuccess?.(savedImportId, examName, centersToSave.length);
              setIsUploading(false);
            }, 1000);
          } else {
            setError('Failed to save imported centers');
            setIsUploading(false);
          }
        } catch (err: any) {
          console.error(err);
          setError(err.response?.data?.message || err.message || 'Error parsing or uploading file.');
          setIsUploading(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred during import.');
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setFile(null);
          setSelectedExamId('');
          setError(null);
          setSuccessMsg(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="bg-background text-[#2D3E2C] dark:text-slate-200 border border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-white">
          <UploadCloud className="w-4 h-4 mr-2" />
          Import Center
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>Import Centers via Excel</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-hidden">
          <div className="space-y-2 min-w-0">
            <Label htmlFor="exam-select">Select Exam</Label>
            <Select onValueChange={(val) => setSelectedExamId(val)} value={selectedExamId}>
              <SelectTrigger id="exam-select" className="w-full overflow-hidden">
                <div className="flex-1 text-left truncate pr-2">
                  <SelectValue
                    placeholder={isLoadingExams ? 'Loading exams...' : 'Select an exam'}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="max-w-[90vw] sm:max-w-md">
                {exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id} className="break-words whitespace-normal">
                    {exam.examTitle} {exam.examCode ? `(${exam.examCode})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
            <Label htmlFor="excel-file">Upload Excel File (.xlsx, .csv)</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-[250px] overflow-y-auto mt-2">
            <p className="font-medium mb-1">Required Columns:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Center name</li>
              <li>Center type</li>
              <li>Center code</li>
              <li>Exam name</li>
              <li>Street address & landmark</li>
              <li>City/town</li>
              <li>State / province</li>
              <li>Pincode / postal code</li>
              <li>Country</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || !selectedExamId || isUploading} className="bg-[#2D3E2C] hover:bg-[#3d5038] text-white border border-[#2D3E2C]">
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
