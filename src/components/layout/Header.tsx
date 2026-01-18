'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useMessagesStore } from '@/store';
import {
  Bot,
  Search,
  Menu,
  X,
  User,
  Heart,
  MessageSquare,
  PlusCircle,
  LogOut,
  ChevronDown,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getUnreadCount } = useMessagesStore();

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="hidden sm:flex items-center space-x-4 text-blue-100">
              <span>Australia&apos;s #1 Robot Marketplace</span>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <Link href="/help" className="hover:text-blue-200 transition">
                Help
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="hover:text-blue-200 transition">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <span className="text-blue-100">Welcome, {user?.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              bot<span className="text-blue-600">sales</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium">
                <span>Buy</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
                  <Link href="/search" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    All Robots
                  </Link>
                  <Link href="/search?category=home-cleaning" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Home & Cleaning
                  </Link>
                  <Link href="/search?category=drones" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Drones & UAV
                  </Link>
                  <Link href="/search?category=educational" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Educational
                  </Link>
                  <Link href="/search?category=companion" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Companion Robots
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/sell" className="text-gray-700 hover:text-blue-600 font-medium">
              Sell
            </Link>

            <Link href="/research" className="text-gray-700 hover:text-blue-600 font-medium">
              Research
            </Link>

            <Link href="/value-my-robot" className="text-gray-700 hover:text-blue-600 font-medium">
              Value My Robot
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/search"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition"
            >
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  href="/messages"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition relative"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48">
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/listings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Bot className="w-4 h-4" />
                        <span>My Listings</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : null}

            <Link
              href="/sell"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Sell Your Robot</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-blue-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/search"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buy Robots
            </Link>
            <Link
              href="/sell"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell Your Robot
            </Link>
            <Link
              href="/research"
              className="block py-2 text-gray-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Research
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="block py-2 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <Link
                  href="/favorites"
                  className="block py-2 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
