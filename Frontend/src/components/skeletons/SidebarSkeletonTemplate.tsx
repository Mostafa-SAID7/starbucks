import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui'

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

interface SidebarSkeletonTemplateProps {
  children: React.ReactNode
  sidebarHeight?: string
}

export const SidebarSkeletonTemplate: React.FC<SidebarSkeletonTemplateProps> = ({ 
  children,
  sidebarHeight = "h-[500px] lg:h-[calc(100vh-4rem)]"
}) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white dark:bg-zinc-950 pt-8 lg:pt-16 pb-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Side 1: Sticky Sidebar Skeleton (42%) */}
          <motion.div variants={itemVariants} className={`lg:w-[42%] xl:w-[40%] ${sidebarHeight} lg:sticky lg:top-28`}>
            <Skeleton className="h-full w-full rounded-[2.5rem] shadow-2xl" />
          </motion.div>

          {/* Side 2: Content Column Skeleton (60%) */}
          <div className="lg:w-[60%]">
            {children}
          </div>
          
        </div>
      </div>
    </motion.div>
  )
}
