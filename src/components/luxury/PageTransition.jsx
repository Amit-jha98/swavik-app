import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp } from '@/lib/animation';

export function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pageKey} variants={fadeUp} initial="hidden" animate="visible" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
