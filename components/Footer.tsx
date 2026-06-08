import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <p className="text-base font-medium tracking-tight mb-2">hi</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Curated essentials, crafted simply.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium mb-5 uppercase tracking-widest text-gray-300">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li><Link href="/products" className="hover:text-black transition">All Products</Link></li>
              <li><Link href="/cart"     className="hover:text-black transition">Cart</Link></li>
              <li><Link href="/orders"   className="hover:text-black transition">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium mb-5 uppercase tracking-widest text-gray-300">Account</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li><Link href="/login"   className="hover:text-black transition">Login</Link></li>
              <li><Link href="/profile" className="hover:text-black transition">Profile</Link></li>
              <li><Link href="/orders"  className="hover:text-black transition">Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-300">
          <p>© {new Date().getFullYear()} hi. All rights reserved.</p>
          <p>Powered by <a href="https://epicmerch.in" target="_blank" rel="noopener" className="hover:text-black transition">EpicMerch</a></p>
        </div>
      </div>
    </footer>
  );
}
