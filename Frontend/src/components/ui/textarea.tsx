import * as React from "react"
import { cn } from "@/lib/ui"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-300",
          "placeholder:text-gray-400 focus:border-starbucks-green focus:outline-none focus:ring-2 focus:ring-starbucks-green/20",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        aria-invalid={error}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

