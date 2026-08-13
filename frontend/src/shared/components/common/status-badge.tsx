import React from "react"
import { Badge, type BadgeProps } from "@/shared/components/ui/badge"

export type StatusType = "pending" | "active" | "completed" | "failed" | "cancelled" | "draft" | string

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: StatusType
  label?: string
}

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  let variant: BadgeProps["variant"] = "default"
  
  const s = status.toLowerCase()
  if (["active", "completed", "success", "approved", "passed"].includes(s)) variant = "success"
  else if (["pending", "processing", "in_progress", "warning"].includes(s)) variant = "warning"
  else if (["failed", "cancelled", "error", "rejected", "danger"].includes(s)) variant = "destructive"
  else if (["draft", "inactive", "archived", "info"].includes(s)) variant = "info"
  
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")

  return (
    <Badge variant={variant} className={className} {...props}>
      {displayLabel}
    </Badge>
  )
}
