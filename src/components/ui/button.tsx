import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-starbucks-green text-white hover:bg-starbucks-dark dark:bg-starbucks-green dark:hover:bg-starbucks-dark",
        outline: "border-2 border-starbucks-green text-starbucks-green hover:bg-starbucks-green hover:text-white dark:border-starbucks-green dark:text-starbucks-green dark:hover:bg-starbucks-green dark:hover:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800",
        link: "text-starbucks-green underline-offset-4 hover:underline",
        primary: "bg-starbucks-green text-white hover:bg-starbucks-dark transition-colors shadow-lg hover:shadow-xl",
        secondary: "bg-white text-starbucks-dark border-2 border-starbucks-dark hover:bg-starbucks-dark hover:text-white transition-all",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 rounded-full px-6",
        lg: "h-12 rounded-full px-10",
        xl: "h-14 rounded-full px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, leftIcon, rightIcon, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const finalLeftIcon = leftIcon || icon
    
    if (asChild) {
      // Radix Slot clones its child and passes props to it.
      // If we have icons, we must ensure the child of Slot is a SINGLE element
      // that contains the icons.
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Spinner size="sm" className="mr-2 border-current border-t-transparent" />}
        {!loading && finalLeftIcon && <span className="inline-flex shrink-0">{finalLeftIcon}</span>}
        <span className="truncate">{children}</span>
        {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
