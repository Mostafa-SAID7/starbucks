import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui'
import { itemVariants } from './variants'

export const ContentBlockSkeleton: React.FC = () => {
  return (
    <motion.div variants={itemVariants} className="space-y-6 mb-12">
      <Skeleton className="h-16 lg:h-20 w-3/4 rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-5/6 rounded-lg" />
      </div>
    </motion.div>
  )
}

export const GridSkeletonTemplate: React.FC<{ items?: number }> = ({ items = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-16">
      {Array.from({ length: items }).map((_, i) => (
        <motion.div 
          key={i} 
          variants={itemVariants} 
          className="flex flex-col h-[400px] bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          <Skeleton className="h-2/3 w-full" />
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-10 w-32 rounded-full mt-4" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
