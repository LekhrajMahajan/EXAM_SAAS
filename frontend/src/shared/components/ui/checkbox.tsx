import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/utils/cn"

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, defaultChecked, disabled, onClick, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const isChecked = checked !== undefined ? checked === true : internalChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      if (!e.defaultPrevented) {
        const newChecked = !isChecked;
        if (checked === undefined) {
          setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
      }
    };

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 dark:border-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all flex items-center justify-center",
          className
        )}
        {...props}
      >
        {isChecked && (
          <Check className="h-3.5 w-3.5 text-current stroke-3" />
        )}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
