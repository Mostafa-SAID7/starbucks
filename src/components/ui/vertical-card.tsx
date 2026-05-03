import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface Action {
  label: string
  href: string
  primary: boolean
}

interface VerticalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  image: string
  actions: Action[]
}

const VerticalCard = React.forwardRef<HTMLDivElement, VerticalCardProps>(
  ({ title, image, actions, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-starbucks-dark shadow-sm", className)}
        {...props}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex w-full flex-col items-center p-8 text-center mt-20">
          <h3 className="mb-6 text-3xl font-extrabold text-white drop-shadow-md">
            {title}
          </h3>

          <div className="flex w-full flex-col gap-4 max-w-[200px]">
            {actions.map((action, index) => (
              <Button
                key={index}
                asChild
                variant={action.primary ? "default" : "outline"}
                className={cn(
                  "w-full rounded-2xl font-bold",
                  action.primary
                    ? "bg-starbucks-green text-white shadow-md hover:bg-starbucks-dark dark:bg-starbucks-light dark:text-black dark:hover:bg-white"
                    : "border-white bg-transparent text-white hover:bg-white hover:text-starbucks-dark dark:border-starbucks-light dark:text-starbucks-light dark:hover:bg-starbucks-light dark:hover:text-black"
                )}
              >
                <a href={action.href} target={action.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                  {action.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
VerticalCard.displayName = "VerticalCard"

const VerticalCardSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900", className)}
        {...props}
      >
        <div className="relative z-10 flex w-full flex-col items-center p-8 text-center mt-20">
          <div className="mb-6 h-8 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex w-full flex-col gap-4 max-w-[200px]">
            <div className="h-11 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    )
  }
)
VerticalCardSkeleton.displayName = "VerticalCardSkeleton"

export { VerticalCard, VerticalCardSkeleton }
