import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useOptimisticOrder } from '@/hooks/business/useOptimisticOrder';
import { useLanguage } from '@/hooks';
import { SEO } from '@/components';
import { CheckoutHeader } from './CheckoutHeader';
import { DeliveryFormSection } from './DeliveryFormSection';
import { OrderSummary } from './OrderSummary';
import { EmptyCartView } from './EmptyCartView';
import type { DeliveryForm } from './types';

export function CheckoutPageContent() {
  const { t, i18n } = useTranslation(['pages']);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const { items, total } = useCartStore();
  const { createOrder, isLoading, optimisticOrder } = useOptimisticOrder({
    onSuccess: (order: { id: string }) => {
      navigate(`/${i18n.language}/order/${order.id}`);
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
    },
  });

  const [form, setForm] = useState<DeliveryForm>({
    address: '',
    phone: '',
    notes: '',
    deliveryMethod: 'delivery',
  });

  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});

  // Redirect if cart is empty
  if (items.length === 0 && !optimisticOrder) {
    return <EmptyCartView />;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryForm> = {};
    if (!form.address.trim()) newErrors.address = t('pages:checkout.addressRequired');
    if (!form.phone.trim()) {
      newErrors.phone = t('pages:checkout.phoneRequired');
    } else if (!/^\+?[0-9]{10,}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('pages:checkout.phoneInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await createOrder({
      items: items.map((item) => ({
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title={t('pages:checkout.title')} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-10">
            <DeliveryFormSection
              form={form}
              errors={errors}
              onChange={setForm}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <OrderSummary onPlaceOrder={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
