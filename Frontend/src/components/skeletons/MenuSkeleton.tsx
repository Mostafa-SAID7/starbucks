import React from 'react'
import { SidebarSkeletonTemplate } from './SidebarSkeletonTemplate'
import { ContentBlockSkeleton, GridSkeletonTemplate } from './SkeletonParts'

export const MenuSkeleton: React.FC = () => {
  return (
    <SidebarSkeletonTemplate>
      <ContentBlockSkeleton />
      <GridSkeletonTemplate items={4} />
    </SidebarSkeletonTemplate>
  )
}
