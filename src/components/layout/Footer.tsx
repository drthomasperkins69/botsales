import Link from 'next/link';
import { Bot, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                bot<span className="text-blue-400">sales</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Australia&apos;s leading online marketplace for buying and selling consumer robots.
              From vacuum cleaners to drones, find your perfect robotic companion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Buy */}
          <div>
            <h3 className="text-white font-semibold mb-4">Buy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  All Robots
                </Link>
              </li>
              <li>
                <Link href="/search?category=home-cleaning" className="hover:text-white transition">
                  Home & Cleaning
                </Link>
              </li>
              <li>
                <Link href="/search?category=drones" className="hover:text-white transition">
                  Drones
                </Link>
              </li>
              <li>
                <Link href="/search?category=educational" className="hover:text-white transition">
                  Educational
                </Link>
              </li>
              <li>
                <Link href="/search?category=companion" className="hover:text-white transition">
                  Companion Robots
                </Link>
              </li>
              <li>
                <Link href="/search?category=industrial" className="hover:text-white transition">
                  Industrial
                </Link>
              </li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sell</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sell" className="hover:text-white transition">
                  Create Listing
                </Link>
              </li>
              <li>
                <Link href="/value-my-robot" className="hover:text-white transition">
                  Value My Robot
                </Link>
              </li>
              <li>
                <Link href="/sell/tips" className="hover:text-white transition">
                  Selling Tips
                </Link>
              </li>
              <li>
                <Link href="/sell/pricing" className="hover:text-white transition">
                  Pricing Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Stay updated</h3>
              <p className="text-gray-400 text-sm">Get the latest robot deals and news delivered to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} BotSales. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="hover:text-white transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
