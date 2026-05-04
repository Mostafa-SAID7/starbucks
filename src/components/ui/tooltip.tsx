import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ content, children, side = "bottom", className }, _ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const getPositionClasses = () => {
      switch (side) {
        case "top":
          return "bottom-full mb-2";
        case "bottom":
          return "top-full mt-2";
        case "left":
          return "right-full top-1/2 -translate-y-1/2 mr-2";
        case "right":
          return "left-full top-1/2 -translate-y-1/2 ml-2";
        default:
          return "top-full mt-2";
      }
    };

    const getArrowClasses = () => {
      switch (side) {
        case "top":
          return "top-full left-1/2 -translate-x-1/2 -mt-1";
        case "bottom":
          return "bottom-full left-1/2 -translate-x-1/2 -mb-1";
        case "left":
          return "left-full top-1/2 -translate-y-1/2 -ml-1";
        case "right":
          return "right-full top-1/2 -translate-y-1/2 -mr-1";
        default:
          return "bottom-full left-1/2 -translate-x-1/2 -mb-1";
      }
    };

    return (
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: side === "bottom" ? -10 : side === "top" ? 10 : 0,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: side === "bottom" ? -10 : side === "top" ? 10 : 0,
              }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-[100] px-3 py-2.5 text-xs font-semibold text-white bg-gray-900 dark:bg-zinc-800 rounded-lg shadow-xl whitespace-nowrap pointer-events-none",
                getPositionClasses(),
                // Perfect centering for top/bottom tooltips
                (side === "bottom" || side === "top") &&
                  "left-1/2 -translate-x-1/2",
                className,
              )}
              role="tooltip"
            >
              {content}
              {/* Arrow */}
              <div
                className={cn(
                  "absolute w-2 h-2 bg-gray-900 dark:bg-zinc-800 rotate-45",
                  getArrowClasses(),
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
