import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { useCompanies, useUpdateCompanyStatus, useDeleteCompany } from '../hooks/company.hooks'
import { usePlans } from '../hooks/plan.hooks'
import type { TableColumn } from '@/shared/types'
import type { Company } from '../types/company.types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Eye,
  Download,
  CheckSquare,
  Building2,
} from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { useConfirm } from '@/providers/ConfirmProvider'

export const CompaniesPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const confirm = useConfirm()

  // Table State
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    data: companiesResponse,
    isLoading,
    isError,
    refetch,
  } = useCompanies({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter === 'active',
    subscriptionPlan: planFilter === 'all' ? undefined : (planFilter as any),
    paymentStatus: 'SUCCESS',
  })

  const { data: plansResponse } = usePlans({ limit: 100 })
  const plansList = plansResponse?.data || []

  const { mutateAsync: updateStatus } = useUpdateCompanyStatus()
  const { mutateAsync: deleteCompany } = useDeleteCompany()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPageIndex(0)
  }

  const handleToggleStatus = async (company: Company) => {
    if (
      await confirm(
        `Are you sure you want to ${company.status ? 'deactivate' : 'activate'} ${
          company.companyName
        }?`,
      )
    ) {
      await updateStatus({ id: company._id, status: !company.status })
    }
  }

  const handleDelete = async (company: Company) => {
    if (
      await confirm(
        `Are you sure you want to delete ${company.companyName}? This action cannot be undone.`,
      )
    ) {
      await deleteCompany(company._id)
    }
  }

  // Selection Logic
  const handleToggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleAll = () => {
    if (!companiesResponse?.data) return
    if (selectedIds.size === companiesResponse.data.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(companiesResponse.data.map((c) => c._id)))
    }
  }

  const isAllSelected =
    companiesResponse?.data &&
    companiesResponse.data.length > 0 &&
    selectedIds.size === companiesResponse.data.length
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (await confirm(`Are you sure you want to delete ${selectedIds.size} companies?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map((id) => deleteCompany(id)))
        toast({ title: 'Success', description: 'Companies deleted successfully.' })
        setSelectedIds(new Set())
        refetch()
      } catch (err) {
        console.error(err)
        toast({
          title: 'Error',
          description: 'Failed to delete some companies.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleBulkStatus = async (status: boolean) => {
    if (
      await confirm(
        `Are you sure you want to ${status ? 'activate' : 'deactivate'} ${
          selectedIds.size
        } companies?`,
      )
    ) {
      try {
        await Promise.all(Array.from(selectedIds).map((id) => updateStatus({ id, status })))
        toast({
          title: 'Success',
          description: `Companies ${status ? 'activated' : 'deactivated'} successfully.`,
        })
        setSelectedIds(new Set())
        refetch()
      } catch (err) {
        console.error(err)
        toast({
          title: 'Error',
          description: 'Failed to update status for some companies.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleExport = () => {
    if (!companiesResponse?.data || companiesResponse.data.length === 0) {
      toast({
        title: 'Export Failed',
        description: 'No data available to export.',
        variant: 'destructive',
      })
      return
    }

    const headers = [
      'Company Name',
      'Code',
      'Type',
      'Owner',
      'Email',
      'Phone',
      'Plan',

      'Max Centers',
      'Status',
      'Joined Date',
    ]
    const csvContent = [
      headers.join(','),
      ...companiesResponse.data.map((c) =>
        [
          `"${c.companyName}"`,
          `"${c.companyCode}"`,
          `"${c.companyType || 'Enterprise'}"`,
          `"${c.ownerName || 'N/A'}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          `"${c.subscriptionPlan || 'FREE'}"`,
          c.maxCenters,
          c.status ? 'Active' : 'Inactive',
          `"${new Date(c.createdAt).toLocaleDateString()}"`,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `companies_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: TableColumn<Company>[] = [
    {
      id: 'company',
      header: 'Company Details',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 flex items-center justify-center shrink-0 font-bold'>
            {row.companyName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <div
              className='font-semibold text-slate-900 cursor-pointer hover:underline'
              onClick={() => navigate(`/master-admin/companies/${row._id}`)}
            >
              {row.companyName || 'Unknown Company'}
            </div>
            <div className='text-xs text-slate-500 flex items-center gap-2'>
              <span>{row.companyCode}</span>
              <span className='w-1 h-1 rounded-full bg-slate-300' />
              <span>{row.companyType || 'Enterprise'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div>
          <div className='font-medium text-sm'>{row.ownerName || 'N/A'}</div>
          <div className='text-xs text-slate-500'>{row.email}</div>
          <div className='text-xs text-slate-500'>{row.phone}</div>
        </div>
      ),
    },
    {
      id: 'subscription',
      header: 'Subscription',
      cell: ({ row }) => {
        const isPending = row.paymentStatus === 'PENDING' || !row.subscriptionPlan

        return (
          <div>
            <Badge
              variant='outline'
              className={
                isPending
                  ? 'bg-amber-100 text-amber-800 border-amber-200 mb-1'
                  : row.subscriptionPlan === 'ENTERPRISE'
                  ? 'bg-[#2D3E2C] text-[#E4FD97] border-[#2D3E2C] mb-1'
                  : 'bg-slate-100 text-slate-800 mb-1'
              }
            >
              {isPending ? 'Pending' : row.subscriptionPlan || 'FREE'}
            </Badge>
            <div className='text-xs text-slate-500'>{row.maxCenters} Centers</div>
          </div>
        )
      },
    },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className='text-sm'>
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date(row.createdAt))}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={row.status ? 'outline' : 'destructive'}
          className={
            row.status ? 'bg-[#E4FD97] text-[#2D3E2C] border-0' : 'bg-red-100 text-red-800'
          }
        >
          {row.status ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={300}>
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full hover:bg-[#2D3E2C]/10 icon-bright-btn'
                  onClick={() => navigate(`/master-admin/companies/${row._id}`)}
                >
                  <Eye className='w-4 h-4 text-[#2D3E2C] icon-bright' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full hover:bg-[#4A5D4E]/10 icon-bright-btn'
                  onClick={() => navigate(`/master-admin/companies/${row._id}/edit`)}
                >
                  <Edit className='w-4 h-4 text-[#4A5D4E] icon-bright' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Company</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className={`h-8 w-8 rounded-full ${
                    row.status ? 'hover:bg-[#BEEF68]/10' : 'hover:bg-[#7B9B7B]/10'
                  } icon-bright-btn`}
                  onClick={() => handleToggleStatus(row)}
                >
                  {row.status ? (
                    <PowerOff className='w-4 h-4 text-[#BEEF68] icon-bright' />
                  ) : (
                    <Power className='w-4 h-4 text-[#7B9B7B] icon-bright' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.status ? 'Deactivate' : 'Activate'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full hover:bg-[#7B9B7B]/10 icon-bright-btn'
                  onClick={() => handleDelete(row)}
                >
                  <Trash2 className='w-4 h-4 text-[#7B9B7B] icon-bright' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ]

  return (
    <div className='max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Companies Management</h1>
          <p className='text-muted-foreground mt-2'>
            Manage registered companies, monitor statuses, and oversee subscriptions.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={handleExport}
            className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'
          >
            <Download className='w-4 h-4 mr-2' />
            Export
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate('/master-admin/companies/new')}
            className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Company
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className='pb-4 border-b border-slate-100'>
          <div className='flex flex-col md:flex-row justify-between gap-4'>
            {/* Filters */}
            <div className='flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto'>
              <form onSubmit={handleSearch} className='flex items-center gap-2 w-full sm:w-auto'>
                <div className='relative w-full sm:w-64'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search by name or code...'
                    className='pl-9 bg-muted border-border'
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      setSearch(e.target.value)
                      setPageIndex(0)
                    }}
                  />
                </div>
              </form>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val)
                  setPageIndex(0)
                }}
              >
                <SelectTrigger className='w-[140px] bg-muted border-border'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={planFilter}
                onValueChange={(val) => {
                  setPlanFilter(val)
                  setPageIndex(0)
                }}
              >
                <SelectTrigger className='w-[140px] bg-muted border-border'>
                  <SelectValue placeholder='Plan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Plans</SelectItem>
                  {plansList.map((plan) => (
                    <SelectItem key={plan._id} value={plan.planCode || plan.planName.toUpperCase()}>
                      {plan.planName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className='flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20'>
                <span className='text-sm text-primary font-medium flex items-center gap-1 mr-2'>
                  <CheckSquare className='w-4 h-4' /> {selectedIds.size} selected
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleBulkStatus(true)}
                  className='h-8 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'
                >
                  Activate
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleBulkStatus(false)}
                  className='h-8 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'
                >
                  Deactivate
                </Button>
                <Button variant='destructive' size='sm' onClick={handleBulkDelete} className='h-8'>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          {isError ? (
            <div className='p-8 text-center text-red-500 bg-red-50 rounded-lg'>
              Failed to load companies. Please try again.
            </div>
          ) : isLoading && !companiesResponse ? (
            <div className='space-y-4'>
              <div className='h-10 bg-muted animate-pulse rounded w-full'></div>
              <div className='h-12 bg-muted/50 animate-pulse rounded w-full'></div>
              <div className='h-12 bg-muted/50 animate-pulse rounded w-full'></div>
              <div className='h-12 bg-muted/50 animate-pulse rounded w-full'></div>
            </div>
          ) : (
            <>
              <GenericDataTable
                columns={columns}
                data={companiesResponse?.data || []}
                keyExtractor={(item) => item._id}
                enableSelection={true}
                selectedIds={selectedIds}
                onToggleSelection={handleToggleSelection}
                onToggleAll={handleToggleAll}
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
              />
              {companiesResponse?.pagination && (
                <div className='mt-4'>
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={companiesResponse.pagination.total}
                    onPageChange={setPageIndex}
                    onPageSizeChange={(size) => {
                      setPageSize(size)
                      setPageIndex(0)
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
