import { useEffect, useRef, useState, useContext } from 'react';
import { CinematicContext } from '@/App';
import { motion } from 'framer-motion';
import { FlaskConical, Flower2, Hand, PackageCheck, Volume2, VolumeX } from 'lucide-react';
import { fadeUp } from '@/lib/animation';

const craftScenes = [
  {
    icon: Flower2,
    title: 'Select Botanicals',
    copy: 'Rose, jasmine, saffron, sandalwood, oud, and amber materials are chosen by note family before a blend is born.',
    video: '/media/welcome-film.mp4'
  },
  {
    icon: FlaskConical,
    title: 'Distill And Age',
    copy: 'Traditional extraction cues meet modern quality control, letting each oil settle into clarity, body, and memory.',
    video: '/media/heritage-film.mp4'
  },
  {
    icon: Hand,
    title: 'Compose By Occasion',
    copy: 'The composition is shaped around mood, fabric, climate, and ceremony so the fragrance feels personally chosen.',
    video: '/media/confirmation-film.mp4'
  },
  {
    icon: PackageCheck,
    title: 'Present As Luxury',
    copy: 'The finished selection moves into gift-ready presentation, checkout, and delivery tracking.',
    video: '/media/craft-film.mp4'
  },
  {
    icon: Volume2,
    title: 'Ingredient To Bottle',
    copy: 'The full cinematic craft sequence closes the journey and leads naturally into the AI concierge experience.',
    video: '/media/showroom-ambient.mp4'
  }
];

