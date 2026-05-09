import React, { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Native lazy loading
 * - Responsive image support
 * - Loading state management
 * - Error handling
 * - Blur-up effect
 * - WebP format support
 */
const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  priority = false,
  srcSet,
  sizes,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate WebP source with fallback
  const hasWebpSrcSet = srcSet?.includes('.webp');

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
        containerClassName
      )}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* Blur-up placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
      )}

      {/* Picture element for WebP support */}
      <picture>
        {/* WebP format for modern browsers - only if srcSet has WebP */}
        {hasWebpSrcSet && (
          <source
            srcSet={srcSet}
            type="image/webp"
            sizes={sizes}
          />
        )}
        {/* Fallback to original format */}
        <img
          src={src}
          alt={alt}
          srcSet={srcSet && !hasWebpSrcSet ? srcSet : undefined}
          sizes={sizes}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Image failed to load
          </span>
        </div>
      )}
    </div>
  );
};

export const OptimizedImage = memo(OptimizedImageComponent);
