import React, { useState } from 'react';
import { Heart, Sparkles } from '../ui/Icons';

/**
 * DreamySleepingCard - Thơ mộng & Ẩn lớp (Dreamy Layered Card)
 * Replaces cartoon sleeping mascots with poetic, layered animal photography.
 * Features:
 * - Multi-layer ambient glow backdrop (ẩn lớp ánh sáng)
 * - Frosted glass inner framing with specular highlight
 * - Dreamy light leak / sunbeam gradient veil
 * - Floating poetic caption pill with delicate glow
 */
export default function DreamySleepingCard({
  src,
  alt = 'Giấc ngủ an lành của bé',
  caption = 'Mỗi bé được cứu đều xứng đáng có một giấc ngủ an lành.',
  badge = 'Giấc ngủ bình yên',
  className = ''
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`dreamy-sleeping-card-stage ${className}`} aria-label={caption}>
      {/* Layer 1: Ambient Warm Glow (Ẩn lớp phát sáng dịu nhẹ) */}
      <div className="dreamy-card-halo" aria-hidden="true" />
      <div className="dreamy-card-halo-secondary" aria-hidden="true" />

      {/* Layer 2: Main Layered Frame */}
      <div className="dreamy-card-frame">
      

        {/* Layer 3: Image Container with Soft Shadow & Vignette */}
        <div className={`dreamy-card-media ${isLoaded ? 'is-loaded' : ''}`}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className="dreamy-card-img"
          />

          {/* Layer 4: Dreamy Veil & Light Leak Overlay (Hiệu ứng thơ mộng) */}
          <div className="dreamy-card-veil" aria-hidden="true" />
          <div className="dreamy-card-shimmer" aria-hidden="true" />

          {/* Floating 'z z z' peaceful breathing indicator */}
          <div className="dreamy-zzz-indicator" aria-hidden="true">
            <span className="zzz z1">z</span>
            <span className="zzz z2">Z</span>
            <span className="zzz z3">Z</span>
          </div>
        </div>

        {/* Layer 5: Floating Poetic Caption Pill */}
        <div className="dreamy-caption-box">
          <span className="dreamy-caption-dot" aria-hidden="true">
            <Heart size={12} fill="currentColor" />
          </span>
          <p className="dreamy-caption-text">{caption}</p>
        </div>
      </div>
    </div>
  );
}

