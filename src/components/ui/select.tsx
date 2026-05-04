import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  id: string
  label: string
  value?: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  isRTL?: boolean
  className?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, placeholder, isRTL, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedOption, setSelectedOption] = React.useState<SelectOption | undefined>()
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const selected = options.find(opt => opt.id === value || opt.value === value)
      setSelectedOption(selected)
    }, [value, options])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: SelectOption) => {
      setSelectedOption(option)
      onChange?.(option.id)
      setIsOpen(false)
    }

    return (
      <div className={cn("relative", className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-300",
            "hover:border-starbucks-green focus:border-starbucks-green focus:outline-none focus:ring-2 focus:ring-starbucks-green/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-starbucks-light",
            isRTL && "flex-row-reverse"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!selectedOption && "text-gray-400")}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
            isRTL && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900",
              isRTL && "right-0"
            )}
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-zinc-800",
                  selectedOption?.id === option.id && "bg-starbucks-green/10 text-starbucks-green dark:bg-starbucks-light/10",
                  isRTL && "flex-row-reverse"
                )}
                role="option"
                aria-selected={selectedOption?.id === option.id}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selectedOption?.id !== option.id && "invisible"
                  )}
                />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }