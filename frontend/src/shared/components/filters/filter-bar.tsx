import React from "react"
import { cn } from "@/utils/cn"

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function FilterBar({ className, children, ...props }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
