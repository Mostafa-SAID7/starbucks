import { Skeleton } from "./skeleton"
import { Spinner } from "./spinner"

interface LoaderProps {
  isLoading: boolean
  variant?: "skeleton" | "spinner"
  skeletonCount?: number
  skeletonClassName?: string
  spinnerSize?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function Loader({
  isLoading,
  variant = "skeleton",
  skeletonCount = 1,
  skeletonClassName,
  spinnerSize = "md",
  children,
}: LoaderProps) {
  if (!isLoading) return <>{children}</>

  if (variant === "spinner") {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size={spinnerSize} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <Skeleton key={i} className={skeletonClassName} />
      ))}
    </div>
  )
}
