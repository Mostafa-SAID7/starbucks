import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/hooks';
import { useMenuData } from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  available: boolean;
  allergens?: string[];
}

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation(['pages', 'common']);
  const { isRTL } = useLanguage();
  const { addItem } = useCartStore();
  const { data: menuData, isLoading } = useMenuData();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <div className="min-h-screen bg-background animate-pulse" />;
  }

  const category = menuData?.categories?.find((c: any) => c.id === categoryId);
  const items: MenuItem[] = menuData?.items?.filter((item: MenuItem) => item.categoryId === categoryId) || [];

  const handleAddToCart = (item: MenuItem) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      1
    );

    // Show feedback
    setAddedItems(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={category?.name || 'Category'}
        description={category?.description || ''}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
            {category?.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {category?.description}
          </p>
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-zinc-800 group',
                !item.available && 'opacity-60'
              )}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                  aria-label={t('common:favorite')}
                >
                  <Heart
                    className={cn(
                      'w-5 h-5 transition-colors',
                      favorites.has(item.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    )}
                  />
                </button>

                {/* Availability Badge */}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold">{t('common:unavailable')}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1">
                    {item.allergens.map(allergen => (
                      <span
                        key={allergen}
                        className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-starbucks-green">
                    ${item.price.toFixed(2)}
                  </span>

                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.available}
                    size="sm"
                    className={cn(
                      'transition-all',
                      addedItems.has(item.id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-starbucks-green hover:bg-starbucks-green/90'
                    )}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addedItems.has(item.id) ? t('common:added') : t('common:add')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('pages:menu.noItems')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
