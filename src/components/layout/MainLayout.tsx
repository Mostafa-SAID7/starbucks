import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MobileTabBar } from "./MobileTabBar";
import { Toaster } from "../ui/toaster";
import { ErrorBoundary } from "@/components";

// Lazy load non-critical components to optimize first paint
const Footer = lazy(() => import("./Footer").then(m => ({ default: m.Footer })));
const ScrollToTop = lazy(() => import("./ScrollToTop").then(m => ({ default: m.ScrollToTop })));
const CookieConsent = lazy(() => import("../widgets/CookieConsent").then(m => ({ default: m.CookieConsent })));
const ChatWidget = lazy(() => import("../widgets/ChatWidget").then(m => ({ default: m.ChatWidget })));

export const MainLayout = () => {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-1 overflow-visible">
          <Outlet />
        </main>
        
        <Suspense fallback={null}>
          <Footer />
          <MobileTabBar />
          <CookieConsent />
          <Toaster />
          <ChatWidget />
          <ScrollToTop />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;

