import type { 
  Location, 
  MenuItem,
  GenericPageData
} from '@/lib/schemas';

export interface SchemaConfig {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Standard Organization Schema
 */
export function generateOrganizationSchema(): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Starbucks Egypt',
    url: 'https://starbucks.eg',
    logo: 'https://starbucks.eg/logo.png',
    description: 'Premium coffee and drinks in Egypt',
    sameAs: [
      'https://www.facebook.com/StarbucksEgypt',
      'https://www.instagram.com/starbucksegypt',
      'https://www.twitter.com/StarbucksEgypt',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+20-100-123-4567',
      email: 'support@starbucks.eg',
    },
  };
}

/**
 * Breadcrumb Schema from page items
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Product Schema using MenuItem domain object
 */
export function generateProductSchema(product: MenuItem & { price?: number; currency?: string }): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.id, // Fallback to ID if name is missing in raw item
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: product.currency || 'EGP',
      availability: 'https://schema.org/InStock',
    },
  };
}

/**
 * LocalBusiness Schema using Location domain object
 */
export function generateLocalBusinessSchema(location: Location): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Starbucks ${location.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address || location.city || 'Egypt',
      addressLocality: location.city || 'Cairo',
      addressCountry: 'EG',
    },
    geo: location.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    } : undefined,
    telephone: location.phone,
  };
}

/**
 * FAQ Schema for pages with accordion/FAQ content
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
