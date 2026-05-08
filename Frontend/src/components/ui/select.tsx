import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_CONFIG } from "@/lib/constants";

export interface SelectOption {
  id: string;
  label: string;
  value?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isRTL?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  isRTL,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Derive selected option from props instead of storing in state
  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.id === value || opt.value === value);
  }, [value, options]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-16 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-4 text-lg text-gray-900 transition-all duration-300",
          "hover:border-starbucks-green focus:border-starbucks-green focus:outline-none focus:ring-4 focus:ring-starbucks-green/10",
          "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-starbucks-light",
          isOpen && "border-starbucks-green ring-4 ring-starbucks-green/10"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn("truncate", !selectedOption && "text-gray-400 opacity-60")}>
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ 
            rotate: isOpen ? 180 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-starbucks-green"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-3 w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-white/10 dark:bg-zinc-900/95",
              isRTL ? "right-0" : "left-0"
            )}
            role="listbox"
          >
            <div className="p-2 space-y-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center justify-between px-6 py-4 text-lg text-gray-900 transition-all rounded-2xl hover:bg-starbucks-green/5 dark:text-white dark:hover:bg-white/5",
                    selectedOption?.id === option.id &&
                      "bg-starbucks-green/10 text-starbucks-green font-bold dark:bg-starbucks-light/10"
                  )}
                  role="option"
                  aria-selected={selectedOption?.id === option.id}
                >
                  <span className="truncate">{option.label}</span>
                  {selectedOption?.id === option.id && (
                    <Check className="h-5 w-5 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

