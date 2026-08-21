import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { useCenterLabStore, type CenterLab } from '../store/useCenterLabStore'
import { useCenterStaffStore } from '../store/useCenterStaffStore'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { StatCard } from '@/features/company/components/dashboard/StatCard'
import { Button } from '@/shared/components/ui/button'
import {
  Monitor,
  PlusCircle,
  Search,
  MapPin,
  Users,
  CheckCircle2,
  UserCheck,
  Edit3,
  Trash2,
  Building2,
  Wrench,
  ArrowLeft
} from 'lucide-react'

const generateLabCode = () => `LAB-${Math.floor(100 + Math.random() * 899)}`

const LAB_FACILITIES_OPTIONS = [
  'Air Conditioned',
  'UPS Battery Backup',
  'CCTV Surveillance',
  'Biometric Entry Terminal',
  'Gigabit LAN Network',
  'Dual ISP Redundancy',
  'Soundproof Partitions',
  'Wheelchair Access Desk',
]

export const CenterLabDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';

  const { labsList, fetchLabs, addLab, updateLab, deleteLab } = useCenterLabStore()
  const { staffList, fetchStaff } = useCenterStaffStore()

  useEffect(() => {
    fetchLabs(id)
    fetchStaff(id)
  }, [fetchLabs, fetchStaff, id])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<CenterLab, 'id'>>({
    labName: '',
    labCode: '',
    roomFloor: 'Ground Floor, Wing A',
    centerName: 'Main Examination Center',
    seatingCapacity: 60,
    totalComputers: 60,
    assignedSupervisor: staffList[0]?.name || 'Unassigned',
    facilities: ['Air Conditioned', 'UPS Battery Backup', 'CCTV Surveillance'],
    status: 'Exam Ready',
    notes: 'Configured for high-concurrency CBT examinations.',
  })

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      labName: '',
      labCode: generateLabCode(),
      roomFloor: '1st Floor, Block A',
      centerName: 'Main Examination Hall',
      seatingCapacity: 80,
      totalComputers: 80,
      assignedSupervisor: staffList[0]?.name || 'Lead Invigilator',
      facilities: [
        'Air Conditioned',
        'UPS Battery Backup',
        'CCTV Surveillance',
        'Gigabit LAN Network',
      ],
      status: 'Exam Ready',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (lab: CenterLab) => {
    setEditingId(lab.id)
    setFormData({
      labName: lab.labName,
      labCode: lab.labCode,
      roomFloor: lab.roomFloor,
      centerName: lab.centerName,
      seatingCapacity: lab.seatingCapacity,
      totalComputers: lab.totalComputers,
      assignedSupervisor: lab.assignedSupervisor,
      facilities: [...(lab.facilities || [])],
      status: lab.status,
      notes: lab.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.labName.trim()) return

    if (editingId) {
      await updateLab(editingId, formData)
    } else {
      await addLab(formData, id)
    }
    setIsModalOpen(false)
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility)
      const newFacilities = exists
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility]
      return { ...prev, facilities: newFacilities }
    })
  }

  const filteredLabs = labsList.filter((lab) => {
    const matchesSearch =
      lab.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.labCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.assignedSupervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.roomFloor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || lab.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalCapacity = labsList.reduce((acc, curr) => acc + (Number(curr.seatingCapacity) || 0), 0)
  const totalReadyLabs = labsList.filter((l) => l.status === 'Exam Ready').length

  return (
    <div className='min-h-screen bg-background text-foreground p-6 space-y-6 animate-in fade-in duration-300'>
      {/* Header Banner */}
      <div className="flex items-stretch gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="h-auto px-4 bg-card hover:bg-muted border border-border shadow-xl rounded-xl shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className='flex-1 bg-card text-primary rounded-xl p-6 shadow-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='p-3 bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 rounded-xl mt-1'>
              <Monitor className='w-8 h-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold tracking-tight text-foreground flex items-center gap-2'>
                Center Lab & Class Details
              </h1>
              <p className='text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed font-medium'>
                Configure examination computer labs, classroom seating capacities, network hardware,
                and assign invigilation supervisors dynamically.
              </p>
            </div>
          </div>
          {!isReadOnly && (
            <Button
              onClick={handleOpenCreate}
              className='bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] hover:text-[#2D3E2C] font-bold text-sm px-5 py-3 rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2 shrink-0'
            >
              <PlusCircle className='w-5 h-5' /> Add Lab / Class Detail
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard
          title="Total Exam Labs"
          value={labsList.length}
          icon={Monitor}
          accent="slate"
        />
        <StatCard
          title="Total Seating Capacity"
          value={totalCapacity.toLocaleString()}
          icon={Users}
          accent="slate"
        />
        <StatCard
          title="Ready For Exams"
          value={`${totalReadyLabs}`}
          icon={CheckCircle2}
          accent="slate"
        />
        <StatCard
          title="Under Maintenance"
          value={labsList.filter((l) => l.status === 'Under Maintenance').length}
          icon={Wrench}
          accent="amber"
        />
      </div>

      {/* Filter and Search Bar */}
      {labsList.length > 0 && (
        <div className='bg-background/60 p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='relative flex-1 w-full max-w-md'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search Lab name, code, supervisor...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-background text-foreground pl-9 pr-4 py-2 text-sm rounded-lg border border-border focus:outline-none focus:border-[#E4FD97]'
            />
          </div>

          <div className='flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0'>
            <div className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground font-medium'>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='bg-background text-foreground px-3 py-1.5 rounded border border-border font-semibold focus:outline-none focus:border-[#E4FD97]'
              >
                <option value='All'>All Statuses</option>
                <option value='Exam Ready'>Exam Ready</option>
                <option value='Under Maintenance'>Under Maintenance</option>
                <option value='Reserved'>Reserved</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Labs Roster */}
      {filteredLabs.length === 0 ? (
        <Card className='bg-background/50 border-border/80 backdrop-blur-md'>
          <CardContent className='p-12 text-center flex flex-col items-center justify-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-muted/80 border border-border flex items-center justify-center text-muted-foreground mb-2'>
              <Monitor className='w-8 h-8 text-primary' />
            </div>
            <h3 className='text-xl font-bold text-foreground'>No Examination Labs Configured Yet</h3>
            <p className='text-muted-foreground text-sm max-w-lg leading-relaxed'>
              Click the <span className='text-primary font-semibold'>Add Lab / Class Detail</span>{' '}
              button above to dynamically set up digital assessment labs, configure workstation
              seating capacities, verify backup hardware, and assign invigilating supervisors.
            </p>
            {!isReadOnly && (
              <Button
                onClick={handleOpenCreate}
                className='mt-2 bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-bold px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs'
              >
                <PlusCircle className='w-4 h-4' /> Initialize First Exam Lab
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredLabs.map((lab) => (
            <Card
              key={lab.id}
              className='bg-background/90 border-border hover:border-border transition-all shadow-xl flex flex-col justify-between overflow-hidden'
            >
              <div>
                <div className='bg-background p-4 border-b border-border flex justify-between items-center'>
                  <span className='text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20'>
                    {lab.labCode}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${
                      lab.status === 'Exam Ready'
                        ? 'bg-[#2D3E2C] text-[#E4FD97] border-[#2D3E2C]/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {lab.status === 'Exam Ready' ? (
                      <CheckCircle2 className='w-3.5 h-3.5' />
                    ) : (
                      <Wrench className='w-3.5 h-3.5' />
                    )}
                    {lab.status}
                  </span>
                </div>

                <div className='p-5 space-y-4'>
                  <div>
                    <h3 className='text-lg font-bold text-foreground'>{lab.labName}</h3>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1.5 font-medium'>
                      <Building2 className='w-3.5 h-3.5' /> {lab.centerName}
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1 font-medium'>
                      <MapPin className='w-3.5 h-3.5 text-rose-400' /> Room / Location:{' '}
                      <span className='text-foreground/80 font-bold'>{lab.roomFloor}</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 pt-2'>
                    <div className='bg-background p-3 rounded-lg border border-border'>
                      <div className='flex items-center gap-2 text-primary mb-1'>
                        <Users className='w-4 h-4' />
                        <span className='text-[10px] font-bold uppercase tracking-wider'>
                          Seating Capacity
                        </span>
                      </div>
                      <div className='text-xl font-bold text-foreground'>
                        {lab.seatingCapacity}{' '}
                        <span className='text-xs text-muted-foreground font-medium'>Seats</span>
                      </div>
                    </div>
                    <div className='bg-background p-3 rounded-lg border border-border'>
                      <div className='flex items-center gap-2 text-primary mb-1'>
                        <span className='text-[10px] font-bold uppercase tracking-wider'>
                          Total PC
                        </span>
                      </div>
                      <div className='text-xl font-bold text-foreground'>
                        {lab.totalComputers}{' '}
                        <span className='text-xs text-muted-foreground font-medium'>PCs</span>
                      </div>
                    </div>
                  </div>

                  <div className='pt-2'>
                    <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2'>
                      Lab Facilities & Specs:
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {lab.facilities?.slice(0, 4).map((fac, idx) => (
                        <span
                          key={idx}
                          className='bg-muted text-foreground/80 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1'
                        >
                          <CheckCircle2 className='w-3 h-3 text-primary' /> {fac}
                        </span>
                      ))}
                      {(lab.facilities?.length || 0) > 4 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className='bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground text-[10px] font-bold px-2 py-1 rounded transition-colors'>
                              +{(lab.facilities?.length || 0) - 4} more
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-3' side='top'>
                            <div className='flex flex-col gap-2'>
                              <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                                Additional Facilities
                              </p>
                              <div className='flex flex-col gap-1.5'>
                                {lab.facilities?.slice(4).map((fac, idx) => (
                                  <span
                                    key={idx}
                                    className='text-foreground/80 text-[10px] font-bold flex items-center gap-1.5'
                                  >
                                    <CheckCircle2 className='w-3 h-3 text-primary' /> {fac}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>

                  <div className='pt-2 flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground font-medium'>Assigned Supervisor:</span>
                    <span className='text-xs font-bold text-[#2D3E2C] bg-[#E4FD97] px-2.5 py-1 rounded flex items-center gap-1.5 border border-[#2D3E2C]/20'>
                      <UserCheck className='w-3.5 h-3.5' /> {lab.assignedSupervisor}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-background/80 p-3 border-t border-border flex justify-between items-center text-xs'>
                <span className='text-muted-foreground font-mono'>ID: {lab.id}</span>
                <div className='flex gap-2'>
                  {!isReadOnly && (
                    <>
                      <Button
                        onClick={() => handleOpenEdit(lab)}
                        variant='outline'
                        size='sm'
                        className='h-7 w-7 p-0 bg-muted border-border text-foreground/80 hover:bg-muted/80'
                      >
                        <Edit3 className='w-3.5 h-3.5' />
                      </Button>
                      <Button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${lab.labName}?`)) {
                            deleteLab(lab.id)
                          }
                        }}
                        size='sm'
                        className='h-7 w-7 p-0 bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'>
          <Card className='bg-background border-border w-full max-w-3xl text-foreground shadow-2xl max-h-[90vh] flex flex-col'>
            <div className='p-5 border-b border-border flex justify-between items-center bg-background rounded-t-xl'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-primary/10 text-primary rounded-xl border border-border'>
                  <Monitor className='w-5 h-5' />
                </div>
                <h2 className='text-xl font-bold text-foreground'>
                  {editingId ? 'Update Exam Lab Details' : 'Configure New Exam Lab / Class'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-muted-foreground hover:text-foreground font-light text-2xl px-2 py-0.5 rounded transition-colors'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className='p-6 overflow-y-auto flex-1 space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Lab / Classroom Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.labName}
                    onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                    placeholder='e.g. Lab A - High Performance Wing'
                    className='w-full bg-background text-foreground px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none transition-colors'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Unique Lab Code
                  </label>
                  <input
                    type='text'
                    value={formData.labCode}
                    onChange={(e) => setFormData({ ...formData, labCode: e.target.value })}
                    className='w-full bg-background text-foreground font-mono font-bold px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Building Venue / Exam Hall Name
                  </label>
                  <input
                    type='text'
                    value={formData.centerName}
                    onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                    className='w-full bg-background text-foreground px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Room / Floor Location
                  </label>
                  <input
                    type='text'
                    value={formData.roomFloor}
                    onChange={(e) => setFormData({ ...formData, roomFloor: e.target.value })}
                    placeholder='1st Floor, Block A'
                    className='w-full bg-background text-foreground px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Seating Capacity
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.seatingCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingCapacity: Number(e.target.value) })
                    }
                    className='w-full bg-background text-foreground font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Total PC
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.totalComputers}
                    onChange={(e) =>
                      setFormData({ ...formData, totalComputers: Number(e.target.value) })
                    }
                    className='w-full bg-background text-foreground font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                    Readiness Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className='w-full bg-background text-foreground font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none'
                  >
                    <option value='Exam Ready'>Exam Ready</option>
                    <option value='Under Maintenance'>Under Maintenance</option>
                    <option value='Reserved'>Reserved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='text-xs font-bold text-foreground/80 block mb-3'>
                  Select Verified Lab Infrastructure & Facilities
                </label>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {LAB_FACILITIES_OPTIONS.map((fac) => {
                    const isSelected = formData.facilities.includes(fac)
                    return (
                      <button
                        type='button'
                        key={fac}
                        onClick={() => handleFacilityToggle(fac)}
                        className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-start ${
                          isSelected
                            ? 'bg-[#E4FD97]/10 border-[#E4FD97]/40 text-primary shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:border-border'
                        }`}
                      >
                        <span className='pr-2'>{fac}</span>
                        {isSelected ? (
                          <CheckCircle2 className='w-3.5 h-3.5 text-primary shrink-0 mt-0.5' />
                        ) : (
                          <span className='text-slate-600 font-bold'>+</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className='text-xs font-bold text-foreground/80 block mb-1.5'>
                  Operational Notes / Remarks (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder='e.g. Primary test node equipped with dual redundant power supplies.'
                  rows={3}
                  className='w-full bg-background text-foreground px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-[#E4FD97] focus:outline-none resize-y'
                />
              </div>

              <div className='pt-4 border-t border-border flex justify-end gap-3 bg-background sticky bottom-0 -mx-6 px-6 pb-2 mt-4'>
                <Button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground/80 font-bold px-6 py-2.5 rounded-lg text-xs transition-colors'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-bold px-6 py-2.5 rounded-lg text-xs shadow-lg'
                >
                  {editingId ? 'Save Configuration' : 'Confirm & Save Lab Details'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CenterLabDetailsPage

