import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/ui/cn';
import { useAuth } from '@/hooks/auth/useAuth';
import { UserRole } from '@/types/common';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSettings } from './ProfileSettings';
import { OrderHistory } from './OrderHistory';
import { AdminDashboard } from './AdminDashboard';

export function ProfilePageContent() {
  const { t } = useTranslation(['pages']);
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'admin'>('profile');

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
        <ProfileHeader user={user} onLogout={logout} />

        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'orders' | 'admin')}
              className={cn(
                'relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-starbucks-green shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-profile-tab"
                  className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl -z-10 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
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
            {activeTab === 'admin' && isAdmin && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
