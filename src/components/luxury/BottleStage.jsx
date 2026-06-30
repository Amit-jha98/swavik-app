import { useState } from 'react';

export function BottleStage({
  src = '/media/glass-bottle.png',
  alt = 'Swavik perfume bottle',
  size = 'large',
  tone = 'glass',
  className = ''
}) {
  const [showImage, setShowImage] = useState(Boolean(src));
  const sizeClass = {
    small: 'h-44 sm:h-52',
    medium: 'h-64 sm:h-72',
    large: 'h-80 sm:h-[26rem]'
  }[size];

  return (
    <div className={`sfp-bottle-stage ${className}`}>
      <div className={`sfp-bottle-aura ${tone === 'black' ? 'sfp-bottle-aura-dark' : ''}`} />
      <div className="sfp-orbit sfp-orbit-one" />
      <div className="sfp-orbit sfp-orbit-two" />
      {showImage ? (
        <img
          className={`sfp-rotating-bottle ${sizeClass}`}
          src={src}
          alt={alt}
          onError={() => setShowImage(false)}
        />
      ) : (
        <div className={`${sizeClass} w-28 rounded-[2rem] border border-gold-300/35 bg-gradient-to-b from-gold-100/35 via-gold-500/12 to-ink-950 shadow-aureate`} />
      )}
      <div className="sfp-bottle-reflection" />
    </div>
  );
}
