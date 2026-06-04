import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOrders } from '@/hooks/queries/useOrders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/ui/cn';

export function OrderHistory() {
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
        <p className="text-gray-500 max-w-xs mb-8">{t('pages:profile.orders.empty_desc')}</p>
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
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-bold uppercase',
                order.status.toLowerCase() === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : order.status.toLowerCase() === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              )}
            >
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              {order.items.length} {t('common:items')}
            </p>
            <p className="font-bold text-starbucks-green">
              {order.total} {t('common:egp')}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
