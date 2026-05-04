import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface VerticalCardProps {
  title: string
  image: string
  href: string
  className?: string
}

export const VerticalCard = React.forwardRef<HTMLDivElement, VerticalCardProps>(
  ({ title, image, href, className }, ref) => {
    return (
      <Link
        to={href}
        className={cn(
          "group block rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300",
          className
        )}
        ref={ref}
      >
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-starbucks-green transition-colors">
            {title}
          </h3>
        </div>
      </Link>
    )
  }
)

VerticalCard.displayName = "VerticalCard"