'use client';

import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Users, Zap, Star, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import ListingCard from '@/components/listings/ListingCard';
import CategoryCard from '@/components/listings/CategoryCard';
import { ROBOT_CATEGORIES, ROBOT_BRANDS } from '@/types';
import { useListingsStore } from '@/store';

export default function HomePage() {
  const { getFeaturedListings, getRecentListings, listings } = useListingsStore();

  const featuredListings = getFeaturedListings();
  const recentListings = getRecentListings(8);

  // Get category counts
  const categoryCounts = ROBOT_CATEGORIES.map((cat) => ({
    ...cat,
    count: listings.filter((l) => l.category === cat.id && l.status === 'active').length,
  }));

  // Get popular brands with counts
  const brandCounts = ROBOT_BRANDS.slice(0, 8).map((brand) => ({
    name: brand,
    count: listings.filter((l) => l.brand === brand && l.status === 'active').length,
  })).filter((b) => b.count > 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Find Your Perfect Robot
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Australia&apos;s largest marketplace for buying and selling consumer robots
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{listings.length}+</div>
              <div className="text-blue-200 text-sm">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10+</div>
              <div className="text-blue-200 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">5K+</div>
              <div className="text-blue-200 text-sm">Happy Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">4.9</div>
              <div className="text-blue-200 text-sm flex items-center justify-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-600 mt-1">Find robots for every need</p>
            </div>
            <Link
              href="/search"
              className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryCounts.slice(0, 10).map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                description={category.description}
                count={category.count}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Listings</h2>
                <p className="text-gray-600 mt-1">Hand-picked robots for you</p>
              </div>
              <Link
                href="/search?featured=true"
                className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Featured
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Listings</h2>
              <p className="text-gray-600 mt-1">Fresh arrivals on the market</p>
            </div>
            <Link
              href="/search?sortBy=newest"
              className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/search?sortBy=newest"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Listings
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Brands</h2>
            <p className="text-gray-600 mt-1">Shop by your favorite robot brands</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {brandCounts.map((brand) => (
              <Link
                key={brand.name}
                href={`/search?brand=${encodeURIComponent(brand.name)}`}
                className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition group"
              >
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                  {brand.name}
                </span>
                <span className="ml-2 text-sm text-gray-500">({brand.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BotSales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose BotSales?</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              We&apos;re committed to making robot buying and selling simple, safe, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600 text-sm">
                Your safety is our priority. We verify sellers and protect your transactions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Community</h3>
              <p className="text-gray-600 text-sm">
                Join thousands of robot enthusiasts buying and selling with confidence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fair Pricing</h3>
              <p className="text-gray-600 text-sm">
                Our valuation tools help you get the best price for your robots.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Easy</h3>
              <p className="text-gray-600 text-sm">
                List your robot in minutes and connect with buyers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to sell your robot?
              </h2>
              <p className="text-blue-100">
                Create a listing in minutes and reach thousands of potential buyers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sell"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center"
              >
                Sell Your Robot
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
              <Link
                href="/value-my-robot"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition flex items-center justify-center"
              >
                Value My Robot
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
