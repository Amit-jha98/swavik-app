import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gem, Landmark, Sparkles } from 'lucide-react';
import { ProductGrid } from '@/components/ecommerce/ProductGrid';
import { useCart } from '@/context/CartContext.jsx';

const collectionTabs = ['All', 'Oud', 'Floral', 'Indian Heritage', 'Middle Eastern', 'Global'];
const rooms = [
  { icon: Landmark, label: 'Indian Heritage', copy: 'Kannauj attars, rose fields, copper degs, and sandalwood depth.' },
  { icon: Gem, label: 'Arabian Collection', copy: 'Oud, amber, saffron, and ceremonial evening profiles.' },
  { icon: Sparkles, label: 'Global Collection', copy: 'Modern luxury blends shaped for gifting and daily signatures.' }
];

export function Shop() {
  const [searchParams] = useSearchParams();
  const initialMood = searchParams.get('mood');
  const [category, setCategory] = useState(initialMood === 'oud' ? 'Oud' : 'All');
  const { addToCart } = useCart();

  const selectedLabel = useMemo(() => (category === 'All' ? 'All Collections' : category), [category]);

  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Luxury showroom</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl text-cream-50 sm:text-6xl">{selectedLabel}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cream-100/68">
              Browse by room, mood, or note family. Each product is ready for a detail reveal, AI conversation, and
              private checkout selection.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {rooms.map(({ icon: Icon, label, copy }) => (
              <button
                key={label}
                className="luxury-focus rounded-md border border-white/10 bg-ink-900 p-4 text-left transition hover:border-gold-500/55"
                type="button"
                onClick={() => setCategory(label)}
              >
                <Icon className="text-gold-300" size={20} />
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-gold-300">{label}</p>
                <p className="mt-3 text-sm leading-6 text-cream-100/58">{copy}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {collectionTabs.map((tab) => (
            <button
              key={tab}
              className={`luxury-focus shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                category === tab
                  ? 'border-gold-500 bg-gold-500 text-ink-950'
                  : 'border-white/10 text-cream-100/62 hover:border-gold-500/55 hover:text-gold-300'
              }`}
              type="button"
              onClick={() => setCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ProductGrid category={category} onSelect={addToCart} />
        </div>
      </div>
    </main>
  );
}
