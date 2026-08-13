import React from "react"
import { cn } from "@/utils/cn"

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between pb-4 border-b mb-6", className)}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
