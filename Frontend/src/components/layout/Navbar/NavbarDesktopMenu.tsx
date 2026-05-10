import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "@/lib/core/constants";
import { NavItem } from "@/types";
import { Language } from "@/hooks";

interface NavbarDesktopMenuProps {
  navItems: NavItem[];
  lang: Language;
  prefetchPage: (slug: string) => void;
}

/**
 * Navbar Desktop Menu Component
 * Displays navigation items for desktop view
 * ~80 LOC
 */
export function NavbarDesktopMenu({
  navItems,
  lang,
  prefetchPage,
}: NavbarDesktopMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div
      className="hidden items-center gap-8 lg:flex h-full"
      role="menubar"
    >
      {navItems.map((item: NavItem) => (
        <NavLink
          key={item.id}
          to={`/${lang}${item.href}`}
          onMouseEnter={() => {
            if (item.slug) {
              prefetchPage(item.slug);
            }
          }}
          className={({ isActive }) => `
            relative flex h-full items-center text-[13px] font-black font-branding uppercase tracking-[0.2em] transition-all py-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green focus-visible:rounded
            ${
              isActive
                ? "text-starbucks-green"
                : "text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark dark:hover:text-starbucks-green"
            }
          `}
          role="menuitem"
        >
          <span className="relative z-10 font-branding">
            {t([`navigation:navbar.${item.id}`, `common:${item.id}`])}
          </span>
          {location.pathname === `/${lang}${item.href}` ? (
            <motion.div
              layoutId="nav-underline"
              className="absolute -bottom-6 left-0 right-0 h-1 bg-starbucks-green rounded-t-full"
              transition={ANIMATION_CONFIG.TRANSITIONS.SPRING}
            />
          ) : (
            <div className="absolute -bottom-6 left-1/2 right-1/2 h-1 bg-starbucks-green opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-300 rounded-t-full" />
          )}
        </NavLink>
      ))}
    </div>
  );
}

