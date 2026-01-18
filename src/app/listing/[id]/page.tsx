'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Eye,
  Clock,
  MessageSquare,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  BadgeCheck,
  Star,
  Shield,
  AlertTriangle,
  Flag,
} from 'lucide-react';
import { useListingsStore, useAuthStore, useMessagesStore } from '@/store';
import { mockUsers } from '@/data/users';
import { ROBOT_CATEGORIES } from '@/types';
import { formatPrice, formatDate, formatFullDate, getConditionColor } from '@/lib/utils';
import ListingCard from '@/components/listings/ListingCard';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { getListingById, favorites, toggleFavorite, incrementViews, searchListings } = useListingsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { startConversation } = useMessagesStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const listing = getListingById(listingId);
  const seller = listing ? mockUsers.find((u) => u.id === listing.sellerId) : null;
  const isFavorited = favorites.includes(listingId);
  const category = listing ? ROBOT_CATEGORIES.find((c) => c.id === listing.category) : null;

  // Increment views on mount
  useEffect(() => {
    if (listing) {
      incrementViews(listingId);
    }
  }, [listingId, listing, incrementViews]);

  // Get similar listings
  const similarListings = listing
    ? searchListings({ category: listing.category })
        .filter((l) => l.id !== listing.id)
        .slice(0, 4)
    : [];

  const handleFavorite = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/listing/${listingId}`);
      return;
    }
    toggleFavorite(listingId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/listing/${listingId}`);
      return;
    }
    if (!message.trim() || !listing || !user) return;

    const conversationId = startConversation(listingId, [user.id, listing.sellerId]);
    useMessagesStore.getState().sendMessage(conversationId, user.id, message);
    setMessageSent(true);
    setMessage('');
    setTimeout(() => setMessageSent(false), 3000);
  };

  const nextImage = () => {
    if (listing) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-4">This listing may have been removed or sold.</p>
          <Link href="/search" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse all robots
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/search" className="hover:text-blue-600">
              Robots
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            {category && (
              <>
                <Link href={`/search?category=${category.id}`} className="hover:text-blue-600">
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            )}
            <span className="text-gray-900 truncate max-w-xs">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={listing.images[currentImageIndex] || '/placeholder-robot.jpg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {listing.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-3 py-1 rounded">
                    FEATURED
                  </div>
                )}
              </div>
              {listing.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
                  <p className="text-gray-600 mt-1">
                    {listing.brand} {listing.model} {listing.year && `(${listing.year})`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-full transition ${
                      isFavorited
                        ? 'bg-red-50 text-red-500'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(listing.condition)}`}>
                  {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location.city}, {listing.location.state}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {listing.views} views
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Listed {formatDate(listing.createdAt)}
                </span>
              </div>

              <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
                <div className="text-3xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
                {listing.negotiable && (
                  <span className="text-green-600 font-medium">Price negotiable</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-gray max-w-none whitespace-pre-wrap">
                {listing.description}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">{listing.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium text-gray-900">{listing.model}</span>
                </div>
                {listing.year && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Year</span>
                    <span className="font-medium text-gray-900">{listing.year}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Condition</span>
                  <span className="font-medium text-gray-900 capitalize">{listing.condition.replace('-', ' ')}</span>
                </div>
                {listing.specifications.dimensions && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Dimensions</span>
                    <span className="font-medium text-gray-900">{listing.specifications.dimensions}</span>
                  </div>
                )}
                {listing.specifications.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-medium text-gray-900">{listing.specifications.weight}</span>
                  </div>
                )}
                {listing.specifications.batteryLife && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Battery Life</span>
                    <span className="font-medium text-gray-900">{listing.specifications.batteryLife}</span>
                  </div>
                )}
              </div>

              {listing.specifications.connectivity && listing.specifications.connectivity.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Connectivity</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.specifications.connectivity.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {listing.specifications.features && listing.specifications.features.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.specifications.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {listing.specifications.includedAccessories && listing.specifications.includedAccessories.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Included Accessories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.specifications.includedAccessories.map((item, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>Meet in a public place to inspect the robot before purchase</li>
                    <li>Never send payment before seeing the item in person</li>
                    <li>Test the robot thoroughly before completing the transaction</li>
                    <li>Use secure payment methods with buyer protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-[180px]">
              <div className="hidden lg:block">
                <div className="text-3xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
                {listing.negotiable && (
                  <span className="text-green-600 font-medium">Price negotiable</span>
                )}
              </div>

              {/* Seller Info */}
              {seller && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    {seller.avatar ? (
                      <img src={seller.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{seller.name[0]}</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{seller.name}</span>
                        {seller.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        {seller.rating} ({seller.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {formatFullDate(seller.memberSince)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-4 h-4" />
                      {seller.listingsCount} listings
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message Seller
                </button>
                {seller?.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Seller
                  </a>
                )}
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi, I'm interested in your ${listing.brand} ${listing.model}. Is it still available?`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-full mt-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Message
                  </button>
                  {messageSent && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Message sent successfully!
                    </p>
                  )}
                </div>
              )}

              {/* Report */}
              <button className="w-full mt-4 text-sm text-gray-500 hover:text-red-500 flex items-center justify-center gap-1">
                <Flag className="w-4 h-4" />
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Robots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
