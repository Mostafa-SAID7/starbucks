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

// Layout & Components
import { MainLayout, SkipNav } from "@/components";

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
const DeliveryPage = lazy(() =>
  import("@/pages").then((module) => ({ default: module.DeliveryPage })),
);
const SustainabilityPage = lazy(() =>
  import("@/pages").then((module) => ({ default: module.SustainabilityPage })),
);
const MiddleEastPage = lazy(() =>
  import("@/pages").then((module) => ({ default: module.MiddleEastPage })),
);
const GenericPage = lazy(() =>
  import("@/pages").then((module) => ({ default: module.GenericPage })),
);
const NotFound = lazy(() =>
  import("@/pages").then((module) => ({ default: module.NotFound })),
);

// Data Imports for Generic Pages
import { 
  communityImpact, 
  privacyStatement,
  aboutUs,
  newEra,
  termsOfUse,
  ourCoffees,
  cookies,
} from "@/data";
import { type GenericPageData } from "@/types";

// Page Wrapper for transitions using centralized constants and specific skeletons
const PageWrapper = ({
  children,
  skeleton,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <Suspense
      fallback={
        skeleton || <div className="min-h-screen bg-background" />
      }
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
  const { categoryId, itemId } = useParams<{ categoryId?: string; itemId?: string }>();
  if (itemId) return <Navigate to={`/ar/menu/${categoryId}/${itemId}`} replace />;
  if (categoryId) return <Navigate to={`/ar/menu/${categoryId}`} replace />;
  return <Navigate to="/ar/menu" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect root to default language */}
        <Route path="/" element={<Navigate to="/ar" replace />} />

        {/* Top-level redirects to handle non-prefixed URLs */}
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
        <Route path="/:lang" element={<><LanguageDirectionHandler /><MainLayout /></>}>
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
                <GenericPage 
                  data={ourCoffees as GenericPageData} 
                  seoTitle="Our Coffees - Starbucks Egypt" 
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />
          <Route
            path="starbucks-middle-east"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <MiddleEastPage />
              </PageWrapper>
            }
          />
          <Route
            path="community-impact-starbucks"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPage 
                  data={communityImpact as GenericPageData} 
                  seoTitle="Community Impact - Starbucks Egypt" 
                  useAccordionLayout={true}
                />
              </PageWrapper>
            }
          />
          <Route
            path="new-era-same-icons"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPage 
                  data={newEra as GenericPageData} 
                  seoTitle="New Era. Same Icons. - Starbucks Egypt" 
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
                <DeliveryPage />
              </PageWrapper>
            }
          />
          <Route
            path="about-us"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <GenericPage 
                  data={aboutUs as GenericPageData} 
                  seoTitle="About Us - Starbucks Egypt" 
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
                <GenericPage
                  data={privacyStatement as unknown as GenericPageData}
                  seoTitle="Privacy Statement - Starbucks Egypt"
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
                <GenericPage 
                  data={termsOfUse as GenericPageData} 
                  seoTitle="Terms of Use - Starbucks Egypt" 
                  showAccordion={true}
                  accordionSectionIndices={[1, 2, 3, 4, 5]}
                  accordionTitle={{
                    ar: "شروط إضافية",
                    en: "Additional Terms"
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
                <GenericPage 
                  data={cookies.pageData as GenericPageData} 
                  seoTitle="Cookie Notice - Starbucks Egypt" 
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
    <Router>
      <SkipNav />
      <div id="main-content" />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
