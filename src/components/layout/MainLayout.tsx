import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";
import { ScrollToTop } from "./ScrollToTop";
import { CookieConsent, ChatWidget } from "@/components";
import { Toaster } from "../ui/toaster";
import { ErrorBoundary } from "@/components";

export const MainLayout = () => {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-background-light text-foreground-light transition-colors duration-300 dark:bg-background-dark dark:text-foreground-dark">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0 overflow-visible">
          <Outlet />
        </main>
        <Footer />
        <MobileTabBar />
        <CookieConsent />
        <Toaster />
        <ChatWidget />
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
