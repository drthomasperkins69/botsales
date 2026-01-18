export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: {
    name: string;
    url?: string;
  };
  author?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: 'industry' | 'product' | 'review' | 'technology' | 'business';
  tags?: string[];
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  category: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com', category: 'technology' },
  { id: 'theverge', name: 'The Verge', url: 'https://theverge.com', category: 'technology' },
  { id: 'wired', name: 'Wired', url: 'https://wired.com', category: 'technology' },
  { id: 'engadget', name: 'Engadget', url: 'https://engadget.com', category: 'technology' },
  { id: 'ieee', name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org', category: 'industry' },
  { id: 'roboticstoday', name: 'Robotics Today', url: 'https://roboticstoday.com', category: 'industry' },
];

export const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News' },
  { id: 'industry', name: 'Industry News' },
  { id: 'product', name: 'Product Launches' },
  { id: 'review', name: 'Reviews' },
  { id: 'technology', name: 'Technology' },
  { id: 'business', name: 'Business' },
];
