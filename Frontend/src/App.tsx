import { Suspense, useLayoutEffect, useEffect } from "react";
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
import * as Sentry from "@sentry/react";
import { queryClient } from "@/lib/api/queryClient";
import { initializeErrorMonitoring } from "@/lib/error/errorMonitoring";
import { ANIMATION_CONFIG } from "@/lib/core/constants";

// Layout & Components
import { MainLayout, SkipNav, ErrorBoundary } from "@/components";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";

// Route configuration
import { REDIRECT_ROUTES, PAGE_ROUTES } from "@/config/routes";

// Initialize error monitoring
initializeErrorMonitoring({
  enabled: import.meta.env.VITE_ERROR_MONITORING_ENABLED !== 'false',
  environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  debug: import.meta.env.MODE === 'development',
});

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

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect routes from old paths to language-prefixed paths */}
        {REDIRECT_ROUTES.map((route) => (
          <Route
            key={route.from}
            path={route.from}
            element={<Navigate to={route.to} replace />}
          />
        ))}

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
          {/* Render all page routes dynamically */}
          {PAGE_ROUTES.map((route) => {
            const Component = route.component;
            const SkeletonComponent = route.skeleton;

            return (
              <Route
                key={route.name}
                path={route.path}
                element={
                  <PageWrapper skeleton={<SkeletonComponent />}>
                    {route.props ? (
                      <Component {...route.props} />
                    ) : (
                      <Component />
                    )}
                  </PageWrapper>
                }
              />
            );
          })}

          {/* Account redirect */}
          <Route path="account" element={<Navigate to="profile" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Track page navigation for error monitoring
  useEffect(() => {
    const handleRouteChange = () => {
      // Breadcrumb will be added by useErrorMonitoring hook in components
    };

    return () => {
      handleRouteChange();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Sentry.ErrorBoundary fallback={<div>An error occurred</div>} showDialog>
          <Router>
            <SkipNav />
            <div id="main-content" />
            <AnimatedRoutes />
            <OfflineIndicator />
          </Router>
        </Sentry.ErrorBoundary>
      </ErrorBoundary>

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

