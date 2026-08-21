import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { StaffHeader } from '../../staff/components/StaffHeader'
import { StaffFilters } from '../../staff/components/StaffFilters'
import { StaffTable } from '../../staff/components/StaffTable'
import { StaffViewDialog } from '../../staff/components/StaffViewDialog'
import { StaffEditDialog } from '../../staff/components/StaffEditDialog'
import { Button } from '@/shared/components/ui/button'
import { Plus, RefreshCw, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { useStaffList } from '../../staff/hooks/staff.hooks'
import { staffApi } from '../../staff/api/staff.api'
import { examApi } from '@/features/exam-manager/api/exam.api'
import { topicApi } from '@/features/exam-manager/api/topic.api'
import { apiClient } from '@/core/api/http/axios-client'
import { Badge } from '@/shared/components/ui/badge'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'
import { getDisplayStatus } from '@/shared/utils/exam-status'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

import type { Staff } from '../../staff/types/staff.types'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { StaffForm } from '../../staff/components/StaffForm'
import { Card, CardContent } from '@/shared/components/ui/card'

export const PaperSettersManagementPage = () => {
  const [viewedStaff, setViewedStaff] = useState<Staff | null>(null)
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createExamId, setCreateExamId] = useState<string | null>(null)

  const [exams, setExams] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [isExamsLoading, setIsExamsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [examNameFilter, setExamNameFilter] = useState('ALL')
  // Map of examId -> whether all subjects have at least 1 topic
  const [examTopicsMap, setExamTopicsMap] = useState<Record<string, boolean>>({})

  const [toggleConfirmState, setToggleConfirmState] = useState<{
    isOpen: boolean
    staff: Staff | null
    examId?: string
  }>({
    isOpen: false,
    staff: null,
  })

  // We fetch a larger limit to ensure we have all paper setters for grouping
  const {
    data: response,
    isLoading: isStaffLoading,
    refetch: refetchStaff,
  } = useStaffList({ page: 1, limit: 1000, role: 'PAPER_SETTER' })

  const fetchData = useCallback(async () => {
    try {
      const examRes = await examApi.getAll({ limit: 1000 })

      if (examRes.success) {
        const fetchedExams = examRes.data.exams || []
        setExams(fetchedExams)

        // For each exam, check if at least 1 topic has been added
        const topicsMap: Record<string, boolean> = {}
        await Promise.all(
          fetchedExams.map(async (exam: any) => {
            try {
              // Fetch topics for this exam
              const topicRes = await topicApi.getAll({ examId: exam._id, limit: 1 })
              const total = topicRes?.data?.total ?? topicRes?.data?.topics?.length ?? 0
              // If any topic exists for this exam, the button is enabled
              topicsMap[exam._id] = total > 0
            } catch {
              topicsMap[exam._id] = false
            }
          }),
        )
        setExamTopicsMap(topicsMap)
      }
      try {
        const assignmentRes = await apiClient.get('/staff-assignments', {
          params: { limit: 1000, role: 'PAPER_SETTER' },
        })
        const resData = assignmentRes.data?.data
        const assignmentList = Array.isArray(resData) ? resData : resData?.data || []
        setAssignments(assignmentList)
      } catch (err) {
        console.error('Failed to fetch assignments', err)
        setAssignments([])
      }
    } catch (error) {
      console.error('Failed to fetch exams/assignments', error)
    } finally {
      setIsExamsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initFetch = async () => {
      await fetchData()
    }
    initFetch()
  }, [fetchData])

  const handleRefresh = () => {
    setIsExamsLoading(true)
    refetchStaff()
    fetchData()
  }

  const rawData = response?.data
  const staffList: Staff[] = Array.isArray(rawData) ? rawData : (rawData as any)?.data || []
  const filteredList = staffList.filter(
    (s) => s.role === 'PAPER_SETTER' || (s.roles && s.roles.includes('PAPER_SETTER')),
  )

  // Group staff by examId
  const staffByExam = useMemo(() => {
    const map: Record<string, Staff[]> = {}

    // First map all explicit assignments
    const assignedEmployeeIds = new Set<string>()

    if (assignments && assignments.length > 0) {
      assignments.forEach(assignment => {
        if (assignment.role === 'PAPER_SETTER' && assignment.examId && assignment.employeeId) {
          const examIdStr = typeof assignment.examId === 'string' ? assignment.examId : assignment.examId._id
          const empIdStr = typeof assignment.employeeId === 'string' ? assignment.employeeId : assignment.employeeId._id

          if (!map[examIdStr]) map[examIdStr] = []

          const staffMember = filteredList.find(s => (s.id || s._id) === empIdStr)
          if (staffMember) {
            map[examIdStr].push({ 
              ...staffMember, 
              assignmentId: assignment._id,
              assignmentStatus: assignment.status
            } as Staff)
            assignedEmployeeIds.add(empIdStr)
          }
        }
      })
    }

    // Then put everyone else in 'unassigned'
    filteredList.forEach(staff => {
      const staffId = staff.id || staff._id
      if (staffId && !assignedEmployeeIds.has(staffId)) {
        if (!map['unassigned']) map['unassigned'] = []
        map['unassigned'].push(staff)
      }
    })
    
    return map
  }, [filteredList, assignments])

  const filteredExams = useMemo(() => {
    if (!searchQuery) return exams
    const lowerQuery = searchQuery.toLowerCase()
    return exams.filter((exam) => {
      const examNameMatch =
        (exam.examTitle || '').toLowerCase().includes(lowerQuery) ||
        (exam.examCode || '').toLowerCase().includes(lowerQuery)

      const examStaff = staffByExam[exam._id] || []
      const staffMatch = examStaff.some(
        (staff) =>
          (staff.firstName || '').toLowerCase().includes(lowerQuery) ||
          (staff.lastName || '').toLowerCase().includes(lowerQuery) ||
          (staff.email || '').toLowerCase().includes(lowerQuery) ||
          (staff.employeeCode || '').toLowerCase().includes(lowerQuery),
      )

      return examNameMatch || staffMatch
    })
  }, [exams, searchQuery, staffByExam, examNameFilter])

  const getFilteredStaffForExam = useCallback(
    (examId: string) => {
      const staff = staffByExam[examId] || []
      if (!searchQuery) return staff

      const lowerQuery = searchQuery.toLowerCase()
      return staff.filter(
        (s) =>
          (s.firstName || '').toLowerCase().includes(lowerQuery) ||
          (s.lastName || '').toLowerCase().includes(lowerQuery) ||
          (s.email || '').toLowerCase().includes(lowerQuery) ||
          (s.employeeCode || '').toLowerCase().includes(lowerQuery),
      )
    },
    [staffByExam, searchQuery, exams],
  )

  const filteredUnassigned = useMemo(() => {
    const unassigned = staffByExam['unassigned'] || []
    if (!searchQuery) return unassigned
    const lowerQuery = searchQuery.toLowerCase()
    return unassigned.filter(
      (staff) =>
        (staff.firstName || '').toLowerCase().includes(lowerQuery) ||
        (staff.lastName || '').toLowerCase().includes(lowerQuery) ||
        (staff.email || '').toLowerCase().includes(lowerQuery) ||
        (staff.employeeCode || '').toLowerCase().includes(lowerQuery),
    )
  }, [staffByExam, searchQuery])

  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>({})

  const toggleExpand = (examId: string) => {
    setExpandedExams((prev) => ({ ...prev, [examId]: !prev[examId] }))
  }

  const executeToggleStatus = async () => {
    if (!toggleConfirmState.staff) return
    const { staff, examId } = toggleConfirmState

    try {
      const staffId = staff.id || staff._id
      if (!staffId) return

      if (examId && examId !== 'unassigned') {
        const assignmentId = (staff as any).assignmentId
        if (assignmentId) {
          const currentAssignmentStatus = (staff as any).assignmentStatus || 'PUBLISHED'
          const newStatus = currentAssignmentStatus === 'INACTIVE' ? 'PUBLISHED' : 'INACTIVE'
          await apiClient.patch(`/staff-assignments/${assignmentId}`, { status: newStatus })
          toast({
            title: 'Assignment Status Updated',
            description: `Paper Setter assignment changed to ${newStatus}.`,
            variant: 'success',
          })
          handleRefresh()
          setToggleConfirmState({ isOpen: false, staff: null })
          return
        }
      }

      const newStatus = staff.status.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await staffApi.updateStatus(staffId, newStatus)
      toast({
        title: 'Status Updated',
        description: `Paper Setter status changed to ${newStatus}.`,
        variant: 'success',
      })
      handleRefresh()
      setToggleConfirmState({ isOpen: false, staff: null })
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Could not update paper setter status.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = (staff: Staff, examId?: string) => {
    setToggleConfirmState({ isOpen: true, staff, examId })
  }

  const handleDelete = async (staff: Staff, examId?: string) => {
    if (
      confirm(
        `Are you sure you want to completely delete ${staff.firstName} ${staff.lastName}? This will permanently remove their access from the system.`
      )
    ) {
      try {
        const staffId = staff.id || staff._id
        if (!staffId) return

        // First remove from exam assignment if exists to avoid dangling references
        if (examId && examId !== 'unassigned') {
          const assignment = assignments.find((a) => {
            const eId = typeof a.employeeId === 'string' ? a.employeeId : a.employeeId?._id
            const exId = typeof a.examId === 'string' ? a.examId : a.examId?._id
            return eId === staffId && exId === examId
          })
          if (assignment) {
            try {
              await apiClient.delete(`/staff-assignments/${assignment._id}`)
            } catch (e) {
              console.error("Failed to delete assignment", e)
            }
          }
        }

        // Completely delete the staff from the database
        await staffApi.delete(staffId)
        
        toast({
          title: 'Paper Setter Deleted',
          description: 'Paper Setter has been permanently removed successfully.',
          variant: 'success',
        })
        handleRefresh()
      } catch (err) {
        toast({
          title: 'Delete Failed',
          description: 'Could not delete paper setter.',
          variant: 'destructive',
        })
      }
    }
  }

  const isLoading = isStaffLoading || isExamsLoading

  return (
    <div className='space-y-6 p-6'>
      <StaffHeader
        title='Paper Setters Management'
        description='Manage your paper setters, view their assignments, and create new ones.'
        actions={
          <Button variant='outline' size='sm' className='hidden md:flex' onClick={handleRefresh}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        }
      />

      <StaffFilters
        hideRoleFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder='Search exams or staff...'
        extraFilters={
          <Select value={examNameFilter} onValueChange={setExamNameFilter}>
            <SelectTrigger className='w-[200px] bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200'>
              <SelectValue placeholder='All Exams' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All Exams</SelectItem>
              {exams.map((exam) => (
                <SelectItem key={exam._id} value={exam._id}>
                  {exam.examTitle || exam.examCode || 'Unnamed Exam'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <div className='flex justify-center items-center h-64 border rounded-md'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredExams.map((exam) => {
            const examId = exam._id
            const isExpanded = expandedExams[examId]
            const examStaff = getFilteredStaffForExam(examId).map((staff) => {
              const staffId = staff.id || staff._id
              const assignment = assignments.find((a) => {
                const eId = typeof a.employeeId === 'string' ? a.employeeId : a.employeeId?._id
                const exId = typeof a.examId === 'string' ? a.examId : a.examId?._id
                return eId === staffId && exId === examId
              })
              return {
                ...staff,
                status: staff.status,
                assignmentId: assignment?._id,
              } as Staff
            })

            return (
              <Card key={examId} className='overflow-hidden border-border bg-card shadow-sm'>
                <div
                  className='flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 bg-muted/20 transition-colors'
                  onClick={() => toggleExpand(examId)}
                >
                  <div className='flex items-center'>
                    {isExpanded ? (
                      <ChevronDown className='w-5 h-5 mr-3 text-muted-foreground' />
                    ) : (
                      <ChevronRight className='w-5 h-5 mr-3 text-muted-foreground' />
                    )}
                    <div className='flex items-center gap-2'>
                      <h3 className='text-lg font-semibold'>{exam.examTitle || exam.examCode}</h3>
                      {exam && <ExamStatusBadge exam={exam} className='text-[10px] py-0 h-5' />}
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    {(() => {
                      const displayStatus = getDisplayStatus(exam)
                      const isStartedOrPast = [
                        'EXAM_STARTED',
                        'EXAM_ENDED',
                        'PENDING_RESULT_GENERATE',
                        'PENDING_PUBLISH_RESULT',
                        'RESULT_PUBLISHED',
                        'COMPLETED',
                        'CANCELLED',
                        'ARCHIVED',
                      ].includes(displayStatus.toUpperCase())
                      const isFull = examStaff.length >= 5
                      const noTopics = !examTopicsMap[examId]

                      const isDisabled = isFull || noTopics || isStartedOrPast

                      const tooltipMsg = isStartedOrPast
                        ? 'Cannot add Paper Setters after exam has started or ended.'
                        : noTopics
                        ? 'Please ask the Exam Manager to add topics to all subjects first.'
                        : isFull
                        ? 'Maximum 5 Paper Setters allowed per exam.'
                        : ''

                      const warningMsg = isStartedOrPast
                        ? 'Exam has started — no new paper setters can be added'
                        : noTopics
                        ? 'Exam Manager must add topics to all subjects first'
                        : null

                      return (
                        <div className='flex flex-col items-end gap-2'>
                          <div title={tooltipMsg}>
                            <Button
                              size='sm'
                              disabled={isDisabled}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCreateExamId(examId)
                                setIsCreateOpen(true)
                              }}
                              className='shadow-sm'
                            >
                              <Plus className='w-4 h-4 mr-1' /> Create Paper Setter
                            </Button>
                          </div>
                          
                          <div className='flex flex-col items-end gap-1.5'>
                            <span className='text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 inline-flex items-center justify-center'>
                              {examStaff.length}/5 Setters Assigned
                            </span>
                            {warningMsg && (
                              <p className='text-xs text-destructive font-medium'>
                                * {warningMsg}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className='p-0 border-t border-border bg-background'>
                    {examStaff.length > 0 ? (
                      <div className='border-0 border-transparent'>
                        <StaffTable
                          staffList={examStaff}
                          onView={setViewedStaff}
                          onEdit={setEditedStaff}
                          onToggleStatus={(staff) => handleToggleStatus(staff, examId)}
                          onDelete={(staff) => handleDelete(staff, examId)}
                          variant='paper-setter'
                        />
                      </div>
                    ) : (
                      <div className='p-8 text-center text-muted-foreground border-b border-border bg-muted/10'>
                        No paper setters assigned to this exam.
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}

          {filteredExams.length === 0 && (
            <div className='p-8 text-center border rounded-md border-border text-muted-foreground bg-muted/20'>
              No exams found matching your search.
            </div>
          )}

          {/* Unassigned Staff */}
          {filteredUnassigned && filteredUnassigned.length > 0 && (
            <Card className='overflow-hidden border-border bg-card shadow-sm opacity-80'>
              <div
                className='flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 bg-muted/20 transition-colors'
                onClick={() => toggleExpand('unassigned')}
              >
                <div className='flex items-center'>
                  {expandedExams['unassigned'] ? (
                    <ChevronDown className='w-5 h-5 mr-3 text-muted-foreground' />
                  ) : (
                    <ChevronRight className='w-5 h-5 mr-3 text-muted-foreground' />
                  )}
                  <h3 className='text-lg font-semibold text-amber-500/80'>Unassigned / Pending</h3>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20'>
                    {filteredUnassigned.length} Setters
                  </span>
                </div>
              </div>

              {expandedExams['unassigned'] && (
                <CardContent className='p-0 border-t border-border bg-background'>
                  <div className='border-0 border-transparent'>
                    <StaffTable
                      staffList={filteredUnassigned}
                      onView={setViewedStaff}
                      onEdit={setEditedStaff}
                      onToggleStatus={handleToggleStatus}
                      onDelete={(staff) => handleDelete(staff, 'unassigned')}
                      variant='paper-setter'
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      )}

      <StaffViewDialog
        staff={viewedStaff}
        isOpen={!!viewedStaff}
        onClose={() => setViewedStaff(null)}
      />

      <StaffEditDialog
        staff={editedStaff}
        isOpen={!!editedStaff}
        onClose={() => setEditedStaff(null)}
        onSuccess={() => {
          setEditedStaff(null)
          handleRefresh()
        }}
      />

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open)
          if (!open) setCreateExamId(null)
        }}
      >
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create Paper Setter</DialogTitle>
            <DialogDescription>
              Register a new paper setter and assign their exam.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <StaffForm
              initialValues={{ role: 'PAPER_SETTER', examId: createExamId }}
              fixedRole={true}
              onSuccess={() => {
                setIsCreateOpen(false)
                setCreateExamId(null)
                handleRefresh()
              }}
              onCancel={() => {
                setIsCreateOpen(false)
                setCreateExamId(null)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={toggleConfirmState.isOpen}
        onOpenChange={(open) => {
          if (!open) setToggleConfirmState({ isOpen: false, staff: null })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to{' '}
              {(toggleConfirmState.staff?.status as string) === 'INACTIVE'
                ? 'activate'
                : 'deactivate'}{' '}
              this paper setter?
              {(toggleConfirmState.staff?.status as string) === 'INACTIVE'
                ? ' An email with login credentials will be sent.'
                : ' They will no longer have access to this exam.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setToggleConfirmState({ isOpen: false, staff: null })}
            >
              Cancel
            </Button>
            <Button
              variant={
                (toggleConfirmState.staff?.status as string) === 'INACTIVE'
                  ? 'default'
                  : 'destructive'
              }
              onClick={executeToggleStatus}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
