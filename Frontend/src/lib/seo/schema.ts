export interface SchemaConfig {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

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

export function generateRestaurantSchema(): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Starbucks Egypt',
    image: 'https://starbucks.eg/restaurant.jpg',
    description: 'Premium coffee and drinks',
    url: 'https://starbucks.eg',
    telephone: '+20-100-123-4567',
    priceRange: '$$',
    servesCuisine: ['Coffee', 'Tea', 'Desserts'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Multiple Locations',
      addressLocality: 'Cairo',
      addressRegion: 'Cairo Governorate',
      postalCode: '11511',
      addressCountry: 'EG',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '1000',
    },
  };
}

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

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
}): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
}

export function generateLocalBusinessSchema(location: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  hours?: string;
}): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: location.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: 'Cairo',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.latitude,
      longitude: location.longitude,
    },
    telephone: location.phone,
    ...(location.hours && {
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: location.hours.split('-')[0],
        closes: location.hours.split('-')[1],
      },
    }),
  };
}

export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}): SchemaConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
  };
}

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
