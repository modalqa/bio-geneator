'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Tagline section on the left */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold text-orange-500">
              AI Bio Generator
            </Link>
          </div>
          
          {/* Navigation menu on the right */}
          <div className="flex items-center">
            {/* Mobile menu */}
            <div className="flex sm:hidden space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md ${
                  pathname === '/'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Bio
              </Link>
              <Link
                href="/stats"
                className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md ${
                  pathname === '/stats'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Stats
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Bio Generator
              </Link>
              <Link
                href="/stats"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/stats'
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Stats
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
