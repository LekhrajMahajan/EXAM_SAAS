import * as React from "react"
import { cn } from "@/utils/cn"

const RadioGroupContext = React.createContext<{
  name: string
  value: string | undefined
  onChange: (value: string) => void
} | null>(null)

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, ...props }, ref) => {
    const id = React.useId()
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleChange = (val: string) => {
      if (!isControlled) setInternalValue(val)
      onValueChange?.(val)
    }

    return (
      <RadioGroupContext.Provider
        value={{ name: name || id, value: currentValue, onChange: handleChange }}
      >
        <div ref={ref} className={cn("grid gap-2", className)} role="radiogroup" {...props} />
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, disabled, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    if (!context) throw new Error("RadioGroupItem must be used within RadioGroup")

    const checked = context.value === value

    return (
      <div className="relative flex items-center">
        <input
          type="radio"
          ref={ref}
          name={context.name}
          value={value}
          checked={checked}
          onChange={() => context.onChange(value)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            className
          )}
        >
          {checked && (
            <span className="flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-current mt-[3px] ml-[2.5px]" />
            </span>
          )}
        </div>
      </div>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
