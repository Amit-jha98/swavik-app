import { PackageCheck, Search, Truck } from 'lucide-react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';

const trackingSteps = ['Order confirmed', 'Gift box prepared', 'Out for delivery'];

export function TrackOrder() {
  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <section>
          <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Delivery tracking</p>
          <h1 className="mt-4 font-display text-5xl text-cream-50 sm:text-6xl">Track your order.</h1>
          <p className="mt-5 text-base leading-8 text-cream-100/68">
            A customer can return here after checkout to follow gift-box preparation and delivery movement.
          </p>
        </section>
        <section className="rounded-md border border-white/10 bg-ink-900 p-6">
          <label className="text-xs uppercase tracking-[0.28em] text-gold-300" htmlFor="order-id">
            Order ID
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="order-id"
              className="min-h-12 flex-1 rounded-md border border-white/10 bg-ink-950 px-4 text-cream-50"
              placeholder="SWV-1810-0001"
            />
            <LuxuryButton type="button">
              <Search size={16} />
              Track
            </LuxuryButton>
          </div>
          <div className="mt-8 grid gap-4">
            {trackingSteps.map((step, index) => {
              const Icon = index === trackingSteps.length - 1 ? Truck : PackageCheck;
              return (
                <div key={step} className="flex items-center gap-4 rounded-md border border-white/10 bg-ink-950 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-cream-100">{step}</p>
                    <p className="mt-1 text-sm text-cream-100/48">Preview state for backend tracking integration.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
