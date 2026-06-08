'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  type?: string;
  variants?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { store, user, refreshCart } = useStore();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/login'); return; }
    if (!store) return;
    setAdding(true);
    try {
      await store.cart.add(product._id, 1, product.variants?.[0]);
      await refreshCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {} finally { setAdding(false); }
  }

  return (
    <Link href={`/product?id=${product._id}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">—</div>
        }
        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`w-full py-2.5 text-xs font-medium uppercase tracking-widest transition ${
              added
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            } disabled:opacity-50`}
          >
            {adding ? '...' : added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-0.5">
        {product.type && (
          <p className="text-xs uppercase tracking-widest text-gray-300">{product.type}</p>
        )}
        <h3 className="text-sm text-gray-700 group-hover:text-black transition truncate font-normal">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 font-light">₹{product.price?.toLocaleString()}</p>
      </div>
    </Link>
  );
}
