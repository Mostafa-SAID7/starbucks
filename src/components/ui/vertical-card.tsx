import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface VerticalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  image?: string
  href?: string
  className?: string
}

export const VerticalCard = forwardRef<HTMLDivElement, VerticalCardProps>(
  ({ title, description, image, href, className, ...props }, ref) => {
    const CardContent = (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md border border-gray-100 dark:border-zinc-800',
          className
        )}
        {...props}
      >
        {image && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="mb-2 text-lg font-bold text-starbucks-dark dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
          {href && (
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Learn More
            </Button>
          )}
        </div>
      </div>
    )

    if (href) {
      return (
        <a href={href} className="block h-full">
          {CardContent}
        </a>
      )
    }

    return CardContent
  }
)

VerticalCard.displayName = 'VerticalCard'