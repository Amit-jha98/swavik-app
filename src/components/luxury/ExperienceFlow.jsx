import { Link } from 'react-router-dom';
import { Mic, Sparkles, UserRound, WandSparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import { productSeed } from '@/lib/productSeed';
import { formatCurrency } from '@/lib/formatters';
import { BottleStage } from './BottleStage';
import { LuxuryButton } from './LuxuryButton';

const scentIntents = ['Floral', 'Oud', 'Luxury', 'Fresh', 'Arabian', 'Heritage'];
const voiceCommands = ['Show Oud Collection', 'Tell Me More', 'Add Royal Oud', 'Proceed To Checkout'];
import { useContext, useEffect, useRef } from 'react';
import { CinematicContext } from '@/App';

export function ExperienceFlow() {
  const { user, isAuthenticated } = useAuth();
  const cinematic = useContext(CinematicContext);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const manageVideoState = () => {
      if (cinematic || document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    manageVideoState();

    document.addEventListener('visibilitychange', manageVideoState);
    return () => document.removeEventListener('visibilitychange', manageVideoState);
  }, [cinematic]);

  const oudProducts = productSeed.filter((product) => product.subcategory === 'Royal Oud Collection').slice(0, 3);
  const guestName = user?.displayName || user?.email?.split('@')[0];
  const greeting = isAuthenticated && guestName ? `Welcome, ${guestName}.` : 'Welcome to Swavik.';

  return (
    <>
      <section id="showroom" className="relative overflow-hidden bg-ink-900 px-6 py-20">
        <video
          ref={videoRef}
          className="sfp-cinema-video absolute inset-0 h-full w-full object-cover opacity-25"
          src="/media/showroom-ambient.mp4"
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-ink-950/70" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Personalized product discovery</p>
              <h2 className="mt-4 font-display text-4xl text-cream-50 sm:text-5xl">The oud room opens with three bottles.</h2>
            </div>
            <LuxuryButton as={Link} to="/shop">
              Enter Collections
            </LuxuryButton>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {oudProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="luxury-focus group relative min-h-[28rem] overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.2),transparent_15rem),linear-gradient(180deg,#11100d,#050505)] p-5 transition hover:border-gold-500/55"
              >
                <div className="absolute inset-x-8 top-12 h-48 rounded-full bg-gold-500/10 blur-2xl" />
                <div className="relative flex h-full flex-col">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold-300">{product.badge}</p>
                  <div className="my-auto grid place-items-center py-10">
                    <BottleStage
                      src={product.asset}
                      alt={product.name}
                      size="small"
                      tone={product.bottleTone}
                      className="min-h-64 w-full"
                    />
                  </div>
                  <p className="font-display text-3xl text-cream-50">{product.name}</p>
                  <p className="mt-2 text-sm leading-6 text-cream-100/60">{product.notes.join(' / ')}</p>
                  <p className="mt-4 text-sm font-semibold text-gold-300">{formatCurrency(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="concierge" className="border-y border-white/10 bg-ink-900 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">AI fragrance concierge</p>
            <h2 className="mt-4 font-display text-4xl text-cream-50 sm:text-5xl">A private host before the sale begins.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cream-100/68">
              The experience asks for the visitor name, captures fragrance intent by voice or tap, then moves into
              heritage storytelling before product discovery.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {scentIntents.map((intent) => (
                <Link
                  key={intent}
                  to={`/shop?mood=${intent.toLowerCase()}`}
                  className="luxury-focus flex items-center justify-between rounded-md border border-white/10 bg-ink-950 px-4 py-4 text-sm uppercase tracking-[0.22em] text-cream-100/72 transition hover:border-gold-500/60 hover:text-gold-300"
                >
                  {intent}
                  <Sparkles size={16} />
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[34rem] overflow-hidden rounded-md border border-gold-500/20 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.22),transparent_18rem),linear-gradient(180deg,#11100d,#030303)] p-6">
            <div className="absolute left-1/2 top-8 h-44 w-28 -translate-x-1/2 rounded-full border border-gold-300/30 bg-gold-500/10 blur-sm" />
            <div className="relative z-10 mx-auto flex h-full max-w-md flex-col justify-between">
              <div className="text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold-500/40 bg-ink-950/70 text-gold-300">
                  <UserRound size={34} />
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.32em] text-gold-300">Concierge silhouette</p>
                <p className="mt-3 font-serif text-3xl text-cream-50">{greeting}</p>
                <p className="mt-3 text-sm leading-6 text-cream-100/62">What are you looking for today?</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-md border border-white/10 bg-ink-950/82 p-4">
                  <div className="flex items-center gap-3 text-gold-300">
                    <Mic size={18} />
                    <span className="text-xs uppercase tracking-[0.26em]">Voice ready</span>
                  </div>
                  <p className="mt-3 text-sm text-cream-100/64">"I want an oud fragrance."</p>
                </div>
                <LuxuryButton as={Link} to="/ai-consultant" className="w-full">
                  Speak To Concierge
                </LuxuryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Voice command layer</p>
            <h2 className="mt-4 font-display text-4xl text-cream-50">Commands designed around buying intent.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {voiceCommands.map((command) => (
              <div key={command} className="rounded-md border border-white/10 bg-ink-900 px-5 py-4">
                <div className="flex items-center gap-3 text-gold-300">
                  <WandSparkles size={17} />
                  <span className="text-xs uppercase tracking-[0.22em]">{command}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
