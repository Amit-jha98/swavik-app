import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { useCart } from '@/context/CartContext.jsx';
import { formatCurrency } from '@/lib/formatters';

const luxuryEase = [0.19, 1, 0.22, 1];

export function CartDrawer() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  return (
    <aside className="rounded-md border border-white/10 bg-ink-900 p-5">
      <div className="flex items-center gap-2 text-gold-300">
        <ShoppingBag size={18} />
        <span className="text-xs uppercase tracking-[0.25em]">Personal Selection</span>
        {items.length > 0 && (
          <span className="ml-auto text-xs text-cream-100/40">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {items.length ? (
        <div className="mt-6 grid gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="rounded-md border border-white/10 bg-ink-950 p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.35, ease: luxuryEase }}
                layout
              >
                <div className="flex items-start gap-4">
                  {/* Product thumbnail */}
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.12),transparent_70%)] border border-white/6">
                    <img
                      src={item.asset}
                      alt={item.name}
                      className="h-full w-full object-contain p-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <Link to={`/product/${item.slug}`} className="font-display text-xl text-cream-50 hover:text-gold-300 transition">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-cream-100/45">{item.size}</p>
                    <p className="mt-2 text-sm font-semibold text-gold-300">{formatCurrency(item.price)}</p>
                  </div>
                  <button
                    className="luxury-focus rounded-full p-2 text-cream-100/40 transition hover:text-rose-400"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="luxury-focus grid h-8 w-8 place-items-center rounded-full border border-white/10 text-cream-100/70 transition hover:border-gold-500/40 hover:text-gold-300"
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Reduce ${item.name}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-6 text-center text-sm text-cream-100">{item.quantity}</span>
                    <button
                      className="luxury-focus grid h-8 w-8 place-items-center rounded-full border border-white/10 text-cream-100/70 transition hover:border-gold-500/40 hover:text-gold-300"
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-cream-100/60">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-sm uppercase tracking-[0.24em] text-cream-100/55">Total</span>
            <span className="font-display text-3xl text-cream-50">{formatCurrency(total)}</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-white/10 bg-ink-950 p-5">
          <p className="text-sm leading-7 text-cream-100/62">
            Your private selection is empty. Begin with the oud room or ask the concierge for a recommendation.
          </p>
          <LuxuryButton as={Link} to="/shop" className="mt-5 w-full">
            Discover Fragrances
          </LuxuryButton>
        </div>
      )}
    </aside>
  );
}
