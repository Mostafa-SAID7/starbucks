import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Coffee,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { navbar, menu } from "@/data";
import { Modal, Input } from "@/components/ui";

interface SearchMenuItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  href: string;
  categoryTitle?: string;
  subcategoryTitle?: string;
}

interface SearchSubcategory {
  id: string;
  title: string;
  image?: string;
  href?: string;
  items?: SearchMenuItem[];
}

interface SearchCategory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  href?: string;
  sidebarTitle?: string;
  subcategories?: SearchSubcategory[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isRTL = i18n.language === "ar";
  const lang = (
    urlLang && (urlLang === "ar" || urlLang === "en")
      ? urlLang
      : i18n.language === "ar"
        ? "ar"
        : "en"
  ) as "ar" | "en";
  const searchData = navbar[lang].search;
  const menuData = menu[lang];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setTimeout(() => setSearchTerm(""), 0);
    }
  }, [isOpen]);

  const trendingTerms =
    lang === "ar"
      ? ["لاتيه", "كابتشينو", "فرابوتشينو", "قهوة مثلجة"]
      : ["Latte", "Cappuccino", "Frappuccino", "Iced Coffee"];

  const handleTermClick = (term: string) => {
    setSearchTerm(term);
    inputRef.current?.focus();
  };

  // Flatten menu items for search
  const allMenuItems = useMemo(() => {
    const items: SearchMenuItem[] = [];
    if (menuData && menuData.categories) {
      menuData.categories.forEach((category: SearchCategory) => {
        if (category.subcategories) {
          category.subcategories.forEach((sub: SearchSubcategory) => {
            if (sub.items) {
              sub.items.forEach((item: SearchMenuItem) => {
                items.push({
                  ...item,
                  categoryTitle: category.title,
                  subcategoryTitle: sub.title,
                });
              });
            }
          });
        }
      });
    }
    return items;
  }, [menuData]);

  // Filter items based on search term
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allMenuItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term),
    );
  }, [searchTerm, allMenuItems]);

  const handleResultClick = (item: SearchMenuItem) => {
    if (item.href.startsWith("http")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/${lang}${item.href}`);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={searchData.title}>
      <div className="relative group flex items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`absolute ${isRTL ? "right-6" : "left-6"} pointer-events-none z-10 flex items-center justify-center`}
        >
          <Search className="h-7 w-7 text-gray-400 group-focus-within:text-starbucks-green transition-colors" />
        </motion.div>
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchData.placeholder}
          dir={isRTL ? "rtl" : "ltr"}
          className={`w-full py-8 text-2xl ${isRTL ? "pr-20 pl-8" : "pl-20 pr-8"}`}
        />
      </div>

      <div className="mt-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          {!searchTerm.trim() ? (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <p
                className={`text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 ${isRTL ? "text-right" : "text-left"}`}
              >
                {searchData.trending}
              </p>
              <div
                className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : "justify-start"}`}
              >
                {trendingTerms.map((term, i) => (
                  <motion.button
                    key={term}
                    onClick={() => handleTermClick(term)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-full bg-gray-100 dark:bg-zinc-800 px-7 py-3 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-starbucks-green hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2"
            >
              <p
                className={`text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ${isRTL ? "text-right" : "text-left"}`}
              >
                {searchResults.length > 0
                  ? lang === "ar"
                    ? `النتائج (${searchResults.length})`
                    : `Results (${searchResults.length})`
                  : lang === "ar"
                    ? "لا توجد نتائج"
                    : "No results found"}
              </p>

              {searchResults.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 w-full ${isRTL ? "text-right flex-row-reverse" : "text-left"}`}
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-starbucks-green transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.description}
                    </p>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span>{item.categoryTitle}</span>
                      <span>•</span>
                      <span>{item.subcategoryTitle}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-gray-300 group-hover:text-starbucks-green transition-colors">
                    {item.href.startsWith("http") ? (
                      <ExternalLink className="w-5 h-5" />
                    ) : isRTL ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export { SearchModal };
export default SearchModal;
