import { lazy, Suspense, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { ANIMATION_CONFIG } from "@/lib/constants";

// Layout & Components
import { MainLayout, SkipNav } from "@/components";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";

import {
  HomeSkeleton,
  MenuSkeleton,
  StaticPageSkeleton,
  ContactSkeleton,
} from "@/components/skeletons";

// Lazy loaded Pages for performance
const HomePage = lazy(() =>
  import("@/pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const MenuPage = lazy(() =>
  import("@/pages/MenuPage").then((module) => ({ default: module.MenuPage })),
);
const MenuCategoryPage = lazy(() =>
  import("@/pages/MenuCategoryPage").then((module) => ({
    default: module.MenuCategoryPage,
  })),
);
const MenuItemPage = lazy(() =>
  import("@/pages/MenuItemPage").then((module) => ({
    default: module.MenuItemPage,
  })),
);
const LocationsPage = lazy(() =>
  import("@/pages/LocationsPage").then((module) => ({
    default: module.LocationsPage,
  })),
);
const ContactUsPage = lazy(() =>
  import("@/pages/ContactUsPage").then((module) => ({
    default: module.ContactUsPage,
  })),
);
const SustainabilityPage = lazy(() =>
  import("@/pages").then((module) => ({
    default: module.SustainabilityPage,
  })),
);
const GenericPageWrapper = lazy(() =>
  import("@/pages").then((module) => ({ default: module.GenericPageWrapper })),
);
const NotFound = lazy(() =>
  import("@/pages").then((module) => ({ default: module.NotFound })),
);

// Data Imports for Generic Pages - REMOVED: Now using TanStack Query via GenericPageWrapper

// Page Wrapper for transitions using centralized constants and specific skeletons
const PageWrapper = ({
  children,
  skeleton,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) => (
  <motion.div
    {...ANIMATION_CONFIG.VARIANTS.FADE_IN}
    transition={{ duration: ANIMATION_CONFIG.DURATION_SEC.SLOW, ease: "easeInOut" }}
  >
    <Suspense
      fallback={skeleton || <div className="min-h-screen bg-background" />}
    >
      {children}
    </Suspense>
  </motion.div>
);

// Helper component to sync document direction with language and URL
const LanguageDirectionHandler = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  // useLayoutEffect: fires synchronously before paint — prevents direction flash
  useLayoutEffect(() => {
    if (lang && (lang === "ar" || lang === "en")) {
      const dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", lang);
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  return null;
};

// Helper component to handle non-prefixed menu redirects with parameters
const MenuRedirect = () => {
  const { categoryId, itemId } = useParams<{
    categoryId?: string;
    itemId?: string;
  }>();
  if (itemId)
    return <Navigate to={`/ar/menu/${categoryId}/${itemId}`} replace />;
  if (categoryId) return <Navigate to={`/ar/menu/${categoryId}`} replace />;
  return <Navigate to="/ar/menu" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { t } = useTranslation(["pages", "common"]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ... existing redirects ... */}
        <Route path="/" element={<Navigate to="/ar" replace />} />
        <Route path="/about-us" element={<Navigate to="/ar/about-us" replace />} />
        <Route path="/delivery" element={<Navigate to="/ar/delivery" replace />} />
        <Route path="/social-impact-sustainability" element={<Navigate to="/ar/social-impact-sustainability" replace />} />
        <Route path="/locations" element={<Navigate to="/ar/locations" replace />} />
        <Route path="/contact-us" element={<Navigate to="/ar/contact-us" replace />} />
        <Route path="/terms-of-use" element={<Navigate to="/ar/terms-of-use" replace />} />
        <Route path="/privacy-statement" element={<Navigate to="/ar/privacy-statement" replace />} />
        <Route path="/cookie-notice" element={<Navigate to="/ar/cookie-notice" replace />} />
        <Route path="/starbucks-middle-east" element={<Navigate to="/ar/starbucks-middle-east" replace />} />
        <Route path="/community-impact-starbucks" element={<Navigate to="/ar/community-impact-starbucks" replace />} />
        <Route path="/new-era-same-icons" element={<Navigate to="/ar/new-era-same-icons" replace />} />

        {/* Menu Redirects */}
        <Route path="/menu" element={<MenuRedirect />} />
        <Route path="/menu/:categoryId" element={<MenuRedirect />} />
        <Route path="/menu/:categoryId/:itemId" element={<MenuRedirect />} />

        {/* Language-prefixed routes */}
        <Route
          path="/:lang"
          element={
            <>
              <LanguageDirectionHandler />
              <MainLayout />
            </>
          }
        >
          <Route
            index
            element={
              <PageWrapper skeleton={<HomeSkeleton />}>
                <HomePage />
              </PageWrapper>
            }
          />
          <Route
            path="menu"
            element={
              <PageWrapper skeleton={<MenuSkeleton />}>
                <MenuPage />
              </PageWrapper>
            }
          />
          <Route
            path="menu/:categoryId"
            element={
              <PageWrapper skeleton={<MenuSkeleton />}>
                <MenuCategoryPage />
              </PageWrapper>
            }
          />
          <Route
            path="menu/:categoryId/:itemId"
            element={
              <PageWrapper skeleton={<MenuSkeleton />}>
                <MenuItemPage />
              </PageWrapper>
            }
          />
          <Route
            path="locations"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <LocationsPage />
              </PageWrapper>
            }
          />

          {/* Generic Pages */}
          <Route
            path="our-coffees"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="our-coffees"
                  seoTitle={t("pages:our-coffees.seoTitle", { defaultValue: "Our Coffees - Starbucks Egypt" })}
                />
              </PageWrapper>
            }
          />
          <Route
            path="starbucks-middle-east"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="middle-east"
                  seoTitle={t("pages:middle-east.seoTitle", { defaultValue: "Starbucks Middle East - Starbucks Egypt" })}
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />
          <Route
            path="community-impact-starbucks"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="community-impact"
                  seoTitle={t("pages:community-impact.seoTitle", { defaultValue: "Community Impact - Starbucks Egypt" })}
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />
          <Route
            path="new-era-same-icons"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="new-era"
                  seoTitle={t("pages:new-era.seoTitle", { defaultValue: "New Era. Same Icons. - Starbucks Egypt" })}
                />
              </PageWrapper>
            }
          />
          <Route path="account" element={<Navigate to="" replace />} />

          {/* Informational Pages */}
          <Route
            path="delivery"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="delivery"
                  seoTitle={t("pages:delivery.seoTitle", { defaultValue: "Delivery - Starbucks Egypt" })}
                />
              </PageWrapper>
            }
          />
          <Route
            path="about-us"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="about-us"
                  seoTitle={t("pages:about-us.seoTitle", { defaultValue: "About Us - Starbucks Egypt" })}
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />
          <Route
            path="social-impact-sustainability"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <SustainabilityPage />
              </PageWrapper>
            }
          />
          <Route
            path="privacy-statement"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="privacy-statement"
                  seoTitle={t("pages:privacy-statement.seoTitle", { defaultValue: "Privacy Statement - Starbucks Egypt" })}
                  showAccordion={true}
                  accordionSectionIndices={[1, 2, 3, 4]}
                />
              </PageWrapper>
            }
          />
          <Route
            path="terms-of-use"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="terms-of-use"
                  seoTitle={t("pages:terms-of-use.seoTitle", { defaultValue: "Terms of Use - Starbucks Egypt" })}
                  showAccordion={true}
                  accordionSectionIndices={[1, 2, 3, 4, 5]}
                  accordionTitle={{
                    ar: "شروط إضافية",
                    en: "Additional Terms",
                  }}
                />
              </PageWrapper>
            }
          />
          <Route
            path="contact-us"
            element={
              <PageWrapper skeleton={<ContactSkeleton />}>
                <ContactUsPage />
              </PageWrapper>
            }
          />
          <Route
            path="cookie-notice"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPageWrapper
                  slug="cookies"
                  seoTitle={t("pages:cookies.seoTitle", { defaultValue: "Cookie Notice - Starbucks Egypt" })}
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />

          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SkipNav />
        <div id="main-content" />
        <AnimatedRoutes />
        <OfflineIndicator />
      </Router>

      {/* Devtools - only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
