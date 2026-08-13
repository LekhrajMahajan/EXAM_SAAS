import type { ReactNode } from 'react'

interface StaffHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export const StaffHeader = ({ title, description, actions }: StaffHeaderProps) => {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
        {description && <p className='text-muted-foreground mt-1'>{description}</p>}
      </div>
      {actions && <div className='flex items-center gap-2'>{actions}</div>}
    </div>
  )
}
