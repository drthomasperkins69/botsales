'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  Bell,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { ROBOT_CATEGORIES, ROBOT_CONDITIONS, ROBOT_BRANDS, RobotCategory, RobotCondition, SearchFilters } from '@/types';
import { useListingsStore, useAuthStore, useSavedSearchesStore } from '@/store';
import { cn } from '@/lib/utils';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchListings } = useListingsStore();
  const { isAuthenticated } = useAuthStore();
  const { addSavedSearch } = useSavedSearchesStore();

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    condition: true,
    brand: false,
    location: false,
  });

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: (searchParams.get('category') as RobotCategory) || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    condition: searchParams.getAll('condition') as RobotCondition[],
    location: searchParams.get('location') || undefined,
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance',
  });

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.condition) {
      newFilters.condition.forEach((c) => params.append('condition', c));
    }
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.sortBy && newFilters.sortBy !== 'relevance') params.set('sortBy', newFilters.sortBy);

    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [router]);

  // Get search results
  const results = useMemo(() => {
    return searchListings(filters);
  }, [searchListings, filters]);

  // Update filters and URL
  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Toggle condition filter
  const toggleCondition = (condition: RobotCondition) => {
    const current = filters.condition || [];
    const newConditions = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition];
    handleFilterChange('condition', newConditions);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: SearchFilters = { sortBy: 'relevance' };
    setFilters(clearedFilters);
    router.push('/search');
  };

  // Toggle section expand/collapse
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Save search
  const handleSaveSearch = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/search');
      return;
    }
    const searchName = filters.query || filters.category || 'My Search';
    addSavedSearch(searchName, filters, true);
    alert('Search saved! You will receive email alerts for new matches.');
  };

  // Active filter count
  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    (filters.condition?.length ?? 0) > 0,
    filters.location,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                placeholder="Search robots..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filters.sortBy || 'relevance'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2.5 transition',
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                  )}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2.5 transition',
                    viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside
            className={cn(
              'w-64 flex-shrink-0 transition-all',
              showFilters ? 'block' : 'hidden md:block'
            )}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-[180px]">
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-medium text-gray-900">Category</span>
                  {expandedSections.category ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.category && (
                  <div className="px-4 pb-4 space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', undefined)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg text-sm transition',
                        !filters.category
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      All Categories
                    </button>
                    {ROBOT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleFilterChange('category', cat.id)}
                        className={cn(
                          'block w-full text-left px-3 py-2 rounded-lg text-sm transition',
                          filters.category === cat.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-medium text-gray-900">Price</span>
                  {expandedSections.price ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { label: 'Under $500', min: 0, max: 500 },
                        { label: '$500 - $1,000', min: 500, max: 1000 },
                        { label: '$1,000 - $5,000', min: 1000, max: 5000 },
                        { label: '$5,000+', min: 5000, max: undefined },
                      ].map((range) => (
                        <button
                          key={range.label}
                          onClick={() => {
                            handleFilterChange('minPrice', range.min);
                            handleFilterChange('maxPrice', range.max);
                          }}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Condition Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('condition')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-medium text-gray-900">Condition</span>
                  {expandedSections.condition ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.condition && (
                  <div className="px-4 pb-4 space-y-2">
                    {ROBOT_CONDITIONS.map((cond) => (
                      <label
                        key={cond.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.condition?.includes(cond.id) || false}
                          onChange={() => toggleCondition(cond.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cond.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-medium text-gray-900">Brand</span>
                  {expandedSections.brand ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.brand && (
                  <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => handleFilterChange('brand', undefined)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg text-sm transition',
                        !filters.brand
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      All Brands
                    </button>
                    {ROBOT_BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleFilterChange('brand', brand)}
                        className={cn(
                          'block w-full text-left px-3 py-2 rounded-lg text-sm transition',
                          filters.brand === brand
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div>
                <button
                  onClick={() => toggleSection('location')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <span className="font-medium text-gray-900">Location</span>
                  {expandedSections.location ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.location && (
                  <div className="px-4 pb-4">
                    <input
                      type="text"
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="City or State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{results.length}</span> robots found
                {filters.query && (
                  <span>
                    {' '}for &quot;<span className="font-medium">{filters.query}</span>&quot;
                  </span>
                )}
              </p>
              <button
                onClick={handleSaveSearch}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Bell className="w-4 h-4" />
                Save Search
              </button>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {ROBOT_CATEGORIES.find((c) => c.id === filters.category)?.name}
                    <button onClick={() => handleFilterChange('category', undefined)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {filters.brand}
                    <button onClick={() => handleFilterChange('brand', undefined)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                    <button onClick={() => {
                      handleFilterChange('minPrice', undefined);
                      handleFilterChange('maxPrice', undefined);
                    }}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.condition?.map((cond) => (
                  <span
                    key={cond}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {ROBOT_CONDITIONS.find((c) => c.id === cond)?.name}
                    <button onClick={() => toggleCondition(cond)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {filters.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {filters.location}
                    <button onClick={() => handleFilterChange('location', undefined)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Grid/List */}
            {results.length > 0 ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                )}
              >
                {results.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No robots found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
