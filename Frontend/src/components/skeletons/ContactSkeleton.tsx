import React from 'react'
import { Skeleton } from '@/components/ui'

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-5/6 rounded-md" />
            </div>

            <div className="space-y-6 mt-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4 space-x-reverse">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-1/3 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-full mt-4" />
          </div>

        </div>
      </div>
    </div>
  )
}
