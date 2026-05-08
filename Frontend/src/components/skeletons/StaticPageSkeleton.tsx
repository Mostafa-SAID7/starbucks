import React from 'react'
import { Skeleton } from '@/components/ui'

export const StaticPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
      {/* Header Skeleton */}
      <div className="bg-starbucks-green dark:bg-zinc-900 py-16 px-6">
        <div className="container mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-xl bg-white/20 dark:bg-white/10" />
          <Skeleton className="h-5 w-48 rounded-md bg-white/20 dark:bg-white/10" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto max-w-4xl px-6 py-12 space-y-12">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-6">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
