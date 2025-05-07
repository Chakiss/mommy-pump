'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Refs for click outside detection
  const menuRef = useRef(null);
  const accountMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const accountMenuButtonRef = useRef(null);
  
  // Handle scroll for navbar visual effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Handle clicks outside menus using refs
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Account menu click outside detection
      if (
        isAccountMenuOpen &&
        accountMenuRef.current &&
        accountMenuButtonRef.current &&
        !accountMenuRef.current.contains(event.target) &&
        !accountMenuButtonRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
      
      // Mobile menu click outside detection
      if (
        isMenuOpen &&
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    // Only attach listeners when menus are open
    if (isMenuOpen || isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isAccountMenuOpen]);
  
  // Close menus on route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [pathname]);
  
  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'สินค้า', href: '/products' },
    { name: 'วิธีเช่า', href: '/how-it-works' },
    { name: 'คำถามที่พบบ่อย', href: '/faq' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
  ];
  
  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };
  
  return (
    <nav
      className={`sticky top-0 z-50 w-full font-['Sarabun','Poppins',sans-serif] transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/95 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#B3E5FC] to-[#C8E6C9] rounded-lg flex items-center justify-center">
                <span className="text-[#37474F] text-lg font-bold">M</span>
              </div>
              <span className="text-[#37474F] text-xl font-bold">MommyPump</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-[#37474F] bg-gradient-to-r from-[#B3E5FC]/40 to-[#C8E6C9]/40'
                    : 'text-[#78909C] hover:text-[#37474F] hover:bg-[#F0FAFA]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* User menu - Desktop */}
          <div className="hidden md:flex md:items-center">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-[#B3E5FC] animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  ref={accountMenuButtonRef}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsAccountMenuOpen(!isAccountMenuOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent hover:border-[#B3E5FC]/30 hover:bg-[#F0FAFA] focus:outline-none transition-all duration-200"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                  data-testid="user-menu-button"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#B3E5FC]/50 to-[#C8E6C9]/50 flex items-center justify-center text-[#37474F] font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-[#37474F] text-sm hidden sm:block">
                    {user.displayName || 'บัญชีของฉัน'}
                  </span>
                  <svg
                    className={`h-4 w-4 text-[#78909C] transform transition-transform ${
                      isAccountMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {isAccountMenuOpen && (
                  <div
                    ref={accountMenuRef}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black/5 divide-y divide-gray-100 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    data-testid="user-menu"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-[#37474F]">{user.displayName || 'ผู้ใช้งาน'}</p>
                      <p className="text-xs text-[#78909C] truncate mt-1">{user.email || user.phoneNumber || ''}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#37474F] hover:bg-[#F0FAFA]"
                        role="menuitem"
                      >
                        <svg className="w-4 h-4 text-[#78909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        ข้อมูลส่วนตัว
                      </Link>
                      <Link
                        href="/account/bookings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#37474F] hover:bg-[#F0FAFA]"
                        role="menuitem"
                      >
                        <svg className="w-4 h-4 text-[#78909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        ประวัติการจอง
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        role="menuitem"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#B3E5FC] to-[#C8E6C9] text-sm font-medium text-[#37474F] hover:shadow-md transition-all duration-300"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              ref={menuButtonRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#78909C] hover:text-[#37474F] hover:bg-[#F0FAFA] focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1.5'}`}></span>
                <span className={`absolute h-0.5 bg-current transform transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'}`}></span>
                <span className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-1.5' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-2xl border-t border-[#F0FAFA] overflow-hidden transform origin-top transition-all duration-200"
          id="mobile-menu"
        >
          <div className="px-4 pt-3 pb-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? 'text-[#37474F] bg-gradient-to-r from-[#B3E5FC]/40 to-[#C8E6C9]/40'
                    : 'text-[#78909C] hover:text-[#37474F] hover:bg-[#F0FAFA]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile user menu */}
          {!isLoading && (
            <div className="mt-2 pt-4 pb-3 border-t border-[#C8E6C9] border-opacity-30 px-4">
              {user ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#B3E5FC]/50 to-[#C8E6C9]/50 flex items-center justify-center text-[#37474F] font-medium">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-[#37474F]">{user.displayName || 'ผู้ใช้งาน'}</div>
                      <div className="text-sm text-[#78909C] truncate">{user.email || user.phoneNumber || ''}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base text-[#37474F] hover:bg-[#F0FAFA]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-[#78909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      ข้อมูลส่วนตัว
                    </Link>
                    <Link
                      href="/account/bookings"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base text-[#37474F] hover:bg-[#F0FAFA]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-[#78909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      ประวัติการจอง
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-base text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex w-full justify-center items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-[#B3E5FC] to-[#C8E6C9] text-base font-medium text-[#37474F] hover:shadow-md transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}