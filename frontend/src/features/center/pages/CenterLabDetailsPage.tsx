import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { useCenterLabStore, type CenterLab } from '../store/useCenterLabStore'
import { useCenterStaffStore } from '../store/useCenterStaffStore'
import { Card, CardContent } from '@/shared/components/ui/card'
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
  Cpu,
  Building2,
  Filter,
  Wrench,
  Info,
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
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER' && user?.role !== 'COMPANY_ADMIN';

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
    <div className='min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 animate-in fade-in duration-300'>
      {/* Header Banner */}
      <div className='bg-[#2D3E2C] text-[#E4FD97] rounded-xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <div className='p-3 bg-[#E4FD97]/15 rounded-xl border border-[#E4FD97]/30 text-[#E4FD97] mt-1'>
            <Monitor className='w-8 h-8' />
          </div>
          <div>
            <h1 className='text-2xl font-black tracking-tight text-white flex items-center gap-2'>
              Center Lab & Class Details
            </h1>
            <p className='text-sm text-[#E4FD97]/90 mt-1 max-w-2xl leading-relaxed font-medium'>
              Configure examination computer labs, classroom seating capacities, network hardware,
              and assign invigilation supervisors dynamically.
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <Button
            onClick={handleOpenCreate}
            className='bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] hover:text-[#2D3E2C] font-black text-sm px-5 py-3 rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2 shrink-0'
          >
            <PlusCircle className='w-5 h-5' /> Add Lab / Class Detail
          </Button>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg'>
          <CardContent className='p-5 flex justify-between items-center'>
            <div>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                Total Exam Labs
              </p>
              <p className='text-3xl font-black text-white mt-1'>{labsList.length}</p>
            </div>
            <div className='p-3 bg-[#E4FD97]/10 text-[#E4FD97] rounded-xl border border-[#E4FD97]/20'>
              <Monitor className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg'>
          <CardContent className='p-5 flex justify-between items-center'>
            <div>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                Total Seating Capacity
              </p>
              <p className='text-3xl font-black text-emerald-400 mt-1'>
                {totalCapacity.toLocaleString()}
              </p>
            </div>
            <div className='p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20'>
              <Users className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg'>
          <CardContent className='p-5 flex justify-between items-center'>
            <div>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                Ready For Exams
              </p>
              <p className='text-3xl font-black text-emerald-400 mt-1'>{totalReadyLabs} Labs</p>
            </div>
            <div className='p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20'>
              <CheckCircle2 className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg'>
          <CardContent className='p-5 flex justify-between items-center'>
            <div>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                Under Maintenance
              </p>
              <p className='text-3xl font-black text-amber-400 mt-1'>
                {labsList.filter((l) => l.status === 'Under Maintenance').length}
              </p>
            </div>
            <div className='p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20'>
              <Wrench className='w-6 h-6' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      {labsList.length > 0 && (
        <div className='bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='relative flex-1 w-full max-w-md'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
            <input
              type='text'
              placeholder='Search Lab name, code, supervisor...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-slate-950 text-white pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-[#E4FD97]'
            />
          </div>

          <div className='flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0'>
            <div className='flex items-center gap-2 text-xs'>
              <span className='text-slate-400 font-medium'>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='bg-slate-950 text-white px-3 py-1.5 rounded border border-slate-700 font-semibold focus:outline-none focus:border-[#E4FD97]'
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
        <Card className='bg-slate-900/50 border-slate-800/80 backdrop-blur-md'>
          <CardContent className='p-12 text-center flex flex-col items-center justify-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2'>
              <Monitor className='w-8 h-8 text-[#E4FD97]' />
            </div>
            <h3 className='text-xl font-bold text-white'>No Examination Labs Configured Yet</h3>
            <p className='text-slate-400 text-sm max-w-lg leading-relaxed'>
              Click the <span className='text-[#E4FD97] font-semibold'>Add Lab / Class Detail</span>{' '}
              button above to dynamically set up digital assessment labs, configure workstation
              seating capacities, verify backup hardware, and assign invigilating supervisors.
            </p>
            {!isReadOnly && (
              <Button
                onClick={handleOpenCreate}
                className='mt-2 bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs'
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
              className='bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between overflow-hidden'
            >
              <div>
                <div className='bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center'>
                  <span className='text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#E4FD97]/15 text-[#E4FD97] border border-[#E4FD97]/30'>
                    {lab.labCode}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      lab.status === 'Exam Ready'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
                    <h3 className='text-lg font-black text-white'>{lab.labName}</h3>
                    <div className='flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-medium'>
                      <Building2 className='w-3.5 h-3.5' /> {lab.centerName}
                    </div>
                    <div className='flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium'>
                      <MapPin className='w-3.5 h-3.5 text-rose-400' /> Room / Location:{' '}
                      <span className='text-slate-300 font-bold'>{lab.roomFloor}</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 pt-2'>
                    <div className='bg-slate-950 p-3 rounded-lg border border-slate-800'>
                      <div className='flex items-center gap-2 text-[#E4FD97] mb-1'>
                        <Users className='w-4 h-4' />
                        <span className='text-[10px] font-black uppercase tracking-wider'>
                          Seating Capacity
                        </span>
                      </div>
                      <div className='text-xl font-black text-white'>
                        {lab.seatingCapacity}{' '}
                        <span className='text-xs text-slate-500 font-medium'>Seats</span>
                      </div>
                    </div>
                    <div className='bg-slate-950 p-3 rounded-lg border border-slate-800'>
                      <div className='flex items-center gap-2 text-[#E4FD97] mb-1'>
                        <Cpu className='w-4 h-4' />
                        <span className='text-[10px] font-black uppercase tracking-wider'>
                          Workstations
                        </span>
                      </div>
                      <div className='text-xl font-black text-white'>
                        {lab.totalComputers}{' '}
                        <span className='text-xs text-slate-500 font-medium'>PCs</span>
                      </div>
                    </div>
                  </div>

                  <div className='pt-2'>
                    <p className='text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2'>
                      Lab Facilities & Specs:
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {lab.facilities?.slice(0, 4).map((fac, idx) => (
                        <span
                          key={idx}
                          className='bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1'
                        >
                          <CheckCircle2 className='w-3 h-3 text-emerald-400' /> {fac}
                        </span>
                      ))}
                      {(lab.facilities?.length || 0) > 4 && (
                        <span className='bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded'>
                          +{(lab.facilities?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='pt-2 flex items-center justify-between'>
                    <span className='text-xs text-slate-400 font-medium'>Assigned Supervisor:</span>
                    <span className='text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded flex items-center gap-1.5 border border-emerald-500/20'>
                      <UserCheck className='w-3.5 h-3.5' /> {lab.assignedSupervisor}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-slate-950/80 p-3 border-t border-slate-800 flex justify-between items-center text-xs'>
                <span className='text-slate-500 font-mono'>ID: {lab.id}</span>
                <div className='flex gap-2'>
                  {!isReadOnly && (
                    <>
                      <Button
                        onClick={() => handleOpenEdit(lab)}
                        variant='outline'
                        size='sm'
                        className='h-7 w-7 p-0 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
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
                        className='h-7 w-7 p-0 bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
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
        <div className='fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'>
          <Card className='bg-slate-900 border-slate-800 w-full max-w-3xl text-slate-100 shadow-2xl max-h-[90vh] flex flex-col'>
            <div className='p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-xl'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-[#E4FD97]/15 text-[#E4FD97] rounded-xl border border-[#E4FD97]/30'>
                  <Monitor className='w-5 h-5' />
                </div>
                <h2 className='text-xl font-black text-white'>
                  {editingId ? 'Update Exam Lab Details' : 'Configure New Exam Lab / Class'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-slate-400 hover:text-white font-light text-2xl px-2 py-0.5 rounded transition-colors'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className='p-6 overflow-y-auto flex-1 space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Lab / Classroom Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.labName}
                    onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                    placeholder='e.g. Lab A - High Performance Wing'
                    className='w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none transition-colors'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Unique Lab Code
                  </label>
                  <input
                    type='text'
                    value={formData.labCode}
                    onChange={(e) => setFormData({ ...formData, labCode: e.target.value })}
                    className='w-full bg-slate-950 text-white font-mono font-bold px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Building Venue / Exam Hall Name
                  </label>
                  <input
                    type='text'
                    value={formData.centerName}
                    onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                    className='w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Room / Floor Location
                  </label>
                  <input
                    type='text'
                    value={formData.roomFloor}
                    onChange={(e) => setFormData({ ...formData, roomFloor: e.target.value })}
                    placeholder='1st Floor, Block A'
                    className='w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Seating Capacity
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.seatingCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingCapacity: Number(e.target.value) })
                    }
                    className='w-full bg-slate-950 text-white font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Total PC Workstations
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.totalComputers}
                    onChange={(e) =>
                      setFormData({ ...formData, totalComputers: Number(e.target.value) })
                    }
                    className='w-full bg-slate-950 text-white font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  />
                </div>
                <div>
                  <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                    Readiness Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className='w-full bg-slate-950 text-white font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none'
                  >
                    <option value='Exam Ready'>Exam Ready</option>
                    <option value='Under Maintenance'>Under Maintenance</option>
                    <option value='Reserved'>Reserved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='text-xs font-bold text-slate-300 block mb-3'>
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
                            ? 'bg-[#E4FD97]/10 border-[#E4FD97]/40 text-[#E4FD97] shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className='pr-2'>{fac}</span>
                        {isSelected ? (
                          <CheckCircle2 className='w-3.5 h-3.5 text-[#E4FD97] shrink-0 mt-0.5' />
                        ) : (
                          <span className='text-slate-600 font-bold'>+</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className='text-xs font-bold text-slate-300 block mb-1.5'>
                  Operational Notes / Remarks (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder='e.g. Primary test node equipped with dual redundant power supplies.'
                  rows={3}
                  className='w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none resize-y'
                />
              </div>

              <div className='pt-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900 sticky bottom-0 -mx-6 px-6 pb-2 mt-4'>
                <Button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-2.5 rounded-lg text-xs'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black px-6 py-2.5 rounded-lg text-xs shadow-lg'
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
