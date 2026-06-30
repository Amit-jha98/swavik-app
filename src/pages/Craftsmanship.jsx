import { FlaskConical, Flower2, Hand, PackageCheck } from 'lucide-react';
import { MediaStage } from '@/components/luxury/MediaStage';

const craftSteps = [
  {
    icon: Flower2,
    title: 'Select Botanicals',
    copy: 'Rose, jasmine, saffron, sandalwood, oud, and amber materials are chosen by note family.',
    video: '/media/welcome-film.mp4'
  },
  {
    icon: FlaskConical,
    title: 'Distill And Age',
    copy: 'Traditional extraction cues are paired with modern quality control and batch memory.',
    video: '/media/heritage-film.mp4'
  },
  {
    icon: Hand,
    title: 'Compose By Occasion',
    copy: 'Each fragrance maps to mood, fabric, climate, and ceremony before product discovery.',
    video: '/media/confirmation-film.mp4'
  },
  {
    icon: PackageCheck,
    title: 'Present As Luxury',
    copy: 'Final selections move into gift box delivery, checkout, and order tracking.',
    video: '/media/craft-film.mp4'
  }
];

function CraftStepCard({ icon: Icon, title, copy, video }) {
  return (
    <article className="overflow-hidden rounded-md border border-white/10 bg-ink-900 shadow-velvet">
      <div className="relative aspect-video overflow-hidden bg-ink-950">
        <video
          className="sfp-cinema-video h-full w-full object-cover"
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-gold-300">
          <Icon size={20} />
          <span className="text-xs uppercase tracking-[0.24em]">{title}</span>
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-display text-2xl text-cream-50">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-cream-100/62">{copy}</p>
      </div>
    </article>
  );
}

export function Craftsmanship() {
  return (
    <main className="min-h-svh bg-ink-950 px-6 py-28 text-cream-50">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.42em] text-gold-300">Craftsmanship</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl text-cream-50 sm:text-6xl">
          From raw ingredient to remembered signature.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-cream-100/68">
          Each stage now has its own cinematic asset, with the full showroom craft film closing the sequence.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {craftSteps.map((step) => (
            <CraftStepCard key={step.title} {...step} />
          ))}
        </div>

        <div className="mt-8">
          <MediaStage
            eyebrow=""
            title="Ingredient To Bottle"
            copy="The full craft sequence from material selection to showroom presentation."
            src="/media/showroom-ambient.mp4"
          />
        </div>
      </div>
    </main>
  );
}
