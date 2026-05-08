import React from 'react'

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

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