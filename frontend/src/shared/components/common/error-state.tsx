import React from "react"
import { cn } from "@/utils/cn"
import { AlertCircle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong!",
  description = "We encountered an unexpected error while processing your request.",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          {description}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
