import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animation';

export function CinematicSection({ eyebrow, title, children }) {
  return (
    <motion.section
      className="px-6 py-24"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
    >
      <div className="mx-auto max-w-6xl">
        {eyebrow ? <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold-300">{eyebrow}</p> : null}
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium text-cream-50">{title}</h2>
        <div className="mt-8 text-cream-100/70">{children}</div>
      </div>
    </motion.section>
  );
}
