import { Link } from 'react-router-dom';
import { Heart, Package, Sparkles, Truck, UserRound } from 'lucide-react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { useAuth } from '@/context/AuthContext.jsx';

const accountTiles = [
  { icon: Package, title: 'Orders', copy: 'Review confirmed and fulfilled fragrance orders.' },
  { icon: Heart, title: 'Wishlist', copy: 'Save fragrances for later discovery.' },
  { icon: Sparkles, title: 'Recommendations', copy: 'Keep concierge preferences and AI matches.' },
  { icon: Truck, title: 'Delivery Tracking', copy: 'Follow current orders and gift-box dispatch.' },
  { icon: UserRound, title: 'Profile', copy: 'Manage name, email, and contact details.' }
];

export function Account() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Customer account</p>
            <h1 className="mt-4 font-display text-5xl text-cream-50 sm:text-6xl">
              {isAuthenticated ? user?.email : 'Your Swavik dashboard'}
            </h1>
          </div>
          {!isAuthenticated ? (
            <LuxuryButton as={Link} to="/login">
              Login
            </LuxuryButton>
          ) : null}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {accountTiles.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-md border border-white/10 bg-ink-900 p-5">
              <Icon className="text-gold-300" size={24} />
              <h2 className="mt-6 font-display text-2xl text-cream-50">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-cream-100/62">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
