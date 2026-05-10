import React, { memo, CSSProperties } from 'react';
import {} from '@/lib/ui';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  keyExtractor?: (item: T, index: number) => string | number;
}

/**
 * VirtualizedList Component
 * 
 * Renders only visible items in a scrollable container
 * Dramatically improves performance for large lists (100+ items)
 * 
 * Features:
 * - Only renders visible items
 * - Smooth scrolling
 * - Configurable overscan for smoother scrolling
 * - Keyboard accessible
 * - Memory efficient
 */
const VirtualizedListComponent = React.forwardRef<
  HTMLDivElement,
  VirtualizedListProps<any>
>(
  (
    {
      items,
      itemHeight,
      containerHeight,
      renderItem,
      className,
      overscan = 3,
      keyExtractor,
    },
    ref
  ) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    return (
      <div
        ref={ref}
        className={cn('overflow-y-auto overflow-x-hidden', className)}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
        role="list"
      >
        {/* Spacer for items before visible range */}
        <div style={{ height: offsetY }} />

        {/* Visible items */}
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          const key = keyExtractor
            ? keyExtractor(item, actualIndex)
            : actualIndex;

          return (
            <div
              key={key}
              role="listitem"
              style={{
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}

        {/* Spacer for items after visible range */}
        <div style={{ height: Math.max(0, totalHeight - (offsetY + visibleItems.length * itemHeight)) }} />
      </div>
    );
  }
);

VirtualizedListComponent.displayName = 'VirtualizedList';

export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;

/**
 * Grid Virtualization Component
 * For rendering large grids efficiently
 */
interface VirtualizedGridProps<T> {
  items: T[];
  columnCount: number;
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
  overscan?: number;
  keyExtractor?: (item: T, index: number) => string | number;
}

const VirtualizedGridComponent = React.forwardRef<
  HTMLDivElement,
  VirtualizedGridProps<any>
>(
  (
    {
      items,
      columnCount,
      itemHeight,
      containerHeight,
      renderItem,
      className,
      gap = 16,
      overscan = 3,
      keyExtractor,
    },
    ref
  ) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    const rowHeight = itemHeight + gap;
    const rowCount = Math.ceil(items.length / columnCount);

    // Calculate visible rows
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endRow = Math.min(
      rowCount,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
    );

    const startIndex = startRow * columnCount;
    const endIndex = Math.min(items.length, endRow * columnCount);
    const visibleItems = items.slice(startIndex, endIndex);

    const offsetY = startRow * rowHeight;
    const totalHeight = rowCount * rowHeight;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    return (
      <div
        ref={ref}
        className={cn('overflow-y-auto overflow-x-hidden', className)}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Spacer for rows before visible range */}
        <div style={{ height: offsetY }} />

        {/* Grid container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: `${gap}px`,
            paddingLeft: gap,
            paddingRight: gap,
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = startIndex + index;
            const key = keyExtractor
              ? keyExtractor(item, actualIndex)
              : actualIndex;

            return (
              <div key={key} role="gridcell">
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>

        {/* Spacer for rows after visible range */}
        <div
          style={{
            height: Math.max(
              0,
              totalHeight - (offsetY + Math.ceil(visibleItems.length / columnCount) * rowHeight)
            ),
          }}
        />
      </div>
    );
  }
);

VirtualizedGridComponent.displayName = 'VirtualizedGrid';

export const VirtualizedGrid = memo(VirtualizedGridComponent) as typeof VirtualizedGridComponent;


