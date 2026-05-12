import { cn } from "@/lib/ui"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/8 to-transparent"
      />
    </div>
  )
}

export { Skeleton }
