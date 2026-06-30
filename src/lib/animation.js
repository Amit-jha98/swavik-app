export const luxuryEase = [0.19, 1, 0.22, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: luxuryEase }
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: luxuryEase }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12
    }
  }
};
