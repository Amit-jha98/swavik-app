import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { BottleStage } from '@/components/luxury/BottleStage';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { MediaStage } from '@/components/luxury/MediaStage';
import { useCart } from '@/context/CartContext.jsx';
import { formatCurrency } from '@/lib/formatters';
import { productSeed } from '@/lib/productSeed';

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = productSeed.find((item) => item.slug === slug) || productSeed[0];

  function handleAdd() {
    addToCart(product);
  }

  function handleCheckout() {
    addToCart(product);
    navigate('/cart');
  }

  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="relative overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.2),transparent_20rem),linear-gradient(180deg,#11100d,#030303)] p-6 shadow-velvet">
          <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Product confirmation</p>
          <div className="grid min-h-[34rem] place-items-center py-10">
            <div className="text-center">
              <BottleStage
                src={product.asset}
                alt={product.name}
                size="large"
                tone={product.bottleTone}
                className="mx-auto min-h-[28rem] w-full"
              />
              <h1 className="mt-8 font-display text-5xl text-cream-50 sm:text-6xl">{product.name}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.26em] text-cream-100/55">{product.size}</p>
            </div>
          </div>
        </section>

        <aside className="grid gap-5">
          <div className="rounded-md border border-white/10 bg-ink-900 p-6">
            <div className="flex items-center gap-3 text-gold-300">
              <CheckCircle2 size={20} />
              <p className="text-xs uppercase tracking-[0.28em]">Excellent choice</p>
            </div>
            <p className="mt-5 text-base leading-8 text-cream-100/68">
              {product.name} has been prepared for your personal selection. Explore another fragrance or proceed to
              checkout with gift-ready delivery options.
            </p>
            <p className="mt-6 font-display text-4xl text-cream-50">{formatCurrency(product.price)}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <LuxuryButton type="button" onClick={handleAdd}>
                Add Selection
              </LuxuryButton>
              <LuxuryButton type="button" onClick={handleCheckout} className="bg-gold-500 text-ink-950">
                Checkout
              </LuxuryButton>
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-ink-900 p-6">
            <div className="flex items-center gap-3 text-gold-300">
              <Sparkles size={20} />
              <p className="text-xs uppercase tracking-[0.28em]">Fragrance notes</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span key={note} className="rounded-full border border-white/10 px-4 py-2 text-sm text-cream-100/70">
                  {note}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-cream-100/60">{product.description}</p>
          </div>

          <MediaStage
            eyebrow=""
            title="Selection Film"
            copy="A spotlight moment for the selected fragrance before checkout."
            src="/media/confirmation-film.mp4"
            poster="/media/confirmation-poster.jpg"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <LuxuryButton as={Link} to="/shop" className="border-white/20 text-cream-100">
              Explore More
            </LuxuryButton>
            <LuxuryButton as={Link} to="/ai-consultant">
              Ask Concierge
            </LuxuryButton>
          </div>
        </aside>
      </div>
    </main>
  );
}
