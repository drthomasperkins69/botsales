import { NextResponse } from 'next/server';
import { getLatestNews } from '@/data/news';
import { NewsArticle } from '@/types/news';

// News API configuration - replace with your actual API keys
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const ENABLE_EXTERNAL_API = process.env.ENABLE_EXTERNAL_NEWS === 'true';

// Keywords to search for robot-related news
const ROBOT_KEYWORDS = [
  'robot vacuum',
  'home robot',
  'consumer robot',
  'drone',
  'robotic',
  'iRobot',
  'Roomba',
  'Boston Dynamics',
  'DJI',
  'autonomous robot',
];

async function fetchFromNewsAPI(): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY || !ENABLE_EXTERNAL_API) {
    return [];
  }

  try {
    const query = ROBOT_KEYWORDS.slice(0, 5).join(' OR ');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('NewsAPI request failed');
    }

    const data = await response.json();

    return data.articles.map((article: {
      title: string;
      description: string;
      content: string;
      source: { name: string };
      author: string;
      url: string;
      urlToImage: string;
      publishedAt: string;
    }, index: number) => ({
      id: `external-${index}-${Date.now()}`,
      title: article.title,
      description: article.description,
      content: article.content,
      source: { name: article.source.name },
      author: article.author,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      category: categorizeArticle(article.title + ' ' + article.description),
      tags: extractTags(article.title + ' ' + article.description),
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

function categorizeArticle(text: string): NewsArticle['category'] {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('review') || lowerText.includes('tested') || lowerText.includes('hands-on')) {
    return 'review';
  }
  if (lowerText.includes('launch') || lowerText.includes('announce') || lowerText.includes('unveil') || lowerText.includes('release')) {
    return 'product';
  }
  if (lowerText.includes('acquire') || lowerText.includes('invest') || lowerText.includes('billion') || lowerText.includes('million') || lowerText.includes('market')) {
    return 'business';
  }
  if (lowerText.includes('industry') || lowerText.includes('standard') || lowerText.includes('regulation')) {
    return 'industry';
  }
  return 'technology';
}

function extractTags(text: string): string[] {
  const tagKeywords = [
    'iRobot', 'Roomba', 'Roborock', 'Ecovacs', 'DJI', 'Boston Dynamics',
    'Sony', 'Amazon', 'Xiaomi', 'Samsung', 'LG', 'Husqvarna', 'Skydio',
    'AI', 'autonomous', 'drone', 'vacuum', 'robot dog', 'lawn mower',
    'smart home', 'STEM', 'education', 'delivery', 'security',
  ];

  const lowerText = text.toLowerCase();
  return tagKeywords.filter(tag => lowerText.includes(tag.toLowerCase()));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '20');
  const refresh = searchParams.get('refresh') === 'true';

  try {
    // Try to fetch from external API first
    let articles: NewsArticle[] = [];

    if (ENABLE_EXTERNAL_API && refresh) {
      const externalArticles = await fetchFromNewsAPI();
      if (externalArticles.length > 0) {
        articles = externalArticles;
      }
    }

    // Fall back to mock data if no external articles
    if (articles.length === 0) {
      articles = getLatestNews();
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      articles = articles.filter(article => article.category === category);
    }

    // Limit results
    articles = articles.slice(0, limit);

    // Add cache headers for auto-refresh
    return NextResponse.json(
      {
        articles,
        lastUpdated: new Date().toISOString(),
        source: ENABLE_EXTERNAL_API ? 'mixed' : 'internal',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
