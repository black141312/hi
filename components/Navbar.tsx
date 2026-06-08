'use client';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, cartCount, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-base font-medium tracking-tight">hi</Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/products"
            className={`text-xs uppercase tracking-widest transition ${
              pathname.startsWith('/products') ? 'text-black' : 'text-gray-400 hover:text-black'
            }`}
          >
            Shop
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative flex items-center gap-1.5 text-gray-400 hover:text-black transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="text-xs font-medium text-black">({cartCount > 9 ? '9+' : cartCount})</span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition"
              >
                {user.name?.split(' ')[0] || 'Account'}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-8 bg-white border border-gray-100 shadow-sm py-1 w-40 z-50">
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-xs uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition">Profile</Link>
                  <Link href="/orders"  onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-xs uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition">Orders</Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); router.push('/'); }}
                    className="block w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest text-gray-300 hover:text-black hover:bg-gray-50 transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:inline-flex text-xs uppercase tracking-widest text-gray-400 hover:text-black transition">
              Login
            </Link>
          )}

          <button className="md:hidden text-gray-400 hover:text-black transition" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-0">
          <Link href="/products" className="block text-xs uppercase tracking-widest text-gray-400 hover:text-black py-3 border-b border-gray-50">Shop</Link>
          {user ? (
            <>
              <Link href="/orders"  className="block text-xs uppercase tracking-widest text-gray-400 hover:text-black py-3 border-b border-gray-50">Orders</Link>
              <Link href="/profile" className="block text-xs uppercase tracking-widest text-gray-400 hover:text-black py-3 border-b border-gray-50">Profile</Link>
              <button onClick={() => { logout(); router.push('/'); }} className="block text-xs uppercase tracking-widest text-gray-300 hover:text-black py-3 w-full text-left">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="block text-xs uppercase tracking-widest text-gray-400 hover:text-black py-3">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
