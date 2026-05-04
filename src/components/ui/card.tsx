import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        hoverable && "hover:shadow-lg hover:shadow-starbucks-green/10 hover:-translate-y-1",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }