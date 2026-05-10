/**
 * Skeleton Loader Components
 * Provides realistic loading placeholders for different content types
 */

import React from 'react';
import {} from '@/lib/ui';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Base Skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      {...props}
    />
  );
};

/**
 * Menu Item Skeleton
 */
export const MenuItemSkeleton: React.FC = () => (
  <div className="space-y-3 p-4">
    <Skeleton height={200} className="w-full rounded-lg" />
    <Skeleton height={20} width="80%" />
    <Skeleton height={16} width="60%" />
    <div className="flex gap-2 pt-2">
      <Skeleton height={32} width={80} className="rounded" />
      <Skeleton height={32} width={80} className="rounded" />
    </div>
  </div>
);

/**
 * Location Card Skeleton
 */
export const LocationSkeleton: React.FC = () => (
  <div className="space-y-3 p-4">
    <Skeleton height={150} className="w-full rounded-lg" />
    <Skeleton height={20} width="70%" />
    <Skeleton height={16} width="90%" />
    <Skeleton height={16} width="85%" />
    <div className="flex gap-2 pt-2">
      <Skeleton height={32} width={100} className="rounded" />
    </div>
  </div>
);

/**
 * Order Card Skeleton
 */
export const OrderSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 border rounded-lg">
    <div className="flex justify-between">
      <Skeleton height={20} width="40%" />
      <Skeleton height={20} width="30%" />
    </div>
    <Skeleton height={16} width="100%" />
    <Skeleton height={16} width="80%" />
    <div className="flex justify-between pt-2">
      <Skeleton height={24} width="50%" />
      <Skeleton height={32} width={80} className="rounded" />
    </div>
  </div>
);

/**
 * Grid Skeleton Loader
 */
interface GridSkeletonProps {
  count?: number;
  variant?: 'menu' | 'location' | 'order';
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  count = 6,
  variant = 'menu',
}) => {
  const SkeletonComponent = {
    menu: MenuItemSkeleton,
    location: LocationSkeleton,
    order: OrderSkeleton,
  }[variant];

  return (
    <div className={cn(
      'grid gap-4',
      variant === 'menu' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      variant === 'location' && 'grid-cols-1 md:grid-cols-2',
      variant === 'order' && 'grid-cols-1'
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

/**
 * List Skeleton Loader
 */
interface ListSkeletonProps {
  count?: number;
  lines?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  lines = 3,
}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2 p-4 border rounded-lg">
        {Array.from({ length: lines }).map((_, j) => (
          <Skeleton
            key={j}
            height={16}
            width={j === lines - 1 ? '60%' : '100%'}
          />
        ))}
      </div>
    ))}
  </div>
);


