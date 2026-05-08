import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-300",
          "placeholder:text-gray-400 focus:border-starbucks-green focus:outline-none focus:ring-2 focus:ring-starbucks-green/20",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
          className
        )}
        ref={ref}
        aria-invalid={error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }