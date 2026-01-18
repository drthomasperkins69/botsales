'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Clock,
  RefreshCw,
  ExternalLink,
  Tag,
  TrendingUp,
  Filter,
  ChevronRight,
  Rss,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { NEWS_CATEGORIES } from '@/types/news';
import { formatDate } from '@/lib/utils';

export default function BlogPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const fetchNews = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);

      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (refresh) params.set('refresh', 'true');

      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();

      setArticles(data.articles);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh every hour
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchNews(true);
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [autoRefresh, fetchNews]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In production, this would call an API to save the subscription
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      industry: 'bg-purple-100 text-purple-700',
      product: 'bg-blue-100 text-blue-700',
      review: 'bg-green-100 text-green-700',
      technology: 'bg-orange-100 text-orange-700',
      business: 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Robot News</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Latest news and updates from the world of consumer robotics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <Clock className="w-4 h-4" />
                <span>Updated {lastUpdated ? formatDate(lastUpdated) : 'Loading...'}</span>
              </div>
              <button
                onClick={() => fetchNews(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auto-refresh toggle and filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh hourly</span>
          </label>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Loading skeletons */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured article */}
              {featuredArticle && (
                <article className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <img
                        src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featuredArticle.category)}`}>
                          {featuredArticle.category.charAt(0).toUpperCase() + featuredArticle.category.slice(1)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                          {featuredArticle.title}
                        </h2>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span>{featuredArticle.source.name}</span>
                          <span>•</span>
                          <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">{featuredArticle.description}</p>
                    {featuredArticle.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredArticle.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={featuredArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              )}

              {/* Article grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group"
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={article.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </a>
                    <div className="p-4">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                          {article.title}
                        </h3>
                      </a>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source.name}</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Newsletter signup */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-semibold">Daily Robot News</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest robot news delivered to your inbox every morning.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Subscribed!
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              </div>

              {/* Trending topics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {['Robot Vacuums', 'DJI Drones', 'Boston Dynamics', 'AI Navigation', 'Smart Home', 'Lawn Robots'].map(
                    (topic, index) => (
                      <Link
                        key={topic}
                        href={`/search?q=${encodeURIComponent(topic)}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{topic}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* RSS Feed */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Rss className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">RSS Feed</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Subscribe to our RSS feed to stay updated with the latest robot news.
                </p>
                <a
                  href="/api/news/rss"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Get RSS Feed
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* News sources */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Our Sources</h3>
                <div className="space-y-2 text-sm">
                  {['TechCrunch', 'The Verge', 'Wired', 'Engadget', 'IEEE Spectrum'].map((source) => (
                    <div key={source} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {source}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
