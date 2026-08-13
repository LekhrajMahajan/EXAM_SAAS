import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  Layers,
  CheckSquare,
  Settings,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import { usePlan } from '../hooks/plan.hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'

export const PlanDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: plan, isLoading, isError } = usePlan(id!)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-16 w-1/3' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-[400px] w-full' />
      </div>
    )
  }

  if (isError || !plan) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load plan details.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-start gap-4'>
        <Button variant='ghost' size='icon' onClick={() => navigate('/master-admin/plans')}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{plan.planName}</h1>
            <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500'>
              <span className='flex items-center gap-1 bg-muted text-foreground px-2 py-1 rounded'>
                {plan.planCode}
              </span>
              <span>•</span>
              <Badge variant='outline'>{plan.category}</Badge>
              <span>•</span>
              <Badge
                variant={
                  plan.status === 'ACTIVE'
                    ? 'default'
                    : plan.status === 'INACTIVE'
                    ? 'secondary'
                    : 'destructive'
                }
                className={
                  plan.status === 'ACTIVE'
                    ? 'bg-[#E4FD97] text-[#2D3E2C] border-[#E4FD97] hover:bg-[#E4FD97]/90'
                    : ''
                }
              >
                {plan.status}
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => navigate(`/master-admin/plans/${plan._id}/edit`)}
              variant='outline'
              className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'
            >
              Edit Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Description if available */}
      {plan.description && (
        <Card className='bg-muted border-border'>
          <CardContent className='p-4 text-foreground'>{plan.description}</CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='features'>Features</TabsTrigger>
          <TabsTrigger value='usage-limits'>Usage Limits</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Pricing</CardTitle>
                <IndianRupee className='w-4 h-4 text-slate-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {plan.pricing.currency} {plan.pricing.monthlyPrice}
                  <span className='text-sm font-normal text-slate-500'>/mo</span>
                </div>
                <div className='text-sm text-slate-500 mt-1'>
                  {plan.pricing.currency} {plan.pricing.yearlyPrice}/yr
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Active Companies</CardTitle>
                <Layers className='w-4 h-4 text-slate-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{plan.activeCompaniesCount}</div>
                <div className='text-sm text-slate-500 mt-1'>Total subscriptions</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-slate-500'>Tax</span>
                    <span className='font-medium'>{plan.pricing.taxPercent || 0}%</span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-slate-500'>Discount</span>
                    <span className='font-medium'>{plan.pricing.discountPercent || 0}%</span>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-slate-500'>Razorpay Monthly ID</span>
                    <span className='font-medium'>
                      {plan.pricing.razorpayPlanIdMonthly || 'Not set'}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-slate-500'>Razorpay Yearly ID</span>
                    <span className='font-medium'>
                      {plan.pricing.razorpayPlanIdYearly || 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='features'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Enabled Features</CardTitle>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-400 plan-icon-btn'
                onClick={() => navigate(`/master-admin/plans/${plan._id}/edit`)}
              >
                <CheckSquare className='w-5 h-5' />
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {Object.entries(plan.features).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      value ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border/50'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        value ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    {value ? (
                      <CheckCircle2 className='w-5 h-5 text-primary' />
                    ) : (
                      <XCircle className='w-5 h-5 text-muted-foreground/30' />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='usage-limits'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Resource Limits</CardTitle>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-400 plan-icon-btn'
                onClick={() => navigate(`/master-admin/plans/${plan._id}/edit`)}
              >
                <Settings className='w-5 h-5' />
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                {Object.entries(plan.usageLimits).map(([key, value]) => (
                  <div key={key} className='flex justify-between items-center py-3 border-b'>
                    <span className='text-muted-foreground'>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <span className='font-semibold'>{value === -1 ? 'Unlimited' : value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
