import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'

import { useSupportTickets } from '../hooks/support-ticket.hooks'
import { SupportTicketDashboard } from '../components/support-tickets/SupportTicketDashboard'
import { SupportTicketFilters } from '../components/support-tickets/SupportTicketFilters'
import { SupportTicketTable } from '../components/support-tickets/SupportTicketTable'
import { CreateTicketModal } from '../components/support-tickets/CreateTicketModal'
import { TicketDetailsDrawer } from '../components/support-tickets/TicketDetailsDrawer'
import type { TicketFilters } from '../api/support-ticket.api'

export const SupportTicketsPage = () => {
  const [filters, setFilters] = useState<TicketFilters>({ page: 1, limit: 50 })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const { data, isLoading } = useSupportTickets(filters)

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Support Tickets</h1>
          <p className='text-muted-foreground mt-2'>
            Manage support requests and track SLA for tenant issues.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium">
          <Plus className='w-4 h-4 mr-2' />
          Create Ticket
        </Button>
      </div>

      <SupportTicketDashboard />

      <Card>
        <CardHeader>
          <CardTitle>Ticket Queue</CardTitle>
          <CardDescription>A list of all incoming support requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupportTicketFilters filters={filters} setFilters={setFilters} />

          <SupportTicketTable
            tickets={data?.data || []}
            isLoading={isLoading}
            onView={(id) => setSelectedTicketId(id)}
          />
        </CardContent>
      </Card>

      <CreateTicketModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <TicketDetailsDrawer ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />
    </div>
  )
}
