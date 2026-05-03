import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  id: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  isRTL?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  isRTL = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.id === value)

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-full items-center justify-between rounded-full border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 px-6 py-2 text-lg font-bold text-starbucks-dark dark:text-white outline-none ring-offset-background focus:border-starbucks-green focus:ring-[12px] focus:ring-starbucks-green/5 transition-all",
          isOpen && "border-starbucks-green ring-[12px] ring-starbucks-green/5"
        )}
      >
        <span className={cn(selectedOption ? "text-starbucks-dark dark:text-white" : "text-gray-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100] mt-1 w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-starbucks-green scrollbar-track-transparent">
              <div className="p-1.5">
                {options.map((option) => {
                  const isSelected = option.id === value
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onChange(option.id)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-bold transition-all",
                        isSelected 
                          ? "bg-starbucks-green text-white" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-900",
                        isRTL ? "text-right" : "text-left"
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-5 w-5" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Select }
