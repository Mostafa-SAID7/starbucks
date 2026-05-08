import React from 'react'
import { Skeleton } from '@/components/ui'

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black w-full overflow-hidden">
      {/* Hero Banner Skeleton - Matching the new 85vh height */}
      <div className="relative h-[650px] lg:h-[85vh] w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-100 dark:bg-zinc-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100 dark:bg-zinc-800 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50" />

        <div className="container mx-auto px-8 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32 rounded-full opacity-60" />
              <Skeleton className="h-16 md:h-24 w-full md:w-[120%] rounded-2xl" />
              <Skeleton className="h-16 md:h-24 w-3/4 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-full opacity-40 rounded-md" />
              <Skeleton className="h-6 w-5/6 opacity-40 rounded-md" />
            </div>
            <Skeleton className="h-14 w-48 rounded-full mt-4" />
          </div>
        </div>

        {/* Branding Silhouette Placeholder */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl flex flex-col items-center space-y-4 opacity-20">
          <div className="w-[1px] h-20 bg-gray-200 dark:bg-zinc-700" />
          <Skeleton className="h-12 sm:h-20 w-full rounded-xl" />
        </div>
      </div>

      {/* Featured Cards Skeleton */}
      <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col space-y-8 p-4">
            <Skeleton className="w-full aspect-[16/10] rounded-[2.5rem] shadow-sm" />
            <div className="space-y-4 text-center">
              <Skeleton className="h-10 w-2/3 rounded-xl mx-auto" />
              <Skeleton className="h-5 w-5/6 rounded-lg mx-auto opacity-50" />
              <Skeleton className="h-14 w-40 rounded-full mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
