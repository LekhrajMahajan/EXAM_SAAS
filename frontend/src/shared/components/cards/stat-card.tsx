import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { cn } from "@/utils/cn"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    direction: "up" | "down" | "neutral"
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn("mt-2 flex items-center text-xs", {
              "text-success": trend.direction === "up",
              "text-destructive": trend.direction === "down",
              "text-muted-foreground": trend.direction === "neutral",
            })}
          >
            <span className="font-medium mr-1">
              {trend.direction === "up" ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
