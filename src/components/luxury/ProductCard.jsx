import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';
import { BottleStage } from './BottleStage';

export function ProductCard({ product, onSelect }) {
  return (
    <motion.article
      className="sfp-card-glow group grid min-h-[28rem] rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_15%,rgba(212,175,55,0.16),transparent_14rem),linear-gradient(180deg,#11100d,#050505)] p-5 text-left shadow-velvet transition duration-500 ease-luxury hover:border-gold-500/50"
      whileHover={{ y: -6 }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-300">{product.badge}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.22em] text-cream-100/45">{product.size}</span>
          <button
            className="luxury-focus grid h-8 w-8 place-items-center rounded-full border border-white/10 text-cream-100/40 transition hover:border-rose-400/40 hover:text-rose-400"
            type="button"
            aria-label={`Wishlist ${product.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Heart size={14} />
          </button>
        </div>
      </div>
      <div className="my-8 grid place-items-center">
        <BottleStage
          src={product.asset}
          alt={product.name}
          size="small"
          tone={product.bottleTone}
          className="min-h-64 w-full"
        />
      </div>
      <div className="mt-auto">
        <p className="font-display text-3xl text-cream-50">{product.name}</p>
        <p className="mt-2 text-sm leading-6 text-cream-100/60">{product.description}</p>
        <p className="mt-4 text-sm text-cream-100/50">{product.notes?.join(' / ')}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-gold-300">{formatCurrency(product.price)}</span>
          <div className="flex gap-2">
            <Link
              className="luxury-focus grid h-10 w-10 place-items-center rounded-full border border-white/10 text-cream-100/70 transition hover:border-gold-500/60 hover:text-gold-300"
              to={`/product/${product.slug}`}
              aria-label={`View ${product.name}`}
            >
              <Eye size={16} />
            </Link>
            <button
              className="luxury-focus grid h-10 w-10 place-items-center rounded-full border border-gold-500/50 text-gold-300 transition hover:bg-gold-500 hover:text-ink-950 hover:shadow-[0_0_16px_rgba(212,175,55,0.2)]"
              type="button"
              onClick={() => onSelect?.(product)}
              aria-label={`Add ${product.name}`}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
