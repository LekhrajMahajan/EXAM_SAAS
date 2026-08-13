import React, { useRef, useState, useEffect } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "@/shared/components/ui/button"

export interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  defaultImage?: string
  className?: string
}

export function ImageUpload({
  onImageSelect,
  defaultImage,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (defaultImage) setPreview(defaultImage)
  }, [defaultImage])

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return
    
    const objectUrl = URL.createObjectURL(f)
    setPreview(objectUrl)
    onImageSelect(f)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onImageSelect(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div
      className={cn(
        "group relative flex aspect-square w-full max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50",
        preview ? "border-solid border-input bg-muted" : "border-input",
        className
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <ImagePlus className="mb-2 h-8 w-8" />
          <span className="text-xs font-medium">Upload Image</span>
        </div>
      )}
    </div>
  )
}
