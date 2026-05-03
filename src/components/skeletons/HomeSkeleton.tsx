import React from 'react'
import { Skeleton } from '@/components/ui'

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black w-full overflow-hidden">
      {/* Hero Banner Skeleton */}
      <div className="h-[400px] lg:h-[600px] w-full flex flex-col lg:flex-row bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center space-y-6">
          <Skeleton className="h-14 w-3/4 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-5/6 rounded-md" />
          </div>
          <Skeleton className="h-12 w-40 rounded-full mt-4" />
        </div>
        <div className="hidden lg:block flex-1 bg-gray-100 dark:bg-zinc-800 animate-pulse" />
      </div>

      {/* Featured Cards Skeleton */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col space-y-6">
            <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
            <Skeleton className="h-8 w-1/2 rounded-md mx-auto" />
            <Skeleton className="h-4 w-3/4 rounded-md mx-auto" />
            <Skeleton className="h-12 w-32 rounded-full mx-auto" />
          </div>
        ))}
      </div>

      {/* Statement Skeleton */}
      <div className="bg-gray-50 dark:bg-zinc-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-10 w-2/3 rounded-xl mx-auto" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-4/5 rounded-md mx-auto" />
          </div>
          <Skeleton className="h-12 w-32 rounded-full mx-auto mt-6" />
        </div>
      </div>
    </div>
  )
}
