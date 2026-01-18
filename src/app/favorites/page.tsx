'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { useAuthStore, useListingsStore } from '@/store';
import ListingCard from '@/components/listings/ListingCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { listings, favorites } = useListingsStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/favorites');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const favoritedListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Robots</h1>
            <p className="text-gray-600 mt-1">
              {favoritedListings.length} robot{favoritedListings.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>

        {favoritedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved robots yet</h3>
            <p className="text-gray-500 mb-6">
              When you find a robot you like, click the heart icon to save it here
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Search className="w-5 h-5" />
              Browse Robots
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
