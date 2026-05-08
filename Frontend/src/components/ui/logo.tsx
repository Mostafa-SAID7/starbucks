import React from 'react'
import { LogoProps } from "@/types/components";

export const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      src="/logo.png"
      alt="Starbucks"
      className={className}
      {...props}
    />
  )
)

Logo.displayName = 'Logo'