import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingBag, Sparkles, UserRound, X } from 'lucide-react';
import { appRoutes } from '@/app/routes.jsx';
import { useCart } from '@/context/CartContext.jsx';

const navRoutes = ['/', '/shop', '/heritage', '/craftsmanship', '/track-order'];
const luxuryEase = [0.19, 1, 0.22, 1];

export function Navbar({ hidden = false }) {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredRoutes = appRoutes.filter((route) => navRoutes.includes(route.path));

  if (hidden) return null;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-ink-950/75 px-6 backdrop-blur-xl"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: luxuryEase, delay: 0.1 }}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between">
          <Link className="font-display text-xl uppercase tracking-[0.45em] text-gold-300" to="/">
            SWAVIK
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 lg:flex">
            {filteredRoutes.map((route) => {
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={route.path}
                  className={`relative text-xs uppercase tracking-[0.24em] transition duration-300 ${
                    isActive ? 'text-gold-300' : 'text-cream-100/65 hover:text-gold-300'
                  }`}
                  to={route.path}
                >
                  {route.label}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold-500"
                      layoutId="nav-underline"
                      transition={{ duration: 0.35, ease: luxuryEase }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 text-gold-300">
            <Link className="luxury-focus hidden rounded-full p-2 sm:block" to="/ai-consultant" aria-label="AI consultant">
              <Sparkles size={18} />
            </Link>
            <Link className="luxury-focus rounded-full p-2" to="/account" aria-label="Account">
              <UserRound size={18} />
            </Link>
            <Link className="luxury-focus relative rounded-full p-2" to="/cart" aria-label="Cart">
              <ShoppingBag size={18} />
              {cartCount ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-950">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="luxury-focus rounded-full p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sfp-mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: luxuryEase }}
          >
            <button
              className="absolute right-6 top-6 text-cream-100/60 hover:text-gold-300"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              <X size={24} />
            </button>

            <Link
              className="mb-8 font-display text-2xl uppercase tracking-[0.45em] text-gold-300"
              to="/"
              onClick={() => setMobileOpen(false)}
            >
              SWAVIK
            </Link>

            {appRoutes
              .filter((r) => r.path !== '/admin')
              .map((route) => (
                <Link
                  key={route.path}
                  className="sfp-mobile-link"
                  to={route.path}
                  onClick={() => setMobileOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
