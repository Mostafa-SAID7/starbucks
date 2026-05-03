import React from 'react'
import logoSrc from '../assets/logo.png'

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

export default function Logo({ className = '', ...props }: LogoProps) {
  return (
    <img 
      src={logoSrc} 
      alt="Starbucks" 
      className={`object-contain ${className}`}
      {...props} 
    />
  )
}
