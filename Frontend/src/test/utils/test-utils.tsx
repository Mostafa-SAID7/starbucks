/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement } from 'react';
import { render, RenderOptions, renderHook, RenderHookOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorProvider from '@/contexts/ErrorContext';

// Create a custom render function that includes all providers
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const mockMenuData = {
  categories: [
    {
      id: 'cat1',
      name: { English: 'Drinks', Arabic: 'مشروبات' },
      slug: 'drinks',
      href: '/menu/drinks',
      subcategories: [
        {
          id: 'subcat1',
          name: { English: 'Coffee', Arabic: 'قهوة' },
          href: '/menu/drinks/coffee',
          items: [
            {
              id: 'item1',
              name: { English: 'Espresso', Arabic: 'إسبريسو' },
              href: '/menu/drinks/coffee/espresso',
              image: '/espresso.jpg',
            },
          ],
        },
      ],
    },
  ],
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <ErrorProvider>
        <ThemeProvider>
          <HelmetProvider>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                {children}
              </I18nextProvider>
            </BrowserRouter>
          </HelmetProvider>
        </ThemeProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) => render(ui, { wrapper: AllTheProviders, ...options });

const customRenderHook = <Result, Props>(
  render: (props: Props) => Result,
  options?: RenderHookOptions<Props>,
) => renderHook(render, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
