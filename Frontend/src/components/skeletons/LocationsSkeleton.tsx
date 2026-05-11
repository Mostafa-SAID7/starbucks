import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui'
import { SidebarSkeletonTemplate, itemVariants } from './SidebarSkeletonTemplate'
import { ContentBlockSkeleton, GridSkeletonTemplate } from './SkeletonParts'

export const LocationsSkeleton: React.FC = () => {
  return (
    <SidebarSkeletonTemplate>
      <ContentBlockSkeleton />
      
      {/* City List Skeleton specific to Locations */}
      <div className="border-t border-gray-100 dark:border-white/10 pt-12 space-y-8">
        <motion.div variants={itemVariants}>
          <Skeleton className="h-10 w-48 rounded-xl" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div key={i} variants={itemVariants}>
              <Skeleton className="h-24 w-full rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </SidebarSkeletonTemplate>
  )
}
