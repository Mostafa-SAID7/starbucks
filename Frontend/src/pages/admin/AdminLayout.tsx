import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Coffee,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/orders": "Orders Management",
  "/admin/products": "Products Management",
  "/admin/analytics": "Analytics & Reports",
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Admin";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans" dir="ltr">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col bg-[#1e3932] text-white transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[72px]" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 min-h-[72px]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#006241] flex items-center justify-center shrink-0 shadow-lg">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm leading-tight text-white truncate font-heading">Starbucks EG</p>
                <p className="text-xs text-green-300 truncate">Admin Portal</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-9 h-9 rounded-full bg-[#006241] flex items-center justify-center mx-auto shadow-lg">
              <Coffee className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-green-400/70">
              Navigation
            </p>
          )}
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-[#006241] text-white shadow-md"
                        : "text-green-200 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={["w-5 h-5 shrink-0", isActive ? "text-white" : "text-green-300 group-hover:text-white"].join(" ")} />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium truncate">{label}</span>
                      )}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
                          {label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {!sidebarCollapsed && (
            <>
              <div className="mt-6 mx-2 border-t border-white/10" />
              <p className="px-4 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-green-400/70">
                Quick Stats
              </p>
              <div className="px-2 space-y-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-300">Revenue Today</span>
                  </div>
                  <p className="text-base font-bold text-white">EGP 42,580</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3.5 h-3.5 text-[#cba258]" />
                    <span className="text-xs text-green-300">Active Now</span>
                  </div>
                  <p className="text-base font-bold text-white">1,284</p>
                </div>
              </div>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className={["flex items-center gap-3", sidebarCollapsed ? "justify-center" : ""].join(" ")}>
            <div className="w-9 h-9 rounded-full bg-[#006241] flex items-center justify-center shrink-0 shadow-md">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-green-300 truncate">admin@starbucks.eg</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-green-300 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shadow-sm shrink-0 min-h-[72px]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight font-heading">{pageTitle}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Starbucks Egypt — Admin Portal</p>
          </div>

          <div className="flex-1 max-w-sm hidden md:block ml-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#006241]/30 focus:border-[#006241] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#006241] flex items-center justify-center shadow-sm ml-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
