import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import {
  Plus,
  Users,
  ClipboardList,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  MinusCircle,
  Pencil,
  XCircle,
  Search,
  ArrowLeft,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Input } from '@/shared/components/ui/input'
import { apiClient } from '@/core/api/http/axios-client'
import { useCenterStaffStore } from '../store/useCenterStaffStore'
import { useAssignExamStaffStore } from '../store/useAssignExamStaffStore'
import { useCenterLabStore } from '../store/useCenterLabStore'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import toast from 'react-hot-toast'

const STAFF_ROLES = [
  'Supervisor',
  'Invigilator',
  'Biometric Coordinator',
  'Observer',
  'Security Lead',
  'Technical Support',
  'Center Superintendent',
  'Entry Checker',
]

const generateId = () => Math.random().toString(36).substring(2, 9)

export const AssignExamStaffPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { staffList, fetchStaff } = useCenterStaffStore()
  const { assignmentsList, fetchAssignments, addAssignment, deleteAssignment } =
    useAssignExamStaffStore()
  const { labsList, fetchLabs } = useCenterLabStore()
  const centerId = user?.centerId || user?.referenceId || ''
  const resolvedCenterId = id || centerId
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedExamId, setSelectedExamId] = useState<string>('')
  const [dynamicExams, setDynamicExams] = useState<Record<string, any>[]>([])

  type AssignmentEntry = { id: string; role: string; staffId: string; labIds: string[] }
  const [assignmentsState, setAssignmentsState] = useState<AssignmentEntry[]>([])

  // New state for reporting time
  const [reportingTime, setReportingTime] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr && !timeStr) return 'N/A'
    let formattedDate = ''
    let extractedTime = timeStr || ''

    if (dateStr) {
      if (dateStr.includes('T') && !timeStr) {
        const parts = dateStr.split('T')
        dateStr = parts[0]
        extractedTime = parts[1]
      }
      try {
        formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      } catch (e) {
        formattedDate = dateStr
      }
    }

    if (formattedDate && extractedTime) {
      return `${formattedDate}, ${extractedTime}`
    }
    return `${formattedDate}${extractedTime}`.trim()
  }

  useEffect(() => {
    if (resolvedCenterId) {
      fetchStaff(resolvedCenterId as string)
      fetchAssignments(resolvedCenterId as string)
      fetchLabs(resolvedCenterId as string)

      apiClient
        .get(`/import-center-assign-exam/assigned-exams/center/${resolvedCenterId}`)
        .then((res) => {
          if (res.data?.success) {
            const activeExams = res.data.data
              .filter((item: any) => item.examId?.status === 'ACTIVE')
              .map((item: any) => item.examId)
            setDynamicExams(activeExams)
          }
        })
        .catch((err) => console.error('Failed to load exams', err))
    }
  }, [fetchStaff, fetchAssignments, resolvedCenterId])

  const resetForm = () => {
    setSelectedExamId('')
    setAssignmentsState([])
    setReportingTime('')
    setIsEditing(false)
  }

  const handleOpenModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditAssignment = (assignment: any) => {
    resetForm()
    setSelectedExamId(assignment.examId)

    if (assignment.reportingTime) {
      try {
        const d = new Date(assignment.reportingTime)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        const hh = String(d.getHours()).padStart(2, '0')
        const min = String(d.getMinutes()).padStart(2, '0')
        setReportingTime(`${yyyy}-${mm}-${dd}T${hh}:${min}`)
      } catch (e) {
        console.error('Failed to parse reporting time', e)
      }
    }

    const loadedAssignments: AssignmentEntry[] = []
    if (assignment.assignments) {
      assignment.assignments.forEach((a: any) => {
        const matchedRole =
          STAFF_ROLES.find((r) => r.toLowerCase() === a.role?.toLowerCase()) || a.role
        const staffIdStr =
          typeof a.staffId === 'object' && a.staffId !== null
            ? a.staffId._id || a.staffId.id
            : a.staffId
        const labIdStr = a.labId
          ? typeof a.labId === 'object' && a.labId !== null
            ? a.labId._id || a.labId.id
            : a.labId
          : undefined

        const existing = loadedAssignments.find(
          (la) => la.role === matchedRole && la.staffId === (staffIdStr || 'unknown-id'),
        )
        if (existing) {
          if (labIdStr && !existing.labIds.includes(labIdStr)) {
            existing.labIds.push(labIdStr)
          }
        } else {
          loadedAssignments.push({
            id: generateId(),
            role: matchedRole,
            staffId: staffIdStr || 'unknown-id',
            labIds: labIdStr ? [labIdStr] : [],
          })
        }
      })
    }
    setAssignmentsState(loadedAssignments)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleAddAssignmentRow = (role: string) => {
    setAssignmentsState((prev) => [...prev, { id: generateId(), role, staffId: '', labIds: [] }])
  }

  const handleUpdateAssignmentRow = (id: string, field: 'staffId', value: string) => {
    setAssignmentsState((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleToggleLab = (id: string, labId: string) => {
    setAssignmentsState((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const hasLab = a.labIds.includes(labId)
          if (a.role === 'Invigilator') {
            return { ...a, labIds: hasLab ? [] : [labId] }
          }
          return {
            ...a,
            labIds: hasLab ? a.labIds.filter((l) => l !== labId) : [...a.labIds, labId],
          }
        }
        return a
      }),
    )
  }

  const handleRemoveAssignmentRow = (id: string) => {
    setAssignmentsState((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSaveAssignments = async () => {
    if (!selectedExamId || assignmentsState.length === 0) {
      toast.error('Please select an exam and assign at least one staff member.')
      return
    }

    const invalidEntries = assignmentsState.filter((a) => !a.staffId)
    if (invalidEntries.length > 0) {
      toast.error('Please select a staff member for all added roles.')
      return
    }

    const exam = dynamicExams.find((e) => e._id === selectedExamId || e.id === selectedExamId)

    const formattedAssignments: any[] = []
    assignmentsState
      .filter((a) => a.staffId && a.staffId !== 'unknown-id')
      .forEach((a) => {
        const staff = staffList.find(
          (s) => s.id === a.staffId || s.staffId === a.staffId || (s as any)._id === a.staffId,
        )
        if (a.labIds && a.labIds.length > 0) {
          a.labIds.forEach((labId) => {
            const lab = labsList.find((l) => l.id === labId)
            formattedAssignments.push({
              role: a.role,
              staffId: a.staffId,
              staffEmail: staff ? staff.email : undefined,
              staffName: staff ? staff.name : 'Unknown Staff',
              labId: labId,
              labName: lab ? lab.labName : undefined,
            })
          })
        } else {
          formattedAssignments.push({
            role: a.role,
            staffId: a.staffId,
            staffEmail: staff ? staff.email : undefined,
            staffName: staff ? staff.name : 'Unknown Staff',
          })
        }
      })

    try {
      await addAssignment(resolvedCenterId as string, {
        examId: selectedExamId,
        examName: exam ? exam.examTitle || exam.title || exam.name : 'Unknown Exam',
        reportingTime: reportingTime ? formatDateTime(reportingTime) : '',
        examStartDate: exam ? formatDateTime(exam.examDate || exam.startDate, exam.startTime) : '',
        examEndDate: exam ? formatDateTime(exam.examDate || exam.endDate, exam.endTime) : '',
        assignments: formattedAssignments,
      })
      setIsModalOpen(false)
      resetForm()
      toast.success('Exam staff assigned successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to assign staff')
    }
  }

  const filteredAssignments = assignmentsList.filter((assignment) => {
    const matchesSearch = (assignment.examName || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const isActive =
      dynamicExams.some(
        (e) => (e._id === assignment.examId || e.id === assignment.examId) && e.status === 'ACTIVE',
      ) || (assignment as any).examId?.status === 'ACTIVE'

    if (statusFilter === 'ACTIVE') return matchesSearch && isActive
    if (statusFilter === 'INACTIVE') return matchesSearch && !isActive
    return matchesSearch
  })

  return (
    <div className='p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex items-stretch gap-3'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => navigate(-1)}
          className='h-auto px-4 bg-card hover:bg-muted border border-border shadow-xl rounded-xl shrink-0'
        >
          <ArrowLeft className='w-5 h-5 text-muted-foreground' />
        </Button>
        <div className='flex justify-between items-center flex-1'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground flex items-center gap-2'>
              <div className='p-3 bg-[#E4FD97] rounded-xl text-[#2D3E2C] mt-1 shrink-0'>
                <ClipboardList className='h-8 w-8' />
              </div>
              Assigned Exam Staff
            </h1>
            <p className='text-muted-foreground mt-2'>
              Assign your center staff to specific exams assigned by the company admin.
            </p>
          </div>
          {!isReadOnly && (
            <Button
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20'
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className='w-4 h-4 mr-2' />
              Assign Staff
            </Button>
          )}
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm mt-6'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search exams...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9 w-full bg-background'
          />
        </div>
        <div className='w-full sm:w-48'>
          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className='w-full bg-background'>
              <SelectValue placeholder='Filter Status' />
            </SelectTrigger>
            <SelectContent className='bg-background border-border'>
              <SelectItem value='ALL' className='text-foreground focus:bg-muted py-2'>
                All Status
              </SelectItem>
              <SelectItem value='ACTIVE' className='text-foreground focus:bg-muted py-2'>
                Active
              </SelectItem>
              <SelectItem value='INACTIVE' className='text-foreground focus:bg-muted py-2'>
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {filteredAssignments.length === 0 ? (
          <div className='col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card shadow-sm'>
            <Users className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground text-lg'>
              {assignmentsList.length === 0
                ? 'No staff assigned to exams yet.'
                : 'No exams match your search/filter.'}
            </p>
            {assignmentsList.length === 0 && (
              <p className='text-muted-foreground text-sm mt-1'>
                Click the &apos;Assign Staff&apos; button to start.
              </p>
            )}
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className='bg-card border-border flex flex-col shadow-xl'>
              <CardHeader className='border-b border-border bg-muted/50 p-4 flex flex-row items-start justify-between'>
                <div>
                  <CardTitle className='text-lg font-medium text-foreground'>
                    {assignment.examName}
                  </CardTitle>
                  <CardDescription className='text-muted-foreground mt-1 flex items-center gap-3'>
                    <span className='flex items-center gap-1'>
                      <CheckCircle2 className='h-3 w-3 text-primary' />
                      Staff Assigned
                    </span>
                    {/* Checking active status (dynamically found or passed via assignment) */}
                    {dynamicExams.some(
                      (e) =>
                        (e._id === assignment.examId || e.id === assignment.examId) &&
                        e.status === 'ACTIVE',
                    ) || (assignment as any).examId?.status === 'ACTIVE' ? (
                      <span className='flex items-center gap-1 bg-[#2D3E2C] text-[#E4FD97] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#2D3E2C]/20'>
                        ACTIVE
                      </span>
                    ) : (
                      <span className='flex items-center gap-1 bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-rose-500/20'>
                        <XCircle className='h-3 w-3' />
                        INACTIVE
                      </span>
                    )}
                  </CardDescription>
                </div>
                {!isReadOnly && (
                  <div className='flex items-center gap-1 -mt-2 -mr-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:text-primary hover:bg-primary/10'
                      onClick={() => handleEditAssignment(assignment)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10'
                      onClick={() => assignment.id && deleteAssignment(assignment.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className='pt-4 flex-1'>
                <div className='space-y-3'>
                  {(() => {
                    const grouped: any[] = [];
                    assignment.assignments.forEach(a => {
                      if (a.role.toUpperCase() === 'SUPERVISOR') {
                        const existing = grouped.find(g => g.staffId === a.staffId && g.role.toUpperCase() === 'SUPERVISOR');
                        if (existing) {
                          if (a.labId || a.labName) {
                            existing.labs.push({ labId: a.labId, labName: a.labName });
                          }
                        } else {
                          grouped.push({ ...a, labs: (a.labId || a.labName) ? [{ labId: a.labId, labName: a.labName }] : [] });
                        }
                      } else {
                        grouped.push({ ...a, labs: (a.labId || a.labName) ? [{ labId: a.labId, labName: a.labName }] : [] });
                      }
                    });

                    return grouped.map((staffRole, idx) => (
                    <div
                      key={idx}
                      className='flex justify-between items-center p-2 rounded-md bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 shadow-sm'
                    >
                      <div className='flex flex-col'>
                        <span className='text-xs font-semibold text-[#2D3E2C]/70 uppercase tracking-wider'>
                          {staffRole.role}
                        </span>
                        <span className='text-sm font-bold mt-0.5 flex items-center gap-1.5'>
                          <ShieldCheck className='h-3 w-3 text-[#2D3E2C]' />
                          {staffRole.staffName}
                        </span>
                        {(staffRole.role.toUpperCase() === 'SUPERVISOR' ||
                          staffRole.role.toUpperCase() === 'INVIGILATOR') &&
                          staffRole.labs && staffRole.labs.length > 0 &&
                          staffRole.labs.map((lData: any, i: number) => {
                            const lab = labsList.find((l) => l.id === lData.labId)
                            return lab ? (
                              <span key={i} className='text-xs font-medium text-[#2D3E2C]/80 mt-1 flex items-center gap-1'>
                                <span className='w-1 h-1 rounded-full bg-[#2D3E2C]/50'></span>
                                {lab.labName} {lab.roomFloor ? `(Block: ${lab.roomFloor})` : ''}
                              </span>
                            ) : lData.labName ? (
                              <span key={i} className='text-xs font-medium text-[#2D3E2C]/80 mt-1 flex items-center gap-1'>
                                <span className='w-1 h-1 rounded-full bg-[#2D3E2C]/50'></span>
                                {lData.labName}
                              </span>
                            ) : null
                          })}
                      </div>
                    </div>
                  ))})()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[750px] max-h-[85vh] overflow-y-auto bg-background border-border text-foreground'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-foreground flex items-center gap-2'>
              <Users className='h-6 w-6 text-primary' />
              {isEditing ? 'Edit Assign Exam Staff' : 'Assign Exam Staff'}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground text-base mt-1'>
              Select an exam and assign staff members to specific roles for it.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground'>Select Assigned Exam</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={isEditing}>
                <SelectTrigger className='w-full bg-background border-border text-foreground'>
                  <SelectValue placeholder='Choose an exam...' />
                </SelectTrigger>
                <SelectContent className='bg-card border-border'>
                  {(dynamicExams || [])
                    .filter((exam) => {
                      if (isEditing && (exam._id === selectedExamId || exam.id === selectedExamId))
                        return true
                      // Don't show exams that are already assigned
                      const isAlreadyAssigned = assignmentsList.some(
                        (a) => a.examId === (exam._id || exam.id),
                      )
                      return !isAlreadyAssigned
                    })
                    .map((exam) => (
                      <SelectItem
                        key={exam._id || exam.id}
                        value={exam._id || exam.id}
                        className='text-foreground focus:bg-muted'
                      >
                        {exam.examTitle || exam.title || exam.name}{' '}
                        {exam.examCode || exam.code ? `(${exam.examCode || exam.code})` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedExamId &&
              (() => {
                const selectedExamData = dynamicExams.find(
                  (e) => e._id === selectedExamId || e.id === selectedExamId,
                )

                return (
                  <React.Fragment>
                    <div className='space-y-4 mt-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 p-5 border border-border rounded-lg shadow-inner'>
                        <div className='space-y-2'>
                          <label className='text-sm font-semibold text-foreground'>
                            Reporting Date & Time
                          </label>
                          <input
                            type='datetime-local'
                            value={reportingTime}
                            onChange={(e) => setReportingTime(e.target.value)}
                            className='w-full h-11 px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all shadow-sm'
                          />
                        </div>
                        <div className='space-y-3 flex flex-col justify-center bg-background p-3 rounded-md border border-border'>
                          <div className='flex justify-between items-center gap-3 border-b border-border pb-2'>
                            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                              Exam Start
                            </span>
                            <span className='text-sm text-foreground font-bold text-right'>
                              {formatDateTime(
                                selectedExamData?.examDate || selectedExamData?.startDate,
                                selectedExamData?.startTime,
                              )}
                            </span>
                          </div>
                          <div className='flex justify-between items-center gap-3 pt-1'>
                            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                              Exam End
                            </span>
                            <span className='text-sm text-foreground font-bold text-right'>
                              {formatDateTime(
                                selectedExamData?.examDate || selectedExamData?.endDate,
                                selectedExamData?.endTime,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-3 mt-6'>
                      <label className='text-sm font-semibold text-foreground'>
                        Add Staff by Role
                      </label>

                      <div className='border border-border rounded-lg overflow-hidden bg-card shadow-sm'>
                        {STAFF_ROLES.map((role, idx) => {
                          const roleAssignmentsList = assignmentsState.filter(
                            (a) => a.role === role,
                          )
                          const requiresLab = role === 'Supervisor' || role === 'Invigilator'
                          const allowMultiple = role === 'Supervisor' || role === 'Invigilator'

                          return (
                            <div
                              key={role}
                              className={`p-4 flex flex-col gap-4 transition-colors hover:bg-muted/50 ${
                                idx !== STAFF_ROLES.length - 1 ? 'border-b border-border' : ''
                              }`}
                            >
                              <div className='flex items-center justify-between'>
                                <span className='text-sm font-semibold text-foreground truncate'>
                                  {role}
                                </span>

                                {(allowMultiple || roleAssignmentsList.length === 0) && (
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => handleAddAssignmentRow(role)}
                                    className='h-8 px-3 text-xs font-medium bg-background border-border hover:bg-primary/20 hover:text-primary hover:border-primary/50 text-foreground transition-all shadow-sm'
                                  >
                                    <Plus className='h-3 w-3 mr-1' /> Add{' '}
                                    {roleAssignmentsList.length > 0 ? 'More' : 'Staff'}
                                  </Button>
                                )}
                              </div>

                              {roleAssignmentsList.length > 0 && (
                                <div className='space-y-3 mt-2 pl-4 border-l-2 border-border/50'>
                                  {roleAssignmentsList.map((assign) => (
                                    <div key={assign.id} className='flex gap-2 items-center'>
                                      <div className='w-48'>
                                        <Select
                                          value={assign.staffId || undefined}
                                          onValueChange={(val) =>
                                            handleUpdateAssignmentRow(assign.id, 'staffId', val)
                                          }
                                        >
                                          <SelectTrigger className='h-9 text-sm bg-background border-border focus:ring-primary/50 text-foreground'>
                                            <SelectValue placeholder='Select Staff...' />
                                          </SelectTrigger>
                                          <SelectContent className='bg-background border-border'>
                                            {(() => {
                                              const availableStaff = staffList
                                                .filter((s) => s.role === role)
                                                .filter((s) => {
                                                  const staffIdVal = ((s as any)._id ||
                                                    s.id ||
                                                    s.staffId) as string
                                                  return !assignmentsState.some(
                                                    (a) =>
                                                      a.role === role &&
                                                      a.staffId === staffIdVal &&
                                                      a.id !== assign.id,
                                                  )
                                                })

                                              if (availableStaff.length === 0) {
                                                return (
                                                  <div className='p-3 text-sm text-muted-foreground text-center'>
                                                    No staff found
                                                  </div>
                                                )
                                              }

                                              return availableStaff.map((staff) => {
                                                const staffIdVal = ((staff as any)._id ||
                                                  staff.id ||
                                                  staff.staffId) as string
                                                return (
                                                  <SelectItem
                                                    key={staffIdVal}
                                                    value={staffIdVal}
                                                    className='text-sm focus:bg-muted py-2 text-foreground'
                                                  >
                                                    {staff.name}
                                                  </SelectItem>
                                                )
                                              })
                                            })()}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {requiresLab && (
                                        <div className='w-48'>
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button
                                                variant='outline'
                                                className='w-full justify-between h-9 text-sm bg-background border-border text-foreground px-3 font-normal hover:bg-muted focus:ring-1 focus:ring-primary/50'
                                              >
                                                <span className='truncate'>
                                                  {assign.labIds.length > 0
                                                    ? `${assign.labIds.length} Lab(s) selected`
                                                    : 'Select Labs...'}
                                                </span>
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-56 p-0 bg-background border-border'>
                                              <div className='max-h-60 overflow-y-auto p-1'>
                                                {(() => {
                                                  const availableLabs = labsList.filter((lab) => {
                                                    return !assignmentsState.some(
                                                      (a) =>
                                                        a.role === role &&
                                                        a.labIds.includes(lab.id) &&
                                                        a.id !== assign.id,
                                                    )
                                                  })

                                                  if (availableLabs.length === 0) {
                                                    return (
                                                      <div className='p-3 text-sm text-muted-foreground text-center'>
                                                        No labs available
                                                      </div>
                                                    )
                                                  }

                                                  return availableLabs.map((lab) => {
                                                    const isSelected = assign.labIds.includes(
                                                      lab.id,
                                                    )
                                                    return (
                                                      <div
                                                        key={lab.id}
                                                        onClick={() =>
                                                          handleToggleLab(assign.id, lab.id)
                                                        }
                                                        className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-2 pr-8 text-sm outline-none hover:bg-muted focus:bg-accent focus:text-accent-foreground transition-colors`}
                                                      >
                                                        <span className='flex-1 truncate text-foreground'>
                                                          {lab.labName} ({lab.labCode})
                                                        </span>
                                                        {isSelected && (
                                                          <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center text-primary'>
                                                            <Check className='h-4 w-4' />
                                                          </span>
                                                        )}
                                                      </div>
                                                    )
                                                  })
                                                })()}
                                              </div>
                                            </PopoverContent>
                                          </Popover>
                                        </div>
                                      )}

                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50'
                                        onClick={() => handleRemoveAssignmentRow(assign.id)}
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                )
              })()}
          </div>

          <DialogFooter>
            <Button
              variant='ghost'
              onClick={() => setIsModalOpen(false)}
              className='text-muted-foreground hover:text-foreground'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAssignments}
              className='bg-primary hover:bg-primary/90 text-primary-foreground'
            >
              Assigned Exam Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AssignExamStaffPage
