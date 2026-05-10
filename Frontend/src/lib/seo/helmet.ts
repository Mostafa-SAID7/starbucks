export interface MetaTagsConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  author?: string;
  keywords?: string[];
  locale?: 'en_US' | 'ar_EG';
  twitterHandle?: string;
  canonical?: string;
}

export function generateMetaTags(config: MetaTagsConfig) {
  const {
    title,
    description,
    image = 'https://starbucks.eg/og-image.jpg',
    url = 'https://starbucks.eg',
    type = 'website',
    author = 'Starbucks Egypt',
    keywords = [],
    locale = 'en_US',
    twitterHandle = '@StarbucksEgypt',
    canonical,
  } = config;

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'keywords',
        content: keywords.join(', '),
      },
      {
        name: 'author',
        content: author,
      },
      // Open Graph
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:image',
        content: image,
      },
      {
        property: 'og:url',
        content: url,
      },
      {
        property: 'og:type',
        content: type,
      },
      {
        property: 'og:locale',
        content: locale,
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: image,
      },
      {
        name: 'twitter:creator',
        content: twitterHandle,
      },
      // Viewport
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      // Theme color
      {
        name: 'theme-color',
        content: '#00704A',
      },
    ],
    link: canonical
      ? [
        {
          rel: 'canonical',
          href: canonical,
        },
      ]
      : [],
  };
}

export const pageMetaTags = {
  home: {
    title: 'Starbucks Egypt - Premium Coffee & Drinks',
    description: 'Discover premium coffee, tea, and food at Starbucks Egypt. Order online for delivery or pickup.',
    keywords: ['coffee', 'starbucks', 'egypt', 'cairo', 'drinks', 'tea'],
  },
  menu: {
    title: 'Starbucks Egypt - Menu',
    description: 'Browse our full menu of premium coffee drinks, teas, and food items.',
    keywords: ['menu', 'coffee', 'drinks', 'food', 'starbucks'],
  },
  locations: {
    title: 'Starbucks Egypt - Find Our Locations',
    description: 'Find the nearest Starbucks location in Egypt. View hours, phone, and directions.',
    keywords: ['locations', 'stores', 'cairo', 'egypt', 'directions'],
  },
  order: {
    title: 'Order Coffee Online - Starbucks Egypt',
    description: 'Order your favorite coffee and food online for delivery or pickup.',
    keywords: ['order', 'delivery', 'pickup', 'online', 'coffee'],
  },
  about: {
    title: 'About Starbucks Egypt',
    description: 'Learn about Starbucks Egypt, our mission, and our commitment to quality.',
    keywords: ['about', 'mission', 'starbucks', 'egypt'],
  },
  contact: {
    title: 'Contact Starbucks Egypt',
    description: 'Get in touch with Starbucks Egypt. We are here to help.',
    keywords: ['contact', 'support', 'help', 'starbucks'],
  },
};
