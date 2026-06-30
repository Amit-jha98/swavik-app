import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { CheckoutPanel } from '@/components/ecommerce/CheckoutPanel';

export function Cart() {
  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Cart and checkout</p>
          <h1 className="mt-4 font-display text-5xl text-cream-50 sm:text-6xl">Your private selection.</h1>
          <p className="mt-5 text-base leading-8 text-cream-100/68">
            Review curated fragrances, choose delivery style, and continue into payment when the selection feels right.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <CartDrawer />
        <CheckoutPanel />
      </div>
    </main>
  );
}
