import { cn } from "@/lib/ui"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-zinc-100 dark:bg-zinc-800",
        "bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5",
        "bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }


