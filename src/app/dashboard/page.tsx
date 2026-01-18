'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Bot,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  PlusCircle,
  Eye,
  TrendingUp,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore, useListingsStore, useMessagesStore, useSavedSearchesStore } from '@/store';
import { formatPrice, formatDate } from '@/lib/utils';
import ListingCard from '@/components/listings/ListingCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { listings, favorites, getListingsByUser } = useListingsStore();
  const { getUnreadCount, getConversationsByUser } = useMessagesStore();
  const { savedSearches } = useSavedSearchesStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userListings = getListingsByUser(user.id);
  const activeListings = userListings.filter((l) => l.status === 'active');
  const unreadCount = getUnreadCount(user.id);
  const conversations = getConversationsByUser(user.id);
  const favoritedListings = listings.filter((l) => favorites.includes(l.id));

  // Calculate stats
  const totalViews = activeListings.reduce((acc, l) => acc + l.views, 0);
  const totalFavorites = activeListings.reduce((acc, l) => acc + l.favorites, 0);

  const quickStats = [
    { label: 'Active Listings', value: activeListings.length, icon: Bot, color: 'blue' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'green' },
    { label: 'Messages', value: unreadCount, icon: MessageSquare, color: 'purple' },
    { label: 'Saved Robots', value: favorites.length, icon: Heart, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your listings</p>
          </div>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Create Listing
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue'
                      ? 'bg-blue-100 text-blue-600'
                      : stat.color === 'green'
                      ? 'bg-green-100 text-green-600'
                      : stat.color === 'purple'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Listings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Your Listings</h2>
                <Link
                  href="/dashboard/listings"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {activeListings.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {activeListings.slice(0, 3).map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listing/${listing.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                    >
                      <img
                        src={listing.images[0] || '/placeholder-robot.jpg'}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                        <p className="text-sm text-gray-500">{formatPrice(listing.price)}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {listing.views}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Heart className="w-4 h-4" />
                          {listing.favorites}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No listings yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Create your first listing to start selling</p>
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create Listing
                  </Link>
                </div>
              )}
            </div>

            {/* Saved Robots */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Saved Robots</h2>
                <Link
                  href="/favorites"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {favoritedListings.length > 0 ? (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoritedListings.slice(0, 4).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No saved robots</h3>
                  <p className="text-sm text-gray-500 mb-4">Save robots you&apos;re interested in</p>
                  <Link
                    href="/search"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Robots
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/dashboard/listings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Bot className="w-5 h-5" />
                  <span>My Listings</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5" />
                  <span>Saved Robots</span>
                </Link>
                <Link
                  href="/dashboard/saved-searches"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Bell className="w-5 h-5" />
                  <span>Saved Searches</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              {conversations.length > 0 ? (
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conv) => {
                    const relatedListing = listings.find((l) => l.id === conv.listingId);
                    return (
                      <Link
                        key={conv.id}
                        href={`/messages/${conv.id}`}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate">
                            New message about {relatedListing?.title || 'a listing'}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(conv.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-2">Selling Tips</h3>
              <ul className="text-sm text-blue-100 space-y-2">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Add clear, high-quality photos
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Write detailed descriptions
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Price competitively
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Respond to messages quickly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
