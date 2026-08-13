import React from "react"
import { Spinner } from "@/shared/components/ui/spinner"
import { cn } from "@/utils/cn"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  className,
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-inherit",
        className
      )}
    >
      <Spinner size="lg" />
      {message && <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>}
    </div>
  )
}
