import { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, staggerContainer } from '@/lib/animation';
import { BottleStage } from './BottleStage';
import { LuxuryButton } from './LuxuryButton';
import { GoldenParticles } from './GoldenParticles';
import { CinematicContext } from '@/App';

export function Hero() {
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

    // Initial check
    manageVideoState();

    document.addEventListener('visibilitychange', manageVideoState);
    return () => document.removeEventListener('visibilitychange', manageVideoState);
  }, [cinematic]);

  return (
    <section className="sfp-page relative grid min-h-svh overflow-hidden px-6 py-24 text-center lg:grid-cols-[0.95fr_1.05fr] lg:place-items-center lg:text-left">
      <video
        ref={videoRef}
        className="sfp-cinema-video absolute inset-0 h-full w-full object-cover"
        src="/media/welcome-film.mp4"
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0.92),rgba(3,3,3,0.68),rgba(3,3,3,0.88))]" />
      <GoldenParticles className="z-[1]" />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl lg:mx-0 lg:ml-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-gold-500 to-transparent lg:mx-0"
          variants={fadeUp}
        />
        <motion.p className="mt-5 font-sans text-xs uppercase tracking-[0.45em] text-gold-300" variants={fadeUp}>
          AI-Powered Luxury Fragrance Experience
        </motion.p>
        <motion.h1
          className="mt-5 font-display text-5xl font-medium uppercase leading-none tracking-[0.18em] text-cream-50 sm:text-7xl"
          variants={fadeUp}
        >
          SWAVIK
        </motion.h1>
        <motion.p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-cream-100/75 lg:mx-0" variants={fadeUp}>
          A private digital perfumery for heritage attars, cinematic product discovery, and AI-led fragrance matching.
        </motion.p>
        <motion.div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start" variants={fadeUp}>
          <LuxuryButton as="a" href="#concierge" className="sfp-btn-shimmer">
            Begin Experience
          </LuxuryButton>
          <LuxuryButton as={Link} to="/ai-consultant" className="border-white/20 text-cream-100">
            Speak To Concierge
          </LuxuryButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-12 w-full lg:mt-0"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.25 }}
      >
        <BottleStage src="/media/glass-bottle.png" alt="Swavik glass perfume bottle" size="large" />
      </motion.div>
    </section>
  );
}
