import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ size = "md", className }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
          "text-starbucks-green",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    )
  }
)

Loader.displayName = "Loader"