import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  Camera,
  Bell,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useOrders } from '@/hooks/queries/useOrders';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { UserRole } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { cn } from '@/lib/ui/cn';

/**
 * Profile Page Component
 * Displays user information and provides access to account settings and admin tools
 */
export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'admin'>('profile');

  // Check if user is admin
  const isAdmin = user?.role === UserRole.Admin || user?.role === UserRole.SuperAdmin;

  const tabs = [
    { id: 'profile', label: t('pages:profile.tabs.settings'), icon: Settings },
    { id: 'orders', label: t('pages:profile.tabs.orders'), icon: ShoppingBag },
    ...(isAdmin ? [{ id: 'admin', label: t('pages:profile.tabs.admin'), icon: ShieldCheck }] : []),
  ] as const;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="relative mb-8 bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800"
          {...ANIMATION_CONFIG.VARIANTS.SLIDE_UP}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-starbucks-green flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-zinc-800 shadow-md">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500 dark:text-zinc-400 mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-100 dark:border-green-900/30">
                  {t(`common:roles.${user.role.toLowerCase()}`, user.role)}
                </span>
                {user.phone && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-medium rounded-full border border-gray-200 dark:border-zinc-700">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={logout}
                className="rounded-full px-6 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('common:sign_out')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'orders' | 'admin')}
              className={cn(
                "relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-white dark:bg-zinc-900 text-starbucks-green shadow-sm"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-profile-tab"
                  className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl -z-10 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && <ProfileSettings user={user} />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'admin' && isAdmin && <AdminDashboard user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Sub-components for better organization

const ProfileSettings: React.FC<{ user: { firstName?: string; lastName?: string; email?: string } }> = ({ user }) => {
  const { t } = useTranslation(['pages', 'common']);
  
  const settingsItems = [
    { id: 'notifications', title: t('pages:profile.settings.notifications'), icon: Bell, description: t('pages:profile.settings.notifications_desc') },
    { id: 'payments', title: t('pages:profile.settings.payments'), icon: CreditCard, description: t('pages:profile.settings.payments_desc') },
    { id: 'addresses', title: t('pages:profile.settings.addresses'), icon: MapPin, description: t('pages:profile.settings.addresses_desc') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 h-full">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-starbucks-green" />
          {t('pages:profile.personal_info')}
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">{t('common:account')}</p>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">{t('common:auth.login_email', 'Email')}</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <Button variant="outline" className="w-full rounded-2xl">{t('pages:profile.personal_info')}</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {settingsItems.map((item) => (
          <button 
            key={item.id}
            className="w-full flex items-center justify-between p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-starbucks-green/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-starbucks-green/10 transition-colors">
                <item.icon className="w-5 h-5 text-gray-600 dark:text-zinc-400 group-hover:text-starbucks-green" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-500">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { useMyOrders } = useOrders();
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-starbucks-green"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('pages:profile.orders.empty_title')}</h3>
        <p className="text-gray-500 max-w-xs mb-8">
          {t('pages:profile.orders.empty_desc')}
        </p>
        <Button className="rounded-full px-8 bg-starbucks-green hover:bg-starbucks-green-dark">
          {t('common:menu')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6 hover:border-starbucks-green/30 transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">#{order.orderNumber}</p>
              <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase",
              order.status.toLowerCase() === 'completed' ? "bg-green-100 text-green-700" :
              order.status.toLowerCase() === 'cancelled' ? "bg-red-100 text-red-700" :
              "bg-blue-100 text-blue-700"
            )}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              {order.items.length} {t('common:items')}
            </p>
            <p className="font-bold text-starbucks-green">{order.total} {t('common:egp')}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC<{ user: unknown }> = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { dashboardStats, isLoadingDashboard } = useAnalytics();
  
  const handleExport = async (type: 'orders' | 'users') => {
    try {
      const { exportsService } = await import('@/services/admin/ExportsService');
      let blob: Blob;
      
      if (type === 'users') {
        blob = await exportsService.exportUsers();
      } else {
        blob = await exportsService.exportOrders();
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const adminLinks = [
    { id: 'users', title: t('pages:profile.admin.users'), count: dashboardStats?.totalUsers.toString() || '...', color: 'bg-blue-500' },
    { id: 'categories', title: t('pages:profile.admin.categories'), count: dashboardStats?.totalMenuItems.toString() || '...', color: 'bg-green-500' },
    { id: 'orders', title: t('pages:profile.admin.orders'), count: dashboardStats?.totalOrders.toString() || '...', color: 'bg-amber-500' },
    { id: 'settings', title: t('pages:profile.admin.settings'), count: dashboardStats?.totalLocations.toString() || '...', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { id: 'banners', title: t('pages:profile.admin.banners'), icon: Camera },
    { id: 'notifications', title: t('pages:profile.admin.notifications'), icon: Bell },
    { id: 'settings', title: t('pages:profile.admin.settings'), icon: Settings },
    { id: 'exports', title: t('pages:profile.admin.exports'), icon: LogOut }, // Using LogOut for export icon
  ];

  return (
    <div className="space-y-6">
      {isLoadingDashboard ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminLinks.map((link) => (
            <Card key={link.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer border-t-4" style={{ borderTopColor: link.color.replace('bg-', '') }}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{link.count}</p>
              <h4 className="text-lg font-bold">{link.title}</h4>
            </Card>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-starbucks-green text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">{t('pages:profile.admin.control_center')}</h3>
            <p className="text-green-50 max-w-md mb-6 opacity-90">
              {t('pages:profile.admin.control_center_desc')}
            </p>
            <Button variant="outline" className="bg-white text-starbucks-green border-white hover:bg-green-50 rounded-xl px-8">
              {t('pages:profile.admin.enter_panel')}
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <ShieldCheck className="absolute right-8 top-8 w-32 h-32 text-white/10" />
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button 
              key={action.id} 
              onClick={() => action.id === 'exports' ? handleExport('orders') : undefined}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-starbucks-green/30 transition-all group"
            >
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-starbucks-green/10 transition-colors mb-3">
                <action.icon className="w-6 h-6 text-gray-600 dark:text-zinc-400 group-hover:text-starbucks-green" />
              </div>
              <p className="text-sm font-semibold">{action.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
