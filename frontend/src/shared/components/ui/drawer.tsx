import * as React from "react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger, DialogClose } from "./dialog"
import { cn } from "@/utils/cn"

type DrawerProps = React.ComponentPropsWithoutRef<typeof Dialog>

const Drawer = Dialog
const DrawerTrigger = DialogTrigger
const DrawerClose = DialogClose

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="bg-black/40" />
    <DialogContent
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl border bg-background",
        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DialogContent>
  </DialogPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

export {
  Drawer,
  DialogPortal as DrawerPortal,
  DialogOverlay as DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
