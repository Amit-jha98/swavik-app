import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoldenParticles } from './GoldenParticles';
import { LuxuryButton } from './LuxuryButton';

const SESSION_KEY = 'swavik.welcomeSeen';
const luxuryEase = [0.19, 1, 0.22, 1];

export function WelcomeOverlay({ onComplete }) {
  const [phase, setPhase] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      return 'done';
    }
    return 'entry';
  });
  const videoRef = useRef(null);
  const hasCompletedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 900);
  }, [onComplete]);

  function handleBeginExperience() {
    setPhase('video');
  }

  function handleSpeakToConcierge() {
    finish();
    setTimeout(() => {
      window.location.hash = '';
      window.location.pathname = '/ai-consultant';
    }, 200);
  }

  useEffect(() => {
    if (phase === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.play().catch(() => {});
    }
  }, [phase]);

  function handleVideoEnd() {
    finish();
  }

  function handleSkipVideo() {
    if (videoRef.current) videoRef.current.pause();
    finish();
  }

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="sfp-welcome-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: luxuryEase }}
        >
          <GoldenParticles density="dense" />

          {/* Gold vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,175,55,0.06),transparent_60%)]" />

          <AnimatePresence mode="wait">
            {phase === 'entry' && (
              <motion.div
                key="entry"
                className="sfp-welcome-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease: luxuryEase }}
              >
                {/* Ornamental line */}
                <motion.div
                  className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: luxuryEase }}
                />

                <motion.p
                  className="mt-6 text-xs uppercase tracking-[0.6em] text-gold-300/70"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: luxuryEase }}
                >
                  Est. 1810 — Kannauj
                </motion.p>

                <motion.h1
                  className="sfp-welcome-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7, ease: luxuryEase }}
                >
                  Welcome To
                  <br />
                  <span className="sfp-welcome-brand">SWAVIK</span>
                </motion.h1>

                <motion.p
                  className="mx-auto mt-4 max-w-md text-sm leading-7 text-cream-100/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.1, ease: luxuryEase }}
                >
                  A fragrance heritage rooted in Kannauj since 1810.
                </motion.p>

                {/* Ornamental line */}
                <motion.div
                  className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.3, ease: luxuryEase }}
                />

                <motion.div
                  className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5, ease: luxuryEase }}
                >
                  <LuxuryButton
                    onClick={handleBeginExperience}
                    className="sfp-welcome-btn-glow px-8 py-4 text-xs"
                  >
                    Begin Experience
                  </LuxuryButton>
                  <LuxuryButton
                    onClick={handleSpeakToConcierge}
                    className="border-white/20 text-cream-100/70 hover:border-gold-500/60 hover:text-gold-300 px-8 py-4 text-xs"
                  >
                    Speak To Concierge
                  </LuxuryButton>
                </motion.div>
              </motion.div>
            )}

            {phase === 'video' && (
              <motion.div
                key="video"
                className="sfp-welcome-video-wrap"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
              >
                <video
                  ref={videoRef}
                  className="sfp-welcome-video"
                  src="/media/transparent_greeting.webm"
                  autoPlay
                  playsInline
                  onEnded={handleVideoEnd}
                />
                <button
                  className="sfp-welcome-skip"
                  onClick={handleSkipVideo}
                  type="button"
                >
                  Skip →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
