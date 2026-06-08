'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

function NewsletterForm() {
  const { store } = useStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!store || !email) return;
    setStatus('loading');
    try {
      await store.newsletter.subscribe(email);
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') return <p className="text-xs uppercase tracking-widest text-gray-400">You&apos;re subscribed.</p>;

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 border border-gray-200 text-sm px-4 py-2.5 focus:outline-none focus:border-black transition bg-white placeholder-gray-300 font-light"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-black text-white px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:opacity-75 disabled:opacity-40 transition whitespace-nowrap"
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}

export default function HomePage() {
  const { store } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store) return;
    store.products
      .list({ limit: 8, sort: 'newest' })
      .then((d: any) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [store]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-44">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-8">New Season</p>
            <h1
              className="text-5xl md:text-7xl leading-[1.05] mb-7 text-gray-900"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
            >
              Less,<br />but better.
            </h1>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-light max-w-xs">
              Curated essentials designed to last.<br />No noise, just quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 text-xs font-medium uppercase tracking-widest hover:opacity-75 transition"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="inline-block border border-gray-200 text-gray-400 px-8 py-3 text-xs font-medium uppercase tracking-widest hover:border-black hover:text-black transition"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex flex-wrap justify-center gap-10 text-xs uppercase tracking-widest text-gray-300">
          <span>Free Shipping</span>
          <span>Premium Quality</span>
          <span>Secure Payments</span>
          <span>Easy Returns</span>
        </div>
      </div>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-300 mb-1.5">Just dropped</p>
            <h2
              className="text-3xl text-gray-900"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
            >
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest text-gray-300 hover:text-black transition hidden sm:block"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="bg-gray-50 aspect-square animate-pulse" />
                <div className="h-3 bg-gray-50 animate-pulse w-2/3" />
                <div className="h-3 bg-gray-50 animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xs uppercase tracking-widest text-gray-300">Products coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            href="/products"
            className="inline-block border border-gray-200 text-gray-400 px-10 py-3 text-xs font-medium uppercase tracking-widest hover:border-black hover:text-black transition"
          >
            Shop All
          </Link>
        </div>
      </section>

      {/* ── Editorial spacer ── */}
      <section className="border-y border-gray-100 py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-5">Our Philosophy</p>
          <p
            className="text-3xl md:text-4xl text-gray-700 leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
          >
            &ldquo;Design is not just what it looks like — design is how it works.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-4">Newsletter</p>
          <h2
            className="text-2xl text-gray-900 mb-2"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
          >
            Stay in the loop
          </h2>
          <p className="text-gray-400 text-sm mb-8 font-light">New arrivals, early access. Nothing more.</p>
          <NewsletterForm />
          {/* Error hint */}
        </div>
      </section>
    </>
  );
}
