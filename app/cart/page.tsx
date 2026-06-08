'use client';
import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { store, user, refreshCart } = useStore();
  const router = useRouter();
  const [cart, setCart]       = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!store || !user) { setLoading(false); return; }
    try {
      const d = await store.cart.get();
      setCart(d.cart || []);
      setTotal(d.cartTotal || 0);
    } catch { setCart([]); } finally { setLoading(false); }
  }, [store, user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function updateQty(itemId: string, qty: number) {
    if (!store) return;
    setUpdating(itemId);
    try {
      if (qty < 1) await store.cart.remove(itemId);
      else await store.cart.update(itemId, qty);
      await fetchCart();
      await refreshCart();
    } catch {} finally { setUpdating(null); }
  }

  if (!user) return (
    <div className="max-w-md mx-auto px-6 py-40 text-center">
      <p className="text-xs uppercase tracking-widest text-gray-300 mb-6">Cart</p>
      <p className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
        Sign in to view your cart
      </p>
      <Link href="/login" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:opacity-75 transition">
        Login
      </Link>
    </div>
  );

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-50" />)}
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-md mx-auto px-6 py-40 text-center">
      <p className="text-xs uppercase tracking-widest text-gray-300 mb-6">Cart</p>
      <p className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
        Your cart is empty
      </p>
      <Link href="/products" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:opacity-75 transition">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="mb-10 border-b border-gray-100 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-300 mb-2">Review</p>
        <h1
          className="text-4xl text-gray-900"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300 }}
        >
          My Cart ({cart.length})
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Items */}
        <div className="md:col-span-2 space-y-0 divide-y divide-gray-100">
          {cart.map((item: any) => (
            <div key={item._id} className="flex gap-5 py-5">
              <div className="w-20 h-20 bg-gray-50 overflow-hidden shrink-0">
                {item.image
                  ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-200 text-2xl">—</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {item.variant && <p className="text-xs text-gray-300 mt-0.5 uppercase tracking-widest">Size: {item.variant}</p>}
                <p className="text-sm font-light text-gray-500 mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    disabled={!!updating}
                    className="w-7 h-7 border border-gray-200 text-sm hover:border-black transition disabled:opacity-40"
                  >−</button>
                  <span className="text-sm w-5 text-center font-light">
                    {updating === item._id ? '…' : item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    disabled={!!updating}
                    className="w-7 h-7 border border-gray-200 text-sm hover:border-black transition disabled:opacity-40"
                  >+</button>
                  <button
                    onClick={() => updateQty(item._id, 0)}
                    disabled={!!updating}
                    className="ml-2 text-xs uppercase tracking-widest text-gray-300 hover:text-black transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border border-gray-100 p-6 h-fit space-y-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
          <div className="flex justify-between text-sm font-light text-gray-500">
            <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-light text-gray-500">
            <span>Shipping</span><span className="text-black">Free</span>
          </div>
          <div className="flex justify-between font-medium border-t border-gray-100 pt-4">
            <span className="text-sm">Total</span>
            <span className="text-sm">₹{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest hover:opacity-75 transition mt-2"
          >
            Checkout
          </button>
          <Link href="/products" className="block text-center text-xs uppercase tracking-widest text-gray-300 hover:text-black transition pt-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
