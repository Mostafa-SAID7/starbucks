import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-3xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 px-6 py-4 text-lg font-bold text-starbucks-dark dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-700 outline-none focus:border-starbucks-green focus:ring-[12px] focus:ring-starbucks-green/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
