import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/utils/cn"

export interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

export function SearchBox({ className, onSearch, onChange, ...props }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onSearch?.(e.target.value)
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-9"
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}
