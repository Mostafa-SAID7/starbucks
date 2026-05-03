import React from 'react'
import { motion } from 'framer-motion'

interface HeaderProps {
  title: string
  subtitle?: string
  image?: string
  variant?: 'light' | 'dark'
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, image, variant = 'dark' }) => {
  const isDark = variant === 'dark'

  return (
    <div className={`relative overflow-hidden py-16 lg:py-24 ${isDark ? 'bg-starbucks-dark text-white' : 'bg-[#f7f7f7] text-starbucks-dark dark:bg-zinc-900 dark:text-white'}`}>
      {image && isDark && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt={title} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark to-transparent" />
        </div>
      )}
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-right rtl:text-right ltr:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold lg:text-6xl leading-tight"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mt-6 text-xl max-w-2xl mx-auto lg:mx-0 ${isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {image && !isDark && (
            <div className="flex-1 w-full max-w-xl">
               <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={image} 
                  alt={title} 
                  className="w-full rounded-2xl shadow-2xl"
                />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
