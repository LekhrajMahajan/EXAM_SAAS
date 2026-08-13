import React from "react"
import { Input, type InputProps } from "@/shared/components/ui/input"
import { cn } from "@/utils/cn"

export interface DatePickerProps extends Omit<InputProps, "type"> {
  label?: string
  error?: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
        <Input type="date" ref={ref} className={cn(error && "border-destructive")} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"
