import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ProductGrid } from '@/components/ecommerce/ProductGrid';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { useCart } from '@/context/CartContext.jsx';

export function Wishlist() {
  const { addToCart } = useCart();

  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-gold-300">
              <Heart size={20} />
              <p className="text-xs uppercase tracking-[0.42em]">Wishlist</p>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-5xl text-cream-50 sm:text-6xl">Saved fragrance ideas.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cream-100/68">
              This page is ready to connect to Firebase saved fragrances. For now it highlights signature products.
            </p>
          </div>
          <LuxuryButton as={Link} to="/ai-consultant">
            Ask Concierge
          </LuxuryButton>
        </div>
        <div className="mt-10">
          <ProductGrid category="Oud" onSelect={addToCart} />
        </div>
      </div>
    </main>
  );
}
