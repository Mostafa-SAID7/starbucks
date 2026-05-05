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
import { ANIMATIONS } from "@/constants";
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
const DeliveryPage = lazy(() =>
  import("@/pages/DeliveryPage").then((module) => ({
    default: module.DeliveryPage,
  })),
);
const AboutUsPage = lazy(() =>
  import("@/pages/AboutUsPage").then((module) => ({
    default: module.AboutUsPage,
  })),
);
const SustainabilityPage = lazy(() =>
  import("@/pages/SustainabilityPage").then((module) => ({
    default: module.SustainabilityPage,
  })),
);
const LocationsPage = lazy(() =>
  import("@/pages/LocationsPage").then((module) => ({
    default: module.LocationsPage,
  })),
);
const TermsOfUsePage = lazy(() =>
  import("@/pages/TermsOfUsePage").then((module) => ({
    default: module.TermsOfUsePage,
  })),
);
const PrivacyStatementPage = lazy(() =>
  import("@/pages/PrivacyStatementPage").then((module) => ({
    default: module.PrivacyStatementPage,
  })),
);
const ContactUsPage = lazy(() =>
  import("@/pages/ContactUsPage").then((module) => ({
    default: module.ContactUsPage,
  })),
);
const CookieNoticePage = lazy(() =>
  import("@/pages/CookieNoticePage").then((module) => ({
    default: module.CookieNoticePage,
  })),
);
const CommunityImpactPage = lazy(() =>
  import("@/pages/CommunityImpactPage").then((module) => ({
    default: module.CommunityImpactPage,
  })),
);
const NotFound = lazy(() =>
  import("@/pages/NotFound").then((module) => ({ default: module.NotFound })),
);

// Page Wrapper for transitions using centralized constants and specific skeletons
const PageWrapper = ({
  children,
  skeleton,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) => (
  <motion.div
    initial={ANIMATIONS.fadeInUp.initial}
    animate={ANIMATIONS.fadeInUp.animate}
    exit={{ opacity: 0, y: -10 }}
    transition={ANIMATIONS.fadeInUp.transition}
  >
    <Suspense
      fallback={
        skeleton || <div className="min-h-screen bg-white dark:bg-black" />
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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect root to default language */}
        <Route path="/" element={<Navigate to="/ar" replace />} />

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

          {/* Redirects to prevent 404s on generic sections */}
          <Route
            path="our-coffees"
            element={<Navigate to="menu/drinks" replace />}
          />
          <Route
            path="starbucks-middle-east"
            element={<Navigate to="about-us" replace />}
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
                <AboutUsPage />
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
            path="community-impact-starbucks"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <CommunityImpactPage />
              </PageWrapper>
            }
          />
          <Route
            path="privacy-statement"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <PrivacyStatementPage />
              </PageWrapper>
            }
          />
          <Route
            path="terms-of-use"
            element={
              <PageWrapper skeleton={<StaticPageSkeleton />}>
                <TermsOfUsePage />
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
                <CookieNoticePage />
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
