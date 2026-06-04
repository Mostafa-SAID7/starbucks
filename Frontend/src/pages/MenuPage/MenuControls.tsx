import { Search, X } from "lucide-react";
import { cn } from "@/lib/ui";
import { getCategoryLabel } from "./helpers";

const CATEGORY_ALL = "all";

interface MenuControlsProps {
  isRTL: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (catId: string) => void;
  categoryTabs: string[];
}

/**
 * Search input + category filter tabs row.
 */
export function MenuControls({
  isRTL,
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categoryTabs,
}: MenuControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/80">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isRTL ? "ابحث في القائمة..." : "Search the menu..."}
          className="w-full ps-9 pe-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-starbucks-green/40 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
        {/* "All" tab */}
        <button
          onClick={() => onCategoryChange(CATEGORY_ALL)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
            activeCategory === CATEGORY_ALL
              ? "bg-starbucks-green text-white"
              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
          )}
        >
          {isRTL ? "الكل" : "All"}
        </button>

        {categoryTabs.map((catId) => (
          <button
            key={catId}
            data-testid="category-item"
            onClick={() => onCategoryChange(catId)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all capitalize",
              activeCategory === catId
                ? "bg-starbucks-green text-white"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            )}
          >
            {getCategoryLabel(catId, isRTL)}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORY_ALL };
