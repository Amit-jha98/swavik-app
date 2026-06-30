import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Droplets, FlameKindling, Gem, Landmark, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { luxuryEase } from '@/lib/animation';

const heritageScenes = [
  {
    icon: Landmark,
    title: 'Kannauj Awakens',
    eyebrow: 'Origin',
    date: '1810',
    video: '/media/bottles/01.mp4',
    copy:
      'In Kannauj, fragrance begins before commerce. Flower markets open with the morning air, perfumers sort raw materials by instinct, and a house style begins around patience, restraint, and memory.'
  },
  {
    icon: Sparkles,
    title: 'A Signature Is Chosen',
    eyebrow: 'Selection',
    date: '1928',
    video: '/media/bottles/02.mp4',
    copy:
      'As fragrance moves from family craft into personal ritual, the bottle becomes more than packaging. It becomes the object a wearer returns to before a ceremony, an evening, or a remembered place.'
  },
  {
    icon: FlameKindling,
    title: 'Fire, Copper, Time',
    eyebrow: 'Distillation',
    date: '1975',
    video: '/media/heritage-film.mp4',
    copy:
      'Copper degs, slow heat, rose fields, sandalwood, and attar-making rituals carry the discipline forward. Every batch asks for timing rather than speed.'
  },
  {
    icon: Droplets,
    title: 'Material Into Memory',
    eyebrow: 'Craft',
    date: '2010',
    video: '/media/craft-film.mp4',
    copy:
      'Oils are balanced by mood, climate, fabric, and occasion. The result is not only a note pyramid, but a profile that feels personally remembered before it is worn.'
  },
  {
    icon: Gem,
    title: 'Heritage Becomes Swavik',
    eyebrow: 'Modern Luxury',
    date: 'Today',
    video: '/media/showroom-ambient.mp4',
    copy:
      'The old craft now enters a digital showroom, where AI-led discovery, cinematic storytelling, and luxury presentation make the Kannauj lineage feel immediate again.'
  }
];

