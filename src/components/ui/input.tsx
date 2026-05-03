import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-full border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 px-6 py-2 text-lg font-bold text-starbucks-dark dark:text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-300 dark:placeholder:text-zinc-700 focus-visible:outline-none focus-visible:border-starbucks-green focus-visible:ring-[12px] focus-visible:ring-starbucks-green/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
