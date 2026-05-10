import * as React from "react"
import { cn } from "@/lib/ui"

export interface HeaderProps {
  title: string
  subtitle?: string
  variant?: "light" | "dark"
  className?: string
}

export const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ title, subtitle, variant = "light", className }, ref) => {
    const isDark = variant === "dark"
    
    return (
      <header
        ref={ref}
        className={cn(
          "py-16 px-6 text-center",
          isDark 
            ? "bg-starbucks-dark text-white" 
            : "bg-starbucks-green/10 text-gray-900",
          className
        )}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </header>
    )
  }
)

Header.displayName = "Header"

