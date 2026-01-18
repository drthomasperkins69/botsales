'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { ROBOT_CATEGORIES, ROBOT_BRANDS } from '@/types';
import { useListingsStore } from '@/store';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  initialQuery?: string;
  initialCategory?: string;
  initialLocation?: string;
  onSearch?: (params: { query: string; category: string; location: string }) => void;
}

export default function SearchBar({
  variant = 'hero',
  initialQuery = '',
  initialCategory = '',
  initialLocation = '',
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { listings } = useListingsStore();

  useEffect(() => {
    if (query.length >= 2) {
      // Generate suggestions based on query
      const queryLower = query.toLowerCase();
      const matchingBrands = ROBOT_BRANDS.filter((b) =>
        b.toLowerCase().includes(queryLower)
      ).slice(0, 3);

      const matchingTitles = listings
        .filter((l) => l.title.toLowerCase().includes(queryLower))
        .map((l) => l.title)
        .slice(0, 3);

      const matchingModels = listings
        .filter((l) => l.model.toLowerCase().includes(queryLower))
        .map((l) => `${l.brand} ${l.model}`)
        .slice(0, 2);

      setSuggestions([...new Set([...matchingBrands, ...matchingModels, ...matchingTitles])].slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, listings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ query, category, location });
    } else {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (location) params.set('location', location);
      router.push(`/search?${params.toString()}`);
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch({ query: suggestion, category, location });
    } else {
      const params = new URLSearchParams();
      params.set('q', suggestion);
      if (category) params.set('category', category);
      if (location) params.set('location', location);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search robots..."
            className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                <Search className="w-4 h-4 inline-block mr-2 text-gray-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">What are you looking for?</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder="e.g. Roomba, DJI Mavic, Spot..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
                >
                  <Search className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category select */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {ROBOT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Suburb or State"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search button */}
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleSearch}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Quick filters */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Popular:</span>
        {['Roomba', 'DJI', 'Boston Dynamics', 'LEGO Mindstorms', 'Robot Vacuum'].map((term) => (
          <button
            key={term}
            onClick={() => handleSuggestionClick(term)}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
