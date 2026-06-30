export function LuxuryButton({ as: Component = 'button', className = '', size = 'md', ...props }) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-[10px]',
    md: 'px-5 py-3 text-[11px]',
    lg: 'px-8 py-4 text-xs',
  }[size] || 'px-5 py-3 text-[11px]';

  return (
    <Component
      className={`luxury-focus sfp-btn-shimmer inline-flex items-center justify-center gap-2 rounded-sm border border-gold-500 ${sizeClasses} font-sans font-semibold uppercase tracking-[0.28em] text-gold-300 transition duration-500 ease-luxury hover:bg-gold-500 hover:text-ink-950 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)] ${className}`}
      {...props}
    />
  );
}
