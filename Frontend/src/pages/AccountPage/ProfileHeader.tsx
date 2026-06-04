import { motion } from 'framer-motion';
import { Camera, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { useAuth } from '@/hooks/auth/useAuth';

interface ProfileHeaderProps {
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
  onLogout: () => void;
}

export function ProfileHeader({ user, onLogout }: ProfileHeaderProps) {
  const { t } = useTranslation(['common']);

  return (
    <motion.div
      className="relative mb-8 bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800"
      {...ANIMATION_CONFIG.VARIANTS.SLIDE_UP}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-starbucks-green flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-zinc-800 shadow-md">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
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
            onClick={onLogout}
            className="rounded-full px-6 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('common:sign_out')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
