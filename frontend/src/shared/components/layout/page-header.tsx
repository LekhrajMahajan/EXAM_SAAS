import React from "react"
import { cn } from "@/utils/cn"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between", className)}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
