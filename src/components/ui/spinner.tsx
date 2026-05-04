import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", className }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-3",
      lg: "h-12 w-12 border-4"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-block rounded-full border-current border-r-transparent animate-spin",
          "text-starbucks-green",
          sizeClasses[size],
          className
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = "Spinner"