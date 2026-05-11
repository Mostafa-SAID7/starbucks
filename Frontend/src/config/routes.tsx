import { lazy, ComponentType } from 'react';
import MiddleEastPage from '@/pages/MiddleEastPage/MiddleEastPage';
import { DeliveryPage } from '@/pages/DeliveryPage/DeliveryPage';
import { HomeSkeleton, MenuSkeleton, StaticPageSkeleton, ContactSkeleton, LocationsSkeleton } from '@/components/skeletons';

/**
 * Route configuration type
 */
export interface PageRoute {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any> | React.LazyExoticComponent<ComponentType<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skeleton: ComponentType<any>;
  name: string;
  props?: Record<string, unknown>;
}

// Lazy loaded Pages for performance
// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
);

// eslint-disable-next-line react-refresh/only-export-components
const MenuPage = lazy(() =>
  import('@/pages/MenuPage').then((module) => ({ default: module.MenuPage }))
);

// eslint-disable-next-line react-refresh/only-export-components
const MenuCategoryPage = lazy(() =>
  import('@/pages/MenuCategoryPage').then((module) => ({
    default: module.MenuCategoryPage,
  }))
);

// eslint-disable-next-line react-refresh/only-export-components
const MenuItemPage = lazy(() =>
  import('@/pages/MenuItemPage').then((module) => ({
    default: module.MenuItemPage,
  }))
);

// eslint-disable-next-line react-refresh/only-export-components
const LocationsPage = lazy(() =>
  import('@/pages/LocationsPage').then((module) => ({
    default: module.LocationsPage,
  }))
);

// eslint-disable-next-line react-refresh/only-export-components
const ContactUsPage = lazy(() =>
  import('@/pages/ContactUsPage').then((module) => ({
    default: module.ContactUsPage,
  }))
);

// eslint-disable-next-line react-refresh/only-export-components
const SustainabilityPage = lazy(() =>
  import('@/pages').then((module) => ({
    default: module.SustainabilityPage,
  }))
);

// eslint-disable-next-line react-refresh/only-export-components
const GenericPageWrapper = lazy(() =>
  import('@/pages').then((module) => ({ default: module.GenericPageWrapper }))
);

const CheckoutPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.CheckoutPage }))
);

const OrderConfirmationPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.OrderConfirmationPage }))
);

// eslint-disable-next-line react-refresh/only-export-components
const NotFound = lazy(() =>
  import('@/pages').then((module) => ({ default: module.NotFound }))
);

/**
 * Route redirect mappings
 * Maps old routes to new language-prefixed routes
 */
export const REDIRECT_ROUTES = [
  { from: '/', to: '/ar' },
  { from: '/about-us', to: '/ar/about-us' },
  { from: '/delivery', to: '/ar/delivery' },
  { from: '/social-impact-sustainability', to: '/ar/social-impact-sustainability' },
  { from: '/locations', to: '/ar/locations' },
  { from: '/contact-us', to: '/ar/contact-us' },
  { from: '/terms-of-use', to: '/ar/terms-of-use' },
  { from: '/privacy-statement', to: '/ar/privacy-statement' },
  { from: '/cookie-notice', to: '/ar/cookie-notice' },
  { from: '/starbucks-middle-east', to: '/ar/starbucks-middle-east' },
  { from: '/community-impact-starbucks', to: '/ar/community-impact-starbucks' },
  { from: '/new-era-same-icons', to: '/ar/new-era-same-icons' },
];

/**
 * Menu redirect routes
 */
export const MENU_REDIRECT_ROUTES = [
  { from: '/menu', to: '/ar/menu' },
  { from: '/menu/:categoryId', to: '/ar/menu/:categoryId' },
  { from: '/menu/:categoryId/:itemId', to: '/ar/menu/:categoryId/:itemId' },
];

/**
 * Page route configuration
 * Defines all language-prefixed routes with their components and skeletons
 */
export const PAGE_ROUTES: PageRoute[] = [
  {
    path: '',
    component: HomePage,
    skeleton: HomeSkeleton,
    name: 'home',
  },
  {
    path: 'menu',
    component: MenuPage,
    skeleton: MenuSkeleton,
    name: 'menu',
  },
  {
    path: 'menu/:categoryId',
    component: MenuCategoryPage,
    skeleton: MenuSkeleton,
    name: 'menu-category',
  },
  {
    path: 'menu/:categoryId/:itemId',
    component: MenuItemPage,
    skeleton: MenuSkeleton,
    name: 'menu-item',
  },
  {
    path: 'locations',
    component: LocationsPage,
    skeleton: LocationsSkeleton,
    name: 'locations',
  },
  {
    path: 'our-coffees',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'our-coffees',
    props: {
      slug: 'our-coffees',
      seoTitle: 'Our Coffees - Starbucks Egypt',
    },
  },
  {
    path: 'starbucks-middle-east',
    component: MiddleEastPage,
    skeleton: StaticPageSkeleton,
    name: 'middle-east',
  },
  {
    path: 'community-impact-starbucks',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'community-impact',
    props: {
      slug: 'community-impact',
      seoTitle: 'Community Impact - Starbucks Egypt',
      useAccordionLayout: true,
    },
  },
  {
    path: 'new-era-same-icons',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'new-era',
    props: {
      slug: 'new-era',
      seoTitle: 'New Era. Same Icons. - Starbucks Egypt',
    },
  },
  {
    path: 'delivery',
    component: DeliveryPage,
    skeleton: StaticPageSkeleton,
    name: 'delivery',
  },
  {
    path: 'about-us',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'about-us',
    props: {
      slug: 'about-us',
      seoTitle: 'About Us - Starbucks Egypt',
      useAccordionLayout: true,
    },
  },
  {
    path: 'social-impact-sustainability',
    component: SustainabilityPage,
    skeleton: StaticPageSkeleton,
    name: 'sustainability',
  },
  {
    path: 'privacy-statement',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'privacy',
    props: {
      slug: 'privacy-statement',
      seoTitle: 'Privacy Statement - Starbucks Egypt',
      showAccordion: true,
      accordionSectionIndices: [1, 2, 3, 4],
    },
  },
  {
    path: 'terms-of-use',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'terms',
    props: {
      slug: 'terms-of-use',
      seoTitle: 'Terms of Use - Starbucks Egypt',
      showAccordion: true,
      accordionSectionIndices: [1, 2, 3, 4, 5],
      accordionTitle: {
        ar: 'شروط إضافية',
        en: 'Additional Terms',
      },
    },
  },
  {
    path: 'contact-us',
    component: ContactUsPage,
    skeleton: ContactSkeleton,
    name: 'contact',
  },
  {
    path: 'cookie-notice',
    component: GenericPageWrapper,
    skeleton: StaticPageSkeleton,
    name: 'cookies',
    props: {
      slug: 'cookies',
      seoTitle: 'Cookie Notice - Starbucks Egypt',
      useAccordionLayout: true,
    },
  },
  {
    path: 'checkout',
    component: CheckoutPage,
    skeleton: StaticPageSkeleton,
    name: 'checkout',
  },
  {
    path: 'order/:orderId',
    component: OrderConfirmationPage,
    skeleton: StaticPageSkeleton,
    name: 'order-confirmation',
  },
  {
    path: '*',
    component: NotFound,
    skeleton: StaticPageSkeleton,
    name: 'not-found',
  },
];
