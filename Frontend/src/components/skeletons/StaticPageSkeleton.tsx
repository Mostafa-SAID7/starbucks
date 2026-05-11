import React from 'react'
import { SidebarSkeletonTemplate } from './SidebarSkeletonTemplate'
import { ContentBlockSkeleton } from './SkeletonParts'

export const StaticPageSkeleton: React.FC = () => {
  return (
    <SidebarSkeletonTemplate>
      <ContentBlockSkeleton />
      <div className="space-y-12">
        {[1, 2].map((i) => (
          <ContentBlockSkeleton key={i} />
        ))}
      </div>
    </SidebarSkeletonTemplate>
  )
}
