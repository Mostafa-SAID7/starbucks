import { User, Bell, CreditCard, MapPin, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProfileSettingsProps {
  user: { firstName?: string; lastName?: string; email?: string };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const { t } = useTranslation(['pages', 'common']);

  const settingsItems = [
    {
      id: 'notifications',
      title: t('pages:profile.settings.notifications'),
      icon: Bell,
      description: t('pages:profile.settings.notifications_desc'),
    },
    {
      id: 'payments',
      title: t('pages:profile.settings.payments'),
      icon: CreditCard,
      description: t('pages:profile.settings.payments_desc'),
    },
    {
      id: 'addresses',
      title: t('pages:profile.settings.addresses'),
      icon: MapPin,
      description: t('pages:profile.settings.addresses_desc'),
    },
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
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">{t('common:auth.login_email', 'Email')}</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <Button variant="outline" className="w-full rounded-2xl">
            {t('pages:profile.personal_info')}
          </Button>
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
}
