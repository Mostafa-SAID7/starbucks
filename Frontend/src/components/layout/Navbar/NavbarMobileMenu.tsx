import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "@/lib/core/constants";
import { NavItem } from "@/types";
import { Language } from "@/hooks";

interface NavbarMobileMenuProps {
  navItems: NavItem[];
  lang: Language;
  isRTL: boolean;
  onNavClick: () => void;
}

/**
 * Navbar Mobile Menu Component
 * Displays navigation items for mobile view
 * ~80 LOC
 */
export const NavbarMobileMenu = forwardRef<HTMLDivElement, NavbarMobileMenuProps>(
  ({ navItems, lang, isRTL, onNavClick }, ref) => {
    const { t } = useTranslation(["common", "navigation"]);


    return (
      <motion.div
        ref={ref}
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={ANIMATION_CONFIG.TRANSITIONS.SPRING}
        className="absolute top-0 left-0 right-0 z-50 border-t border-gray-100/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl overflow-hidden shadow-2xl rounded-b-[2rem]"
        role="menu"
        aria-label="Mobile navigation menu"
      >
        <div className="py-8 px-8">
          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            {navItems.map((item: NavItem, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  damping: 20,
                }}
              >
                <NavLink
                  to={`/${lang}${item.href}`}
                  onClick={onNavClick}
                  className={({ isActive }) => `
                    text-2xl font-black font-branding uppercase tracking-widest block py-4 px-4 rounded-2xl transition-all
                    ${isActive ? "text-starbucks-green bg-starbucks-green/5" : "text-starbucks-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"}
                  `}
                  role="menuitem"
                >
                  {t([`navigation:navbar.${item.id}`, `common:${item.id}`])}
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

NavbarMobileMenu.displayName = "NavbarMobileMenu";

