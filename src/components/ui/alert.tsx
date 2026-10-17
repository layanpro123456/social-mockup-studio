import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-3.5 transition-all duration-200 shadow-lg shadow-black/25 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-3.5",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900/85 backdrop-blur-md border-slate-800 text-slate-100 [&>svg]:text-indigo-400",
        destructive:
          "bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-950/90 backdrop-blur-md border-red-500/60 text-red-100 shadow-red-950/30 [&>svg]:text-red-400",
        warning:
          "bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-950/90 backdrop-blur-md border-amber-500/60 text-amber-100 shadow-amber-950/30 [&>svg]:text-amber-400",
        success:
          "bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-950/90 backdrop-blur-md border-emerald-500/60 text-emerald-100 shadow-emerald-950/30 [&>svg]:text-emerald-400",
        info:
          "bg-gradient-to-r from-sky-950/80 via-sky-900/40 to-slate-950/90 backdrop-blur-md border-sky-500/60 text-sky-100 shadow-sky-950/30 [&>svg]:text-sky-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
