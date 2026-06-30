import { useState } from 'react';
import { Video } from 'lucide-react';

export function MediaStage({ eyebrow, title, copy, src, poster, children }) {
  const [mediaReady, setMediaReady] = useState(Boolean(src));

  return (
    <div className="relative overflow-hidden rounded-md border border-white/10 bg-ink-900 shadow-velvet">
      <div className="aspect-[16/9] min-h-72 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.2),transparent_18rem),linear-gradient(135deg,#11100d,#030303)]">
        {mediaReady ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            onError={() => setMediaReady(false)}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="grid h-full place-items-center px-8 text-center">
            <div>
              <Video className="mx-auto text-gold-300" size={34} />
              {eyebrow ? <p className="mt-5 text-xs uppercase tracking-[0.32em] text-gold-300">{eyebrow}</p> : null}
              <p className="mt-3 font-display text-3xl text-cream-50">{title}</p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-cream-100/65">{copy}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="mt-2 font-display text-3xl text-cream-50">{title}</h3>
          </div>
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
}
