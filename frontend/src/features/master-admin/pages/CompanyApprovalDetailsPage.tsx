import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useCompany,
  useApproveCompany,
  useRejectCompany,
  useAssignReviewer,
} from '../hooks/company.hooks'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useConfirm } from '@/providers/ConfirmProvider'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  User,
  Phone,
  Mail,
  FileCheck,
} from 'lucide-react'
import { RejectionDialog } from '../components/company/RejectionDialog'

export const CompanyApprovalDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const confirm = useConfirm()

  const { data: response, isLoading, isError } = useCompany(id!)
  const company = response?.data

  const { mutateAsync: approveCompany, isPending: isApproving } = useApproveCompany()
  const { mutateAsync: rejectCompany, isPending: isRejecting } = useRejectCompany()
  const { mutateAsync: assignReviewer, isPending: isAssigning } = useAssignReviewer()

  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const [docVerification, setDocVerification] = useState<{ [key: string]: boolean | null }>({
    registration: null,
    pan: null,
    gst: null,
    mou: null,
  })

  const [docViewed, setDocViewed] = useState<{ [key: string]: boolean }>({
    registration: false,
    pan: false,
    gst: false,
    mou: false,
  })

  const handlePreview = (docType: string, url: string | undefined) => {
    if (!url) return;
    setDocViewed(prev => ({ ...prev, [docType]: true }));
    window.open(url.split('#')[0], '_blank');
  }

  if (isLoading) return <div className='p-8 text-center'>Loading company details...</div>
  if (isError || !company)
    return <div className='p-8 text-center text-red-500'>Failed to load company details.</div>

  const handleApprove = async () => {
    if (
      await confirm(
        'Are you sure you want to approve and activate this company? They will receive login credentials via email.',
      )
    ) {
      await approveCompany(company._id)
      navigate('/master-admin/company-approvals')
    }
  }

  const handleRejectSubmit = async (reason: string, remarks: string) => {
    await rejectCompany({ id: company._id, reason, remarks })
    setIsRejectionDialogOpen(false)
    navigate('/master-admin/company-approvals')
  }

  const handleAssignToMe = async () => {
    // In a real app, pass the current admin's ID
    await assignReviewer({ id: company._id, reviewerId: 'CURRENT_ADMIN_ID' })
  }

  const handleDocVerification = (doc: string, status: boolean) => {
    setDocVerification(prev => ({ ...prev, [doc]: status }))
  }

  const allDocumentsAccepted = 
    (company.registrationDocument ? docVerification.registration === true : false) &&
    (company.panCardDocument ? docVerification.pan === true : false) &&
    (company.gstDocument ? docVerification.gst === true : false) &&
    (company.mouDocument ? docVerification.mou === true : false);

  return (
    <div className='max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => navigate('/master-admin/company-approvals')}
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{company.companyName}</h1>
          <div className='text-muted-foreground mt-1 flex items-center gap-2'>
            {company.companyCode}
            <Badge variant='outline'>{company.approvalStatus || 'PENDING'}</Badge>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building2 className='w-5 h-5 text-primary' /> Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-slate-500'>Legal Name</p>
                <p className='mt-1'>{company.legalName || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Business Type</p>
                <p className='mt-1'>{company.companyType || 'Enterprise'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Registration Number</p>
                <p className='mt-1'>{company.registrationNumber || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>GST Number</p>
                <p className='mt-1'>{company.gstNumber || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>PAN Number</p>
                <p className='mt-1'>{company.panNumber || 'N/A'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Address</p>
                <p className='mt-1'>
                  {[company.address, company.city, company.state, company.pincode]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='w-5 h-5 text-primary' /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-slate-500'>Owner Name</p>
                <p className='mt-1 flex items-center gap-2'>
                  <User className='w-4 h-4 text-slate-400' /> {company.ownerName}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Email Address</p>
                <p className='mt-1 flex items-center gap-2'>
                  <Mail className='w-4 h-4 text-slate-400' /> {company.email}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Phone Number</p>
                <p className='mt-1 flex items-center gap-2'>
                  <Phone className='w-4 h-4 text-slate-400' /> {company.phone}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>Website</p>
                <p className='mt-1'>{company.website || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5 text-primary' /> Uploaded Documents
              </CardTitle>
              <CardDescription>Review documents to verify business authenticity.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Registration Document */}
              <div className={`flex items-center justify-between p-4 border dark:border-slate-800 rounded-md transition-colors ${docVerification.registration === true ? 'bg-[#E4FD97]/10 border-[#2D3E2C] dark:border-[#E4FD97]' : docVerification.registration === false ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''}`}>
                <div className='flex items-center gap-3'>
                  <FileText className='w-8 h-8 text-slate-400' />
                  <div>
                    <p className='font-medium'>Company Registration</p>
                    <p className='text-xs text-slate-500'>
                      {company.registrationDocument ? 'Uploaded' : 'Not Provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]' disabled={!company.registrationDocument} onClick={() => handlePreview('registration', company.registrationDocument)}>
                    Preview
                  </Button>
                  {company.registrationDocument && (
                    <>
                      <Button variant='outline' size='sm' className={`transition-colors border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] ${docVerification.registration === true ? 'bg-[#2D3E2C] text-[#E4FD97] dark:bg-[#E4FD97] dark:text-[#2D3E2C]' : 'text-[#2D3E2C] dark:text-[#E4FD97]'}`} disabled={!docViewed.registration} onClick={() => handleDocVerification('registration', true)}>Accept</Button>
                      <Button variant={docVerification.registration === false ? 'destructive' : 'outline'} size='sm' className={docVerification.registration === false ? '' : 'transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-red-600 hover:text-white dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 dark:hover:border-red-600'} disabled={!docViewed.registration} onClick={() => handleDocVerification('registration', false)}>Reject</Button>
                    </>
                  )}
                </div>
              </div>

              {/* PAN Card */}
              <div className={`flex items-center justify-between p-4 border dark:border-slate-800 rounded-md transition-colors ${docVerification.pan === true ? 'bg-[#E4FD97]/10 border-[#2D3E2C] dark:border-[#E4FD97]' : docVerification.pan === false ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''}`}>
                <div className='flex items-center gap-3'>
                  <FileText className='w-8 h-8 text-slate-400' />
                  <div>
                    <p className='font-medium'>PAN Card</p>
                    <p className='text-xs text-slate-500'>
                      {company.panCardDocument ? 'Uploaded' : 'Not Provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]' disabled={!company.panCardDocument} onClick={() => handlePreview('pan', company.panCardDocument)}>
                    Preview
                  </Button>
                  {company.panCardDocument && (
                    <>
                      <Button variant='outline' size='sm' className={`transition-colors border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] ${docVerification.pan === true ? 'bg-[#2D3E2C] text-[#E4FD97] dark:bg-[#E4FD97] dark:text-[#2D3E2C]' : 'text-[#2D3E2C] dark:text-[#E4FD97]'}`} disabled={!docViewed.pan} onClick={() => handleDocVerification('pan', true)}>Accept</Button>
                      <Button variant={docVerification.pan === false ? 'destructive' : 'outline'} size='sm' className={docVerification.pan === false ? '' : 'transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-red-600 hover:text-white dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 dark:hover:border-red-600'} disabled={!docViewed.pan} onClick={() => handleDocVerification('pan', false)}>Reject</Button>
                    </>
                  )}
                </div>
              </div>

              {/* GST Certificate */}
              <div className={`flex items-center justify-between p-4 border dark:border-slate-800 rounded-md transition-colors ${docVerification.gst === true ? 'bg-[#E4FD97]/10 border-[#2D3E2C] dark:border-[#E4FD97]' : docVerification.gst === false ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''}`}>
                <div className='flex items-center gap-3'>
                  <FileText className='w-8 h-8 text-slate-400' />
                  <div>
                    <p className='font-medium'>GST Certificate</p>
                    <p className='text-xs text-slate-500'>
                      {company.gstDocument ? 'Uploaded' : 'Not Provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]' disabled={!company.gstDocument} onClick={() => handlePreview('gst', company.gstDocument)}>
                    Preview
                  </Button>
                  {company.gstDocument && (
                    <>
                      <Button variant='outline' size='sm' className={`transition-colors border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] ${docVerification.gst === true ? 'bg-[#2D3E2C] text-[#E4FD97] dark:bg-[#E4FD97] dark:text-[#2D3E2C]' : 'text-[#2D3E2C] dark:text-[#E4FD97]'}`} disabled={!docViewed.gst} onClick={() => handleDocVerification('gst', true)}>Accept</Button>
                      <Button variant={docVerification.gst === false ? 'destructive' : 'outline'} size='sm' className={docVerification.gst === false ? '' : 'transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-red-600 hover:text-white dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 dark:hover:border-red-600'} disabled={!docViewed.gst} onClick={() => handleDocVerification('gst', false)}>Reject</Button>
                    </>
                  )}
                </div>
              </div>

              {/* MOU Document */}
              <div className={`flex items-center justify-between p-4 border dark:border-slate-800 rounded-md transition-colors ${docVerification.mou === true ? 'bg-[#E4FD97]/10 border-[#2D3E2C] dark:border-[#E4FD97]' : docVerification.mou === false ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''}`}>
                <div className='flex items-center gap-3'>
                  <FileText className='w-8 h-8 text-slate-400' />
                  <div>
                    <p className='font-medium'>MOU Document</p>
                    <p className='text-xs text-slate-500'>
                      {company.mouDocument ? 'Uploaded' : 'Not Provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]' disabled={!company.mouDocument} onClick={() => handlePreview('mou', company.mouDocument)}>
                    Preview
                  </Button>
                  {company.mouDocument && (
                    <>
                      <Button variant='outline' size='sm' className={`transition-colors border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] ${docVerification.mou === true ? 'bg-[#2D3E2C] text-[#E4FD97] dark:bg-[#E4FD97] dark:text-[#2D3E2C]' : 'text-[#2D3E2C] dark:text-[#E4FD97]'}`} disabled={!docViewed.mou} onClick={() => handleDocVerification('mou', true)}>Accept</Button>
                      <Button variant={docVerification.mou === false ? 'destructive' : 'outline'} size='sm' className={docVerification.mou === false ? '' : 'transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-red-600 hover:text-white dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 dark:hover:border-red-600'} disabled={!docViewed.mou} onClick={() => handleDocVerification('mou', false)}>Reject</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader className='bg-slate-50 dark:bg-slate-800/40 border-b dark:border-slate-800'>
              <CardTitle>Approval Actions</CardTitle>
            </CardHeader>
            <CardContent className='pt-6 space-y-4'>
              {(company.approvalStatus === 'PENDING' ||
                company.approvalStatus === 'UNDER_REVIEW') && (
                <>
                  <Button
                    variant='outline'
                    className='w-full justify-center transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]'
                    onClick={handleApprove}
                    disabled={isApproving || !allDocumentsAccepted}
                  >
                    <CheckCircle className='w-4 h-4 mr-2' /> Approve & Activate
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-center transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#E4FD97] dark:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]'
                    onClick={() => setIsRejectionDialogOpen(true)}
                    disabled={isRejecting}
                  >
                    <XCircle className='w-4 h-4 mr-2' /> Reject Company
                  </Button>
                </>
              )}

              {company.approvalStatus === 'APPROVED' && (
                <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-md text-green-800 dark:text-green-400 text-sm text-center font-medium'>
                  Company was approved on {new Date(company.approvedAt || '').toLocaleDateString()}
                </div>
              )}

              {company.approvalStatus === 'REJECTED' && (
                <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md text-red-800 dark:text-red-400 text-sm'>
                  <p className='font-semibold text-center mb-2'>
                    Rejected on {new Date(company.rejectedAt || '').toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Reason:</strong> {company.rejectionReason}
                  </p>
                  <p>
                    <strong>Remarks:</strong> {company.rejectionRemarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Request</CardTitle>
            </CardHeader>
            <CardContent>
              {company.paymentStatus === 'SUCCESS' ? (
                <div className='p-4 bg-slate-50 dark:bg-slate-800/40 rounded-md border dark:border-slate-800 text-center'>
                  <Badge variant='default' className='text-lg px-4 py-1 mb-2'>
                    {company.subscriptionPlan}
                  </Badge>
                  <p className='text-sm text-slate-500'>Max Centers: {company.maxCenters}</p>
                  <p className='text-sm text-slate-500'>Max Branches: {company.maxBranches}</p>
                </div>
              ) : (
                <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-md text-orange-800 dark:text-orange-400 text-sm text-center font-medium'>
                  In Progress (Awaiting Subscription)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RejectionDialog
        isOpen={isRejectionDialogOpen}
        onClose={() => setIsRejectionDialogOpen(false)}
        onSubmit={handleRejectSubmit}
        companyName={company.companyName}
      />
    </div>
  )
}
