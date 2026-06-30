import { Link } from 'react-router-dom';
import { brand } from '@/lib/constants';

const footerLinks = {
  Collections: [
    { label: 'Indian Heritage', to: '/shop?mood=heritage' },
    { label: 'Arabian Collection', to: '/shop?mood=arabian' },
    { label: 'Global Collection', to: '/shop?mood=luxury' },
    { label: 'All Fragrances', to: '/shop' },
  ],
  Heritage: [
    { label: 'Our Story', to: '/heritage' },
    { label: 'Craftsmanship', to: '/craftsmanship' },
    { label: 'Kannauj Legacy', to: '/heritage' },
  ],
  Support: [
    { label: 'Track Order', to: '/track-order' },
    { label: 'My Account', to: '/account' },
    { label: 'AI Concierge', to: '/ai-consultant' },
    { label: 'Wishlist', to: '/wishlist' },
  ],
};

export function Footer() {
  return (
    <footer className="sfp-footer">
      <div className="sfp-footer-gold-line" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl uppercase tracking-[0.45em] text-gold-300">
              {brand.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-cream-100/50">
              A private digital perfumery for heritage attars, cinematic product discovery,
              and AI-led fragrance matching.
            </p>
            <p className="mt-4 text-xs text-cream-100/35">{brand.origin}</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase tracking-[0.3em] text-gold-300/70">{title}</h4>
              <ul className="mt-4 grid gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream-100/50 transition hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream-100/30">
            © {new Date().getFullYear()} {brand.name}. All rights reserved. Crafted in Kannauj.
          </p>
          <p className="text-xs text-cream-100/25">
            AI-Powered Luxury Fragrance Experience
          </p>
        </div>
      </div>
    </footer>
  );
}
