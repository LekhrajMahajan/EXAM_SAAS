
import { PageHeader } from '@/shared/components/layout/page-header';
import { HistoryTable } from '../components/HistoryTable';
import type { ImportHistoryJob } from '../components/HistoryTable';

const MOCK_JOBS: ImportHistoryJob[] = [
  { id: '1', fileName: 'questions_q1.xlsx', importedBy: 'Admin User', importDate: '2026-07-20 09:15 AM', totalRecords: 1500, successCount: 1450, failedCount: 50, status: 'Completed' },
  { id: '2', fileName: 'math_test_bank.csv', importedBy: 'Jane Doe', importDate: '2026-07-19 02:30 PM', totalRecords: 200, successCount: 100, failedCount: 100, status: 'Partial' },
  { id: '3', fileName: 'corrupt_file.xlsx', importedBy: 'Admin User', importDate: '2026-07-18 11:00 AM', totalRecords: 0, successCount: 0, failedCount: 0, status: 'Failed' },
];

export function ImportHistoryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Import History" 
        description="View a record of all past question bank imports." 
      />
      <HistoryTable jobs={MOCK_JOBS} />
    </div>
  );
}

// Force TS server reload
