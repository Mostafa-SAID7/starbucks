import { Camera, Bell, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AdminDashboard() {
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
    {
      id: 'users',
      title: t('pages:profile.admin.users'),
      count: dashboardStats?.totalUsers.toString() || '...',
      color: 'bg-blue-500',
    },
    {
      id: 'categories',
      title: t('pages:profile.admin.categories'),
      count: dashboardStats?.totalMenuItems.toString() || '...',
      color: 'bg-green-500',
    },
    {
      id: 'orders',
      title: t('pages:profile.admin.orders'),
      count: dashboardStats?.totalOrders.toString() || '...',
      color: 'bg-amber-500',
    },
    {
      id: 'settings',
      title: t('pages:profile.admin.settings'),
      count: dashboardStats?.totalLocations.toString() || '...',
      color: 'bg-purple-500',
    },
  ];

  const quickActions = [
    { id: 'banners', title: t('pages:profile.admin.banners'), icon: Camera },
    { id: 'notifications', title: t('pages:profile.admin.notifications'), icon: Bell },
    { id: 'settings', title: t('pages:profile.admin.settings'), icon: Settings },
    { id: 'exports', title: t('pages:profile.admin.exports'), icon: LogOut },
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
            <Card
              key={link.id}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer border-t-4"
              style={{ borderTopColor: link.color.replace('bg-', '') }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                {link.count}
              </p>
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
            <Button
              variant="outline"
              className="bg-white text-starbucks-green border-white hover:bg-green-50 rounded-xl px-8"
            >
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
              onClick={() => (action.id === 'exports' ? handleExport('orders') : undefined)}
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
}