export function Heritage() {
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeScene = heritageScenes[activeIndex];
  const ActiveIcon = activeScene.icon;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    setProgress(0);
    setAudioBlocked(false);
    video.pause();
    video.muted = !soundEnabled;
    video.currentTime = 0;
    video.load();

    const playTimer = window.setTimeout(() => {
      const playPromise = video.play();
      playPromise?.catch(() => {
        setAudioBlocked(true);
        video.muted = true;
        video.play().catch(() => {});
      });
    }, 80);

    return () => window.clearTimeout(playTimer);
  }, [activeIndex, soundEnabled]);

  function handleEnded() {
    const nextIndex = activeIndex + 1;
    setUnlockedIndex((current) => Math.max(current, nextIndex));
    setProgress(100);

    if (nextIndex < heritageScenes.length) {
      window.setTimeout(() => {
        setActiveIndex(nextIndex);
      }, 360);
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video?.duration) {
      return;
    }

    setProgress(Math.min(100, (video.currentTime / video.duration) * 100));
  }

  function enableSound() {
    const video = videoRef.current;
    setSoundEnabled(true);
    setAudioBlocked(false);
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        setSoundEnabled(false);
        setAudioBlocked(true);
      });
    }
  }

  function selectScene(index) {
    if (index > unlockedIndex) {
      return;
    }

    setActiveIndex(index);
  }

  return (
    <main className="sfp-heritage-page min-h-svh overflow-hidden px-4 py-28 text-cream-50 sm:px-6">
      <section className="sfp-heritage-shell mx-auto">
        <motion.div
          className="flex flex-col gap-5 border-y border-white/10 py-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: luxuryEase }}
        >
          <div className="min-w-0 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">About Heritage</p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-cream-50 sm:text-7xl">Kannauj, since 1810.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-cream-100/68 sm:text-base sm:leading-8">
              A five-part film journey through Swavik's origin, ritual, distillation, craft, and modern digital showroom.
            </p>
          </div>

          <div className="flex w-full min-w-0 items-center justify-between gap-3 rounded-md border border-white/10 bg-ink-900/70 p-2 sm:w-auto">
            {audioBlocked ? (
              <p className="text-xs uppercase tracking-[0.2em] text-cream-100/45">Tap to enable audio</p>
            ) : null}
            <button
              className="luxury-focus inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-4 py-3 text-xs uppercase tracking-[0.22em] text-gold-300 transition hover:bg-gold-500 hover:text-ink-950"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (soundEnabled) {
                  setSoundEnabled(false);
                } else {
                  enableSound();
                }
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {soundEnabled ? 'Audio On' : 'Enable Audio'}
            </button>
          </div>
        </motion.div>

        <div className="sfp-heritage-grid mt-10 grid min-w-0 gap-5 lg:gap-8 items-start lg:items-center">
          <motion.div
            className="sfp-heritage-video min-w-0 overflow-hidden rounded-md border border-white/10 bg-ink-900 shadow-velvet"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <div className="relative aspect-[4/5] sm:aspect-video">
              <video
                ref={videoRef}
                className="sfp-cinema-video h-full w-full object-cover"
                playsInline
                preload="auto"
                muted={!soundEnabled}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
              >
                <source src={activeScene.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/78 via-transparent to-transparent" />
              <div className="absolute inset-x-4 top-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-full border border-white/10 bg-ink-950/75 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-gold-300 sm:text-xs">
                  {activeScene.eyebrow}
                </span>
                <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-gold-300 sm:text-xs">
                  {activeIndex === heritageScenes.length - 1 && progress >= 99 ? 'Complete' : 'Playing'}
                </span>
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gold-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="sfp-heritage-timeline relative grid min-h-[26rem] lg:min-h-[34rem] place-items-center py-4">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 120 420" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M60 10 C10 70 110 120 60 180 C10 240 110 290 60 350 C42 372 42 392 60 410"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <motion.path
                d="M60 10 C10 70 110 120 60 180 C10 240 110 290 60 350 C42 372 42 392 60 410"
                fill="none"
                stroke="rgba(212,175,55,0.88)"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ pathLength: (activeIndex + progress / 100) / heritageScenes.length }}
                transition={{ duration: 0.45, ease: luxuryEase }}
              />
            </svg>
            <div className="relative z-10 grid gap-6">
              {heritageScenes.map((scene, index) => {
                const Icon = scene.icon;
                const isUnlocked = index <= unlockedIndex;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={scene.title}
                    className={`luxury-focus grid h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 place-items-center rounded-full border bg-ink-950 transition ${
                      isActive
                        ? 'border-gold-500 text-gold-300 shadow-aureate'
                        : isUnlocked
                          ? 'border-gold-500/45 text-gold-300'
                          : 'border-white/10 text-cream-100/35'
                    }`}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => selectScene(index)}
                    aria-label={scene.title}
                  >
                    {index < unlockedIndex ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : <Icon className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.article
            key={activeScene.title}
            className="sfp-heritage-card relative min-w-0 overflow-hidden rounded-md border border-gold-500/35 p-5 shadow-aureate sm:p-7"
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: luxuryEase }}
          >
            <div className="absolute right-0 top-0 h-28 w-28 bg-gold-500/10 blur-2xl" />
            <div className="flex items-center gap-4 text-gold-300">
              <span className="text-xs uppercase tracking-[0.32em]">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.28em] text-cream-100/45">{activeScene.date}</span>
            </div>
            <motion.h2
              className="mt-5 max-w-[16ch] font-display text-2xl leading-tight text-cream-50 sm:text-3xl lg:text-5xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: luxuryEase, delay: 0.05 }}
            >
              {activeScene.title}
            </motion.h2>
            <motion.p
              className="mt-4 max-w-prose text-sm lg:text-base leading-6 sm:leading-7 lg:leading-8 text-cream-100/68"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: luxuryEase, delay: 0.14 }}
            >
              {activeScene.copy}
            </motion.p>

            <div className="hidden" />
          </motion.article>
        </div>

        <div className="pointer-events-none h-0 overflow-hidden">
          {heritageScenes.slice(1).map((scene) => (
            <video key={scene.video} src={scene.video} preload="auto" muted playsInline />
          ))}
        </div>
      </section>
    </main>
  );
}
