import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, CreditCard, Receipt, CircleDollarSign } from 'lucide-react';

export type PaymentMethod =
  | 'Cash'
  | 'Fawry'
  | 'Vodafone'
  | 'Orange'
  | 'Etisalat'
  | 'Stripe'
  | 'PaymobCard';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  walletPhoneNumber: string;
  onWalletPhoneChange: (phone: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  walletPhoneNumber,
  onWalletPhoneChange,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const methods = [
    {
      id: 'PaymobCard' as PaymentMethod,
      nameEn: 'Credit/Debit Card (Local)',
      nameAr: 'بطاقة ائتمان / خصم (محلية)',
      icon: CreditCard,
      color: 'border-blue-500 text-blue-600 bg-blue-50/10 hover:bg-blue-50/20',
      activeColor: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20',
    },
    {
      id: 'Stripe' as PaymentMethod,
      nameEn: 'International Card (Stripe)',
      nameAr: 'بطاقة دولية (Stripe)',
      icon: CreditCard,
      color: 'border-indigo-500 text-indigo-600 bg-indigo-50/10 hover:bg-indigo-50/20',
      activeColor: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20',
    },
    {
      id: 'Fawry' as PaymentMethod,
      nameEn: 'Fawry Pay',
      nameAr: 'فوري',
      icon: Receipt,
      color: 'border-amber-500 text-amber-600 bg-amber-50/10 hover:bg-amber-50/20',
      activeColor: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20',
    },
    {
      id: 'Vodafone' as PaymentMethod,
      nameEn: 'Vodafone Cash',
      nameAr: 'فودافون كاش',
      icon: Wallet,
      color: 'border-red-500 text-red-600 bg-red-50/10 hover:bg-red-50/20',
      activeColor: 'ring-2 ring-red-500 border-red-500 bg-red-50/20',
    },
    {
      id: 'Orange' as PaymentMethod,
      nameEn: 'Orange Cash',
      nameAr: 'أورنج كاش',
      icon: Wallet,
      color: 'border-orange-500 text-orange-600 bg-orange-50/10 hover:bg-orange-50/20',
      activeColor: 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/20',
    },
    {
      id: 'Etisalat' as PaymentMethod,
      nameEn: 'Etisalat Cash',
      nameAr: 'اتصالات كاش',
      icon: Wallet,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50/10 hover:bg-emerald-50/20',
      activeColor: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20',
    },
    {
      id: 'Cash' as PaymentMethod,
      nameEn: 'Cash on Delivery',
      nameAr: 'الدفع عند الاستلام',
      icon: CircleDollarSign,
      color: 'border-emerald-800 text-emerald-800 bg-emerald-50/10 hover:bg-emerald-50/20',
      activeColor: 'ring-2 ring-emerald-800 border-emerald-800 bg-emerald-50/20',
    },
  ];

  const isWallet = ['Vodafone', 'Orange', 'Etisalat'].includes(selectedMethod);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {isRTL ? 'طريقة الدفع' : 'Payment Method'}
        </h3>
        <p className="text-sm text-gray-500">
          {isRTL ? 'اختر طريقة الدفع المناسبة لك' : 'Select your preferred payment method'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => {
          const Icon = method.icon;
          const isActive = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`flex items-center p-4 border rounded-xl transition-all duration-200 text-left ${
                isRTL ? 'text-right' : ''
              } ${isActive ? method.activeColor : method.color}`}
            >
              <div className="p-3 rounded-lg bg-white/80 shadow-sm mr-4 ml-0 rtl:ml-4 rtl:mr-0">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-semibold text-gray-900">
                  {isRTL ? method.nameAr : method.nameEn}
                </span>
                <span className="block text-xs text-gray-500 mt-1">
                  {method.id === 'Cash'
                    ? (isRTL ? 'ادفع نقداً عند استلام طلبك' : 'Pay when order arrives')
                    : (isRTL ? 'دفع آمن عبر الإنترنت' : 'Secure online payment')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isWallet && (
        <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl space-y-3 animate-fadeIn">
          <label className="block text-sm font-medium text-gray-700">
            {isRTL ? 'رقم محفظة الهاتف المحمول (مثال: 010xxxxxxxx)' : 'Mobile Wallet Number (e.g. 010xxxxxxxx)'}
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="tel"
              value={walletPhoneNumber}
              onChange={(e) => onWalletPhoneChange(e.target.value)}
              placeholder={isRTL ? '01xxxxxxxxx' : '01xxxxxxxxx'}
              className="block w-full rounded-lg border-gray-300 pl-4 pr-4 py-3 focus:border-red-500 focus:ring-red-500 text-gray-900 border"
              maxLength={11}
            />
          </div>
          <p className="text-xs text-gray-500">
            {isRTL
              ? 'يرجى إدخال رقم الهاتف المحمول المرتبط بمحفظتك لتلقي طلب الدفع.'
              : 'Please enter the mobile number linked to your wallet to receive the payment request.'}
          </p>
        </div>
      )}
    </div>
  );
};
