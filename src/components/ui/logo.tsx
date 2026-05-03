import * as React from "react"
import logoSrc from "@/assets/logo.png"
import { cn } from "@/lib/utils"

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ className, ...props }, ref) => {
    return (
      <img 
        ref={ref}
        src={logoSrc} 
        alt="Starbucks" 
        className={cn("object-contain", className)}
        {...props} 
      />
    )
  }
)
Logo.displayName = "Logo"

export { Logo }
