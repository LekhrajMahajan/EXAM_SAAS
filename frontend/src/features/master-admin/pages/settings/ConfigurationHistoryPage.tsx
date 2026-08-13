import React, { useState } from 'react'
import {
  useConfigurationHistory,
  useExportConfigurationHistory,
} from '../../hooks/configuration-history.hooks'
import type {
  IConfigurationHistory,
  ConfigurationHistoryFilters,
} from '../../types/configuration-history.types'
import { ConfigurationCompareModal } from '../../components/settings/ConfigurationCompareModal'
import { ConfigurationRollbackModal } from '../../components/settings/ConfigurationRollbackModal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { EyeIcon, RotateCcw, Download } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export const ConfigurationHistoryPage = () => {
  const [filters, setFilters] = useState<ConfigurationHistoryFilters>({ page: 1, limit: 10 })
  const { data, isLoading } = useConfigurationHistory(filters)
  const exportMutation = useExportConfigurationHistory()

  const [compareRecord, setCompareRecord] = useState<IConfigurationHistory | null>(null)
  const [rollbackRecord, setRollbackRecord] = useState<IConfigurationHistory | null>(null)

  const handleExport = () => {
    exportMutation.mutate(filters)
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Audit & Configuration History</h1>
          <p className='text-muted-foreground'>
            View, compare, and rollback system configuration changes.
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant='outline'
          className='border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          disabled={exportMutation.isPending}
        >
          <Download className='mr-2 h-4 w-4' /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 mb-4'>
            <Input
              placeholder='Search setting name...'
              className='max-w-xs'
              value={filters.search || ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
            <Select
              value={filters.module || 'ALL'}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, module: v === 'ALL' ? undefined : v, page: 1 }))
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Module' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Modules</SelectItem>
                <SelectItem value='GENERAL'>General</SelectItem>
                <SelectItem value='SECURITY'>Security</SelectItem>
                <SelectItem value='BACKUP'>Backup</SelectItem>
                <SelectItem value='STORAGE'>Storage</SelectItem>
                <SelectItem value='EXAM_CONFIG'>Exam Config</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Setting</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-10'>
                      Loading history...
                    </TableCell>
                  </TableRow>
                ) : data?.data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-10'>
                      No configuration changes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.data?.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell className='font-medium'>{record.configurationName}</TableCell>
                      <TableCell>{record.module}</TableCell>
                      <TableCell>
                        {record.changedBy?.firstName} {record.changedBy?.lastName}
                      </TableCell>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.rollbackPoint
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-secondary text-green-900'
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setCompareRecord(record)}
                            className='text-muted-foreground hover:text-primary-foreground hover:bg-primary dark:hover:text-secondary dark:hover:bg-secondary/20'
                          >
                            <EyeIcon className='h-4 w-4 mr-1' /> Compare
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setRollbackRecord(record)}
                            className='text-muted-foreground hover:text-primary-foreground hover:bg-primary dark:hover:text-secondary dark:hover:bg-secondary/20'
                          >
                            <RotateCcw className='h-4 w-4 mr-1' /> Rollback
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls here (Optional based on existing patterns) */}
          <div className='flex justify-between items-center mt-4'>
            <div className='text-sm text-muted-foreground'>
              Page {data?.data?.page || 1} of {data?.data?.totalPages || 1}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                disabled={!data || data.data.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                disabled={!data || data.data.page >= data.data.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {compareRecord && (
        <ConfigurationCompareModal
          isOpen={!!compareRecord}
          onClose={() => setCompareRecord(null)}
          oldValue={compareRecord.oldValue}
          newValue={compareRecord.newValue}
        />
      )}

      {rollbackRecord && (
        <ConfigurationRollbackModal
          isOpen={!!rollbackRecord}
          onClose={() => setRollbackRecord(null)}
          record={rollbackRecord}
        />
      )}
    </div>
  )
}

export default ConfigurationHistoryPage
