'use client';
import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

const SORTS = [
  { label: 'Newest',    value: 'newest' },
  { label: 'Popular',   value: 'popularity' },
  { label: 'Price ↑',   value: 'price_asc' },
  { label: 'Price ↓',   value: 'price_desc' },
];

export default function ProductsPage() {
  const { store } = useStore();
  const [products, setProducts]           = useState<any[]>([]);
  const [categories, setCategories]       = useState<string[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setCategory]     = useState('All');
  const [sort, setSort]                   = useState('newest');
  const [search, setSearch]               = useState('');
  const [searchInput, setSearchInput]     = useState('');
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);

  const load = useCallback(async () => {
    if (!store) return;
    setLoading(true);
    try {
      const p: Record<string, any> = { sort, page, limit: 12 };
      if (activeCategory !== 'All') p.type = activeCategory;
      if (search) p.keyword = search;
      const d = await store.products.list(p);
      setProducts(d.products || []);
      setTotalPages(d.pages || 1);
    } catch {} finally { setLoading(false); }
  }, [store, activeCategory, sort, page, search]);

  useEffect(() => {
    if (store)
      store.categories.list().then((c: string[]) => setCategories(c || [])).catch(() => {});
  }, [store]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="mb-10 border-b border-gray-100 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-2">Catalogue</p>
        <h1
          className="text-4xl text-gray-900"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
        >
          All Products
        </h1>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form
          onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          className="flex flex-1 gap-2"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition font-light placeholder-gray-300"
          />
          <button type="submit" className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-75 transition">
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              className="px-4 py-2.5 border border-gray-200 text-xs uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition"
            >
              Clear
            </button>
          )}
        </form>
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
          className="border border-gray-200 px-4 py-2.5 text-xs uppercase tracking-widest text-gray-500 bg-white focus:outline-none focus:border-black transition"
        >
          {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-10">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition ${
                activeCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="bg-gray-50 aspect-square animate-pulse" />
              <div className="h-3 bg-gray-50 animate-pulse w-2/3" />
              <div className="h-3 bg-gray-50 animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-xs uppercase tracking-widest text-gray-300">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 text-xs uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition disabled:opacity-30"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-xs font-medium transition border ${
                page === i + 1
                  ? 'bg-black text-white border-black'
                  : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 text-xs uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
