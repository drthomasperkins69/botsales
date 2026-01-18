'use client';

import Link from 'next/link';
import { Heart, MapPin, Eye, Clock, BadgeCheck, Tag } from 'lucide-react';
import { RobotListing } from '@/types';
import { useListingsStore, useAuthStore } from '@/store';
import { formatPrice, formatDate, getConditionColor, truncateText } from '@/lib/utils';
import { mockUsers } from '@/data/users';

interface ListingCardProps {
  listing: RobotListing;
  variant?: 'grid' | 'list';
}

export default function ListingCard({ listing, variant = 'grid' }: ListingCardProps) {
  const { favorites, toggleFavorite } = useListingsStore();
  const { isAuthenticated } = useAuthStore();
  const isFavorited = favorites.includes(listing.id);

  const seller = mockUsers.find((u) => u.id === listing.sellerId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(listing.id);
    }
  };

  if (variant === 'list') {
    return (
      <Link href={`/listing/${listing.id}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-64 md:w-80 h-48 sm:h-auto flex-shrink-0">
              <img
                src={listing.images[0] || '/placeholder-robot.jpg'}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {listing.featured && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  FEATURED
                </div>
              )}
              <button
                onClick={handleFavoriteClick}
                className={`absolute top-2 right-2 p-2 rounded-full transition ${
                  isFavorited
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.brand} {listing.model} {listing.year && `(${listing.year})`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
                    {listing.negotiable && (
                      <span className="text-xs text-green-600 font-medium">Negotiable</span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  {truncateText(listing.description.replace(/[*#\n]/g, ' '), 150)}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConditionColor(listing.condition)}`}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
                  </span>
                  {listing.specifications.features?.slice(0, 2).map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location.city}, {listing.location.state}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(listing.createdAt)}
                  </span>
                </div>
                {seller && (
                  <div className="flex items-center text-sm text-gray-500">
                    {seller.verified && <BadgeCheck className="w-4 h-4 mr-1 text-blue-500" />}
                    <span>{seller.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.images[0] || '/placeholder-robot.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {listing.featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              FEATURED
            </div>
          )}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConditionColor(listing.condition)}`}>
              {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 flex-1">
                {listing.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {listing.brand} {listing.model}
            </p>

            <div className="mt-3">
              <p className="text-xl font-bold text-blue-600">{formatPrice(listing.price)}</p>
              {listing.negotiable && (
                <span className="inline-flex items-center text-xs text-green-600 font-medium">
                  <Tag className="w-3 h-3 mr-1" />
                  Negotiable
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {listing.location.city}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {listing.views}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(listing.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
