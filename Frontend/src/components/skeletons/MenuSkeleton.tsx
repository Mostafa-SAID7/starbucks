import React from 'react'
import { Skeleton } from '@/components/ui'

export const MenuSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-16 lg:pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <Skeleton className="h-8 w-40 rounded-lg mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}
            </div>
            
            <div className="mt-12 space-y-4 hidden lg:block">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-5 w-96 rounded-md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-4">
                  <Skeleton className="w-32 h-32 rounded-full" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