export function CraftScrollStory() {
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const sceneRefs = useRef([]);
  const touchStartY = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState(() => craftScenes.map(() => false));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const activeLocked = !completed[activeIndex];

  const cinematic = useContext(CinematicContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveIndex(Number(visible.target.dataset.sceneIndex));
        }
      },
      { threshold: [0.45, 0.65, 0.85] }
    );

    sceneRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityAndPlay = () => {
      videoRefs.current.forEach((video, index) => {
        if (!video) return;

        if (cinematic || document.hidden) {
          video.pause();
        } else if (index === activeIndex) {
          video.currentTime = video.currentTime || 0;
          video.muted = !soundEnabled;
          const playPromise = video.play();
          playPromise?.catch(() => {
            setAudioBlocked(true);
            video.muted = true;
            video.play().catch(() => {});
          });
        } else {
          video.pause();
        }
      });
    };

    handleVisibilityAndPlay();

    document.addEventListener('visibilitychange', handleVisibilityAndPlay);
    return () => document.removeEventListener('visibilitychange', handleVisibilityAndPlay);
  }, [activeIndex, soundEnabled, cinematic]);

  function markComplete(index) {
    setCompleted((current) => current.map((value, itemIndex) => (itemIndex === index ? true : value)));
  }

  function isDesktopViewport() {
    return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  }

  function completeAndAdvance(index) {
    markComplete(index);
    const nextScene = sceneRefs.current[index + 1];
    if (nextScene) {
      window.setTimeout(() => {
        nextScene.scrollIntoView({ behavior: 'smooth', block: isDesktopViewport() ? 'center' : 'start' });
      }, 280);
    }
  }

  function enableSound() {
    setSoundEnabled(true);
    setAudioBlocked(false);
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.muted = false;
      activeVideo.play().catch(() => setAudioBlocked(true));
    }
  }

  useEffect(() => {
    function isSectionInView() {
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) {
        return false;
      }

      return bounds.top < window.innerHeight * 0.72 && bounds.bottom > window.innerHeight * 0.28;
    }

    function blockForwardScroll(event) {
      if (!activeLocked || !isSectionInView() || !isDesktopViewport()) {
        return;
      }

      event.preventDefault();
      sceneRefs.current[activeIndex]?.scrollIntoView({ block: 'center' });
    }

    function handleWindowWheel(event) {
      if (event.deltaY > 0) {
        blockForwardScroll(event);
      }
    }

    function handleWindowKeydown(event) {
      const lockedKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End'];
      if (lockedKeys.includes(event.key)) {
        blockForwardScroll(event);
      }
    }

    function handleTouchStart(event) {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    }

    function handleTouchMove(event) {
      if (touchStartY.current == null) {
        return;
      }

      const nextY = event.touches[0]?.clientY ?? touchStartY.current;
      if (touchStartY.current - nextY > 8) {
        blockForwardScroll(event);
      }
    }

    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    window.addEventListener('keydown', handleWindowKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWindowWheel);
      window.removeEventListener('keydown', handleWindowKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeIndex, activeLocked]);

  function handleWheel(event) {
    if (event.deltaY > 0 && activeLocked) {
      event.preventDefault();
    }
  }

  return (
    <section
      ref={sectionRef}
      id="craft-journey"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(212,175,55,0.12),transparent_28rem),linear-gradient(180deg,#030303,#080706_48%,#030303)] px-4 py-14 text-cream-50 sm:px-6 sm:py-20 lg:py-24"
      onWheel={handleWheel}
      onPointerDown={enableSound}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Craft journey</p>
            <h2 className="mt-2 font-display text-2xl text-cream-50 sm:text-3xl">Five films. One fragrance ritual.</h2>
          </div>

          <div className="flex w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-ink-900/70 p-2 sm:w-auto">
            {audioBlocked ? (
              <p className="hidden text-xs uppercase tracking-[0.2em] text-cream-100/45 sm:block">Tap to enable audio</p>
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
        </div>

        <div className="relative mt-7 lg:mt-8">
          <div className="grid gap-7 lg:gap-14">
            {craftScenes.map((scene, index) => {
              const Icon = scene.icon;
              const isActive = activeIndex === index;
              const isCompleted = completed[index];
              return (
                <article
                  key={scene.title}
                  ref={(node) => {
                    sceneRefs.current[index] = node;
                  }}
                  data-scene-index={index}
                  className="relative grid gap-4 scroll-mt-24 rounded-md border border-white/10 bg-ink-900/35 p-3 lg:min-h-[92svh] lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,0.9fr)] lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0"
                >
                  <div className="relative overflow-hidden rounded-md border border-white/10 bg-ink-900 shadow-velvet lg:sticky lg:top-28">
                    <video
                      ref={(node) => {
                        videoRefs.current[index] = node;
                      }}
                      className="sfp-cinema-video aspect-[4/5] h-full w-full object-cover sm:aspect-video"
                      src={scene.video}
                      muted={!soundEnabled}
                      playsInline
                      preload="metadata"
                      onEnded={() => completeAndAdvance(index)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/82 via-transparent to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                      <div
                        className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] sm:px-4 sm:text-xs sm:tracking-[0.22em] ${
                          isCompleted
                            ? 'border-gold-500/40 bg-gold-500/15 text-gold-300'
                            : 'border-white/10 bg-ink-950/80 text-cream-100/70'
                        }`}
                      >
                        {isCompleted ? 'Next stage unlocked' : 'Watching required'}
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden min-h-[30rem] place-items-center lg:grid">
                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                    <div
                      className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gold-500 transition-all duration-700"
                      style={{ height: `${isActive ? (isCompleted ? 100 : 52) : index < activeIndex ? 100 : 0}%` }}
                    />
                    <div
                      className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border bg-ink-950 transition duration-500 ${
                        isActive
                          ? 'border-gold-500 text-gold-300 shadow-aureate'
                          : isCompleted
                            ? 'border-gold-500/45 text-gold-300'
                            : 'border-white/10 text-cream-100/45'
                      }`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>

                  <motion.div
                    className={`relative overflow-hidden rounded-md border p-4 transition duration-500 sm:p-6 lg:p-7 ${
                      isActive
                        ? 'border-gold-500/45 bg-[radial-gradient(circle_at_15%_0%,rgba(212,175,55,0.13),transparent_20rem),#0b0a08]'
                        : 'border-white/10 bg-ink-900/55'
                    }`}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.45 }}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 bg-gold-500/10 blur-2xl" />
                    <div className="flex items-center gap-3 text-gold-300 sm:gap-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 sm:h-12 sm:w-12 lg:hidden">
                        <Icon size={22} />
                      </span>
                      <span className="text-xs uppercase tracking-[0.28em]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-cream-50 sm:mt-6 sm:text-5xl">{scene.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-cream-100/68 sm:mt-4 sm:text-base sm:leading-8">{scene.copy}</p>
                  </motion.div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
