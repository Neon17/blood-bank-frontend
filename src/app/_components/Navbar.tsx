'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/authInfo';
import { ModeToggle } from './ModeToggle';
import { ChevronDown, Menu, X, Droplets } from 'lucide-react';
import { useFormattedUsername } from '@/hooks/useFormattedUsername';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const username = useFormattedUsername(user?.name);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/donors', label: 'Donors' },
    { href: '/requests', label: 'Requests' },
  ];

  const isActiveLink = (href: string) => pathname === href;

  return (
    <>
      <header className="shadow-sm bg-red-600 text-white dark:bg-red-700 sticky top-0 z-999">
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-200">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="self-center text-2xl font-bold whitespace-nowrap">
                  Blood Bank
                </span>
                <span className="text-xs text-red-100 -mt-1 opacity-80">
                  Save Lives
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActiveLink(link.href)
                      ? 'bg-red-700 dark:bg-red-800 text-white shadow-inner'
                      : 'text-red-50 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle - Desktop */}
              <div className="hidden md:flex">
                <ModeToggle />
              </div>

              {/* Auth Section */}
              {!user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-red-50 font-medium rounded-lg hover:bg-red-500 dark:hover:bg-red-600 transition-colors border border-red-400"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 bg-white text-red-600 font-medium rounded-lg shadow-lg hover:bg-red-50 transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  {/* User Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    >
                      {user?.profilePhoto ? (
                        <img
                          src={`http://localhost:8000${user.profilePhoto.url}`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border-2 border-red-400"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold border border-red-400">
                          {username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-red-100 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-red-200 dark:border-red-900 py-2 z-50">
                        <div className="px-4 py-2 border-b border-red-100 dark:border-red-900">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Donor
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          👤 Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          📊 Dashboard
                        </Link>
                        <div className="border-t border-red-100 dark:border-red-900 mt-1">
                          <a
                            href="/logout"
                            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            🚪 Logout
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-red-50 hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Theme Toggle - Mobile */}
              <div className="md:hidden">
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-red-600 dark:bg-red-700 border-t border-red-500 dark:border-red-600 rounded-b-lg">
              <div className="py-4 space-y-2">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 mx-2 rounded-lg font-medium transition-all ${
                      isActiveLink(link.href)
                        ? 'bg-red-700 dark:bg-red-800 text-white shadow-inner border-l-4 border-white'
                        : 'text-red-50 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                {!user ? (
                  <div className="px-4 pt-4 space-y-3 border-t border-red-500 dark:border-red-600">
                    <Link
                      href="/login"
                      className="block w-full px-4 py-3 text-center text-red-50 font-medium rounded-lg border border-red-400 hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full px-4 py-3 text-center bg-white text-red-600 font-medium rounded-lg shadow-lg hover:bg-red-50 font-semibold transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 pt-4 space-y-3 border-t border-red-500 dark:border-red-600">
                    <div className="flex items-center space-x-3 p-3 bg-red-500 dark:bg-red-600 rounded-lg">
                      {user?.profilePhoto ? (
                        <img
                          src={`http://localhost:8000${user.profilePhoto.url}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-red-400"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold border border-red-400">
                          {username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{username}</p>
                        <p className="text-sm text-red-100">Welcome back!</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-red-50 hover:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors"
                    >
                      👤 Profile
                    </Link>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-3 text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors bg-red-700 dark:bg-red-800"
                    >
                      🚪 Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
