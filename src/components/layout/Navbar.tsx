import { useState, useEffect, useRef, useCallback } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks";
import { queryKeys } from "@/lib/queryKeys";
import { pageFetchers } from "@/lib/fetchers";
import { useNavigation } from "@/hooks/queries";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_CONFIG, CACHE_TIMES } from "@/lib/constants";
import {
  MapPin,
  Menu as MenuIcon,
  X,
  Search,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, Button, Tooltip } from "@/components/ui";
import { lazy, Suspense } from "react";

const SearchModal = lazy(() => import("@/components").then(m => ({ default: m.SearchModal })));
const AuthModal = lazy(() => import("@/components").then(m => ({ default: m.AuthModal })));


import { NavItem } from "@/types";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const { data } = useNavigation();

  const lang = (
    urlLang && (urlLang === "ar" || urlLang === "en")
      ? urlLang
      : i18n.language === "ar"
        ? "ar"
        : "en"
  ) as "ar" | "en";
  const isRTL = lang === "ar";

  // Prefetch function for generic pages
  const prefetchPage = useCallback(
    (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.pages.bySlug(slug),
        queryFn: () => pageFetchers.fetchPageBySlug(slug),
        staleTime: CACHE_TIMES.PAGE_STALE,
      });
    },
    [queryClient],
  );

  // Handle scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      if (isMobileMenuOpen) {
        setTimeout(() => setIsMobileMenuOpen(false), 0);
      }
      prevPathname.current = location.pathname;
    }
  }, [location.pathname, isMobileMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const toggleLanguage = useCallback(() => {
    const newLang = lang === "ar" ? "en" : "ar";

    const pathParts = location.pathname.split("/");
    const pathWithoutLang = pathParts.slice(2).join("/");
    const newPath = `/${newLang}${pathWithoutLang ? "/" + pathWithoutLang : ""}`;

    i18n.changeLanguage(newLang);
    setIsMobileMenuOpen(false);
    navigate(newPath);

    toast.success(
      newLang === "ar"
        ? "تم تغيير اللغة إلى العربية"
        : "Language changed to English",
    );
  }, [i18n, lang, location.pathname, navigate]);

  // Nav items from centralized data
  const navItems = data?.navbar?.links || [];

  const handleNavClick = useCallback((href: string) => {
    if (href.startsWith("/")) {
      // Internal navigation handled by React Router
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <div className="h-20 lg:h-24" />{" "}
      {/* Spacer to prevent content jump with fixed nav */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full border-b transition-all duration-300 ${
          isMobileMenuOpen ? "z-[130]" : "z-[100]"
        } ${
          isMobileMenuOpen || isScrolled
            ? "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-sm border-gray-100 dark:border-zinc-800"
            : "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-gray-100/50 dark:border-zinc-800/50"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto max-w-7xl flex h-20 lg:h-24 items-center justify-between px-6 lg:px-12">
          {/* Left Side: Logo & Nav Items */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link
              to={`/${lang}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green focus-visible:rounded-lg"
              aria-label="Starbucks Home"
            >
              <Logo className="h-10 lg:h-12 w-auto aspect-square object-contain hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* Desktop Nav Items */}
            <div
              className="hidden items-center gap-8 lg:flex h-full"
              role="menubar"
            >
              {navItems.map((item: NavItem) => (
                <NavLink
                  key={item.id}
                  to={`/${lang}${item.href}`}
                  onClick={() => handleNavClick(`/${lang}${item.href}`)}
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
          </div>

          {/* Right Side: Utilities */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Location */}
            <Tooltip
              content={t("navigation:navbar.tooltips.locations")}
              className="w-11 h-11"
            >
              <NavLink
                to={`/${lang}/locations`}
                className={({ isActive }) => `
                  group flex items-center justify-center h-11 w-11 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green
                  ${isActive ? "text-starbucks-green" : "text-starbucks-dark hover:text-starbucks-green dark:text-foreground-dark"}
                `}
                onClick={() => handleNavClick(`/${lang}/locations`)}
              >
                <MapPin className="h-5 w-5" />
              </NavLink>
            </Tooltip>

            {/* Search Button */}
            <Tooltip
              content={t("common:search")}
              className="w-11 h-11"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-full h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:scale-110 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green"
                aria-label={t("common:search")}
              >
                <Search className="h-5 w-5" />
              </Button>
            </Tooltip>

            {/* Language Toggle */}
            <Tooltip
              content={t("navigation:navbar.tooltips.language")}
              className="w-11 h-11"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="group relative flex items-center justify-center font-bold text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green"
              >
                <span className="text-sm font-black uppercase tracking-tighter">
                  {lang === "ar" ? "EN" : "AR"}
                </span>
              </Button>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip
              content={
                theme === "dark"
                  ? t("navigation:navbar.tooltips.light_mode")
                  : t("navigation:navbar.tooltips.dark_mode")
              }
              className="w-11 h-11"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green"
                aria-label={
                  theme === "dark"
                    ? t("navigation:navbar.tooltips.light_mode")
                    : t("navigation:navbar.tooltips.dark_mode")
                }
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={ANIMATION_CONFIG.TRANSITIONS.QUICK_ROTATE as any}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </Tooltip>

            {/* Account Button */}
            <Tooltip
              content={t("navigation:navbar.tooltips.account")}
              className="w-11 h-11"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-starbucks-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full h-11 w-11 transition-all hover:scale-110 active:scale-95 border-2 border-transparent hover:border-starbucks-green/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green"
                aria-label={t("navigation:navbar.tooltips.account")}
              >
                <User className="h-5 w-5" />
              </Button>
            </Tooltip>

            {/* Mobile Menu Button */}
            <Button
              ref={hamburgerButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-starbucks-dark dark:text-foreground-dark rounded-full h-11 w-11 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-starbucks-green"
              aria-label={isMobileMenuOpen ? t("common:close_menu") : t("common:open_menu")}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? "close" : "menu"}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={ANIMATION_CONFIG.TRANSITIONS.QUICK as any}
                  >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay - Outside nav to prevent backdrop-blur containment issues */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 lg:top-24 z-[110] lg:hidden">
            {/* Backdrop */}
            <motion.div
              {...ANIMATION_CONFIG.VARIANTS.FADE_IN}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Menu Content */}
            <motion.div
              ref={mobileMenuRef}
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
                        onClick={() => handleNavClick(`/${lang}${item.href}`)}
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
          </div>
        )}
      </AnimatePresence>
      <Suspense fallback={null}>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </Suspense>
      <Suspense fallback={null}>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </Suspense>

    </>
  );
}
