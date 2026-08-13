import React, { useRef, useState } from "react"
import { UploadCloud, X } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "@/shared/components/ui/button"

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  className?: string
  id?: string
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSizeMB = 5,
  className,
  id,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB`)
      return
    }
    setError(null)
    setFile(f)
    onFileSelect(f)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setFile(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("w-full", className)}>
      {!file ? (
        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted/50",
            dragActive ? "border-primary bg-primary/5" : "border-input"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            id={id}
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Click or drag file to this area to upload</p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
