import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, MapPin, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";

import { navbar } from "@/data";

export function MobileTabBar() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  const lang = (
    urlLang && (urlLang === "ar" || urlLang === "en")
      ? urlLang
      : i18n.language === "ar"
        ? "ar"
        : "en"
  ) as "ar" | "en";
  const navData = navbar[lang].tabs;

  const tabs = [
    { id: "home", icon: Home, label: navData.home, path: `/${lang}` },
    {
      id: "menu",
      icon: ShoppingBag,
      label: navData.menu,
      path: `/${lang}/menu`,
    },
    {
      id: "locations",
      icon: MapPin,
      label: navData.locations,
      path: `/${lang}/locations`,
    },
    {
      id: "account",
      icon: User,
      label: navData.account,
      path: `/${lang}/account`,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-20 w-full items-center justify-around border-t bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)] transition-all dark:border-zinc-900 md:hidden">
      {tabs.map((tab) => {
        const isActive =
          tab.path === `/${lang}`
            ? location.pathname === `/${lang}` ||
              location.pathname === `/${lang}/`
            : location.pathname.startsWith(tab.path);

        return (
          <Link
            key={tab.id}
            to={tab.path}
            className="relative flex flex-col items-center justify-center gap-1 w-full h-full group active:scale-95 transition-transform"
          >
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={
                  isActive
                    ? "text-starbucks-green"
                    : "text-gray-400 dark:text-zinc-500"
                }
              >
                <tab.icon
                  className="h-6 w-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors mt-1 ${
                  isActive
                    ? "text-starbucks-green"
                    : "text-gray-400 dark:text-zinc-500"
                }`}
              >
                {tab.label}
              </span>
            </div>

            {isActive && (
              <motion.div
                layoutId="active-tab-pill"
                className="absolute inset-x-2 inset-y-2 rounded-2xl bg-starbucks-green/10 dark:bg-starbucks-green/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
