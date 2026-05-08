import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../__mocks__/i18n';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const AllTheProviders = ({ children, queryClient }: AllTheProvidersProps) => {
  const testQueryClient = queryClient || createTestQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <HelmetProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </HelmetProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock user interactions
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'Customer' as const,
};

// Mock menu data
export const mockMenuData = {
  categories: [
    {
      id: 'drinks',
      name: { en: 'Drinks', ar: 'المشروبات' },
      image: '/test-image.jpg',
      href: '/menu/drinks',
      subcategories: [
        {
          id: 'espresso',
          name: { en: 'Espresso', ar: 'إسبريسو' },
          image: '/test-image.jpg',
          href: '/menu/drinks/espresso',
          items: [
            {
              id: 'caffe-latte',
              name: { en: 'Caffè Latte', ar: 'كافيه لاتيه' },
              image: '/test-image.jpg',
            },
          ],
        },
      ],
    },
  ],
};

// Mock location data
export const mockLocationData = [
  {
    id: '1',
    name: { en: 'Cairo Mall', ar: 'مول القاهرة' },
    address: { en: '123 Main St, Cairo', ar: '123 شارع الرئيسي، القاهرة' },
    city: 'Cairo',
    governorate: 'Cairo',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    features: ['wifi', 'parking'],
    operatingHours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      // ... other days
    },
  },
];

export * from '@testing-library/react';
export { customRender as render, createTestQueryClient };