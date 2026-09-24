import React from 'react';

/**
 * AnimalMascots - Reusable 2D/2.5D illustrated mascots with sparse, intentional motion
 * Matching the warm, rounded aesthetic of Tram Yeu Thuong (cat & dog companions).
 * All motion runs off GPU-accelerated CSS transforms and respects prefers-reduced-motion.
 */

// 1. Sleeping Mascot (About Section: peaceful cat curled up on a soft rug with gentle breathing animation)
export function SleepingMascot({ caption = 'Mỗi bé được cứu đều xứng đáng có một giấc ngủ an lành.', className = '' }) {
  return (
    <div className={`mascot-sleeping-stage ${className}`} aria-label={caption}>
      <div className="mascot-sleeping-halo" />
      <svg
        viewBox="0 0 280 200"
        width="280"
        height="200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mascot-sleeping-svg"
      >
        {/* Soft Rug */}
        <ellipse cx="140" cy="155" rx="110" ry="32" fill="#f5ede4" stroke="#e6d8cb" strokeWidth="2" strokeDasharray="4 4" />
        <ellipse cx="140" cy="155" rx="96" ry="26" fill="#fffaee" />

        {/* Floating "Z z z" */}
        <g className="mascot-zzz-float">
          <text x="185" y="85" fill="#f28e5b" fontSize="16" fontWeight="bold" fontFamily="sans-serif">z</text>
          <text x="200" y="70" fill="#f28e5b" fontSize="19" fontWeight="bold" fontFamily="sans-serif">Z</text>
          <text x="218" y="52" fill="#ff7e54" fontSize="23" fontWeight="bold" fontFamily="sans-serif">Z</text>
        </g>

        {/* Breathing Cat Body */}
        <g className="mascot-sleeping-body">
          {/* Curled Tail */}
          <path
            d="M80 150 C55 145 50 120 70 110 C85 105 95 125 90 145"
            stroke="#e0824b"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {/* Curled Body Oval */}
          <ellipse cx="138" cy="142" rx="55" ry="36" fill="#ffb488" stroke="#684e3d" strokeWidth="2.5" />
          {/* Fur pattern stripes */}
          <path d="M120 120 Q124 132 120 144" stroke="#d46b30" strokeWidth="3" strokeLinecap="round" />
          <path d="M140 116 Q144 130 140 146" stroke="#d46b30" strokeWidth="3" strokeLinecap="round" />
          <path d="M160 120 Q164 132 160 144" stroke="#d46b30" strokeWidth="3" strokeLinecap="round" />

          {/* Curled Cat Head */}
          <circle cx="102" cy="138" r="28" fill="#ffe7d4" stroke="#684e3d" strokeWidth="2.5" />

          {/* Sleeping Ears */}
          <path d="M88 118 L76 102 Q82 98 94 110 Z" fill="#ff9e6c" stroke="#684e3d" strokeWidth="2" />
          <path d="M112 116 L124 100 Q128 104 120 114 Z" fill="#ff9e6c" stroke="#684e3d" strokeWidth="2" />

          {/* Peaceful Closed Eyes (curved lines) */}
          <path d="M88 138 Q94 142 100 138" stroke="#684e3d" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M106 138 Q112 142 118 138" stroke="#684e3d" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Tiny Nose & Blush */}
          <ellipse cx="90" cy="144" rx="4" ry="2.5" fill="#ffb4a2" opacity="0.8" />
          <ellipse cx="116" cy="144" rx="4" ry="2.5" fill="#ffb4a2" opacity="0.8" />
          <polygon points="103,141 101,139 105,139" fill="#e27464" />

          {/* Front Paw tucked under chin */}
          <ellipse cx="106" cy="155" rx="8" ry="5" fill="#ffffff" stroke="#684e3d" strokeWidth="2" />
        </g>
      </svg>
      {caption && <span className="mascot-sleeping-caption">{caption}</span>}
    </div>
  );
}

// 2. Grounded Companion Duo (Cat & Dog sitting peacefully together on a soft cushion for Final CTA)
export function GroundedCompanionDuo({ className = '' }) {
  return (
    <div className={`grounded-mascot-duo ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 240 130"
        width="230"
        height="125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="grounded-mascot-svg"
      >
        {/* Soft Ground Shadow/Rug */}
        <ellipse cx="120" cy="112" rx="100" ry="16" fill="rgba(0,0,0,0.18)" />

        {/* === DOG (Right) === */}
        <g className="grounded-dog-group">
          {/* Wagging Tail */}
          <path
            d="M178 88 Q198 80 192 64"
            stroke="#d48243"
            strokeWidth="8"
            strokeLinecap="round"
            className="mascot-tail-wag"
          />

          {/* Dog Body */}
          <ellipse cx="152" cy="85" rx="28" ry="24" fill="#f8cf9c" stroke="#5a3d28" strokeWidth="2" />
          <ellipse cx="152" cy="88" rx="15" ry="16" fill="#ffffff" />

          {/* Floppy Ears */}
          <ellipse cx="126" cy="46" rx="7" ry="14" transform="rotate(-20 126 46)" fill="#d48243" stroke="#5a3d28" strokeWidth="1.8" />
          <ellipse cx="178" cy="46" rx="7" ry="14" transform="rotate(20 178 46)" fill="#d48243" stroke="#5a3d28" strokeWidth="1.8" />

          {/* Dog Head */}
          <ellipse cx="152" cy="52" rx="27" ry="23" fill="#f8cf9c" stroke="#5a3d28" strokeWidth="2" />
          <ellipse cx="152" cy="58" rx="13" ry="10" fill="#ffffff" />

          {/* Eyes & Eyebrows */}
          <ellipse cx="142" cy="50" rx="2.8" ry="3.2" fill="#352216" />
          <circle cx="143" cy="49" r="1" fill="#ffffff" />
          <ellipse cx="162" cy="50" rx="2.8" ry="3.2" fill="#352216" />
          <circle cx="163" cy="49" r="1" fill="#ffffff" />

          {/* Nose & Smile */}
          <ellipse cx="152" cy="55" rx="3.5" ry="2.5" fill="#352216" />
          <path d="M149 58 Q152 61 155 58" stroke="#5a3d28" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Front Paws */}
          <ellipse cx="138" cy="104" rx="8" ry="5" fill="#f8cf9c" stroke="#5a3d28" strokeWidth="1.8" />
          <ellipse cx="166" cy="104" rx="8" ry="5" fill="#f8cf9c" stroke="#5a3d28" strokeWidth="1.8" />
        </g>

        {/* === CAT (Left) === */}
        <g className="grounded-cat-group">
          {/* Cat Tail curled around front */}
          <path
            d="M55 96 C40 92 42 75 52 70"
            stroke="#ff9e6c"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cat Body */}
          <ellipse cx="85" cy="85" rx="26" ry="22" fill="#ffeedd" stroke="#684e3d" strokeWidth="2" />
          <ellipse cx="85" cy="88" rx="14" ry="15" fill="#ffffff" />

          {/* Cat Ears */}
          <path d="M72 44 L60 25 Q58 20 63 28 L70 42 Z" fill="#ff9e6c" stroke="#684e3d" strokeWidth="1.8" />
          <path d="M98 44 L110 25 Q112 20 107 28 L100 42 Z" fill="#ff9e6c" stroke="#684e3d" strokeWidth="1.8" />

          {/* Cat Head */}
          <ellipse cx="85" cy="53" rx="26" ry="22" fill="#ffeedd" stroke="#684e3d" strokeWidth="2" />
          <path d="M70 38 C77 36 80 42 75 49 C71 52 65 47 70 38 Z" fill="#f28e5b" opacity="0.9" />

          {/* Cat Eyes */}
          <ellipse cx="76" cy="52" rx="2.8" ry="3.5" fill="#3d2c22" className="mascot-eye mascot-eye-left" />
          <circle cx="77" cy="50.8" r="0.9" fill="#ffffff" />
          <ellipse cx="94" cy="52" rx="2.8" ry="3.5" fill="#3d2c22" className="mascot-eye mascot-eye-right" />
          <circle cx="95" cy="50.8" r="0.9" fill="#ffffff" />

          {/* Blush & Nose */}
          <ellipse cx="70" cy="58" rx="3.5" ry="2" fill="#ffb4a2" opacity="0.75" />
          <ellipse cx="100" cy="58" rx="3.5" ry="2" fill="#ffb4a2" opacity="0.75" />
          <polygon points="85,56 83.5,54.5 86.5,54.5" fill="#e27464" />
          <path d="M83 57 Q85 59 87 57" stroke="#684e3d" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* Paws */}
          <ellipse cx="74" cy="103" rx="7" ry="4.5" fill="#ffffff" stroke="#684e3d" strokeWidth="1.6" />
          <ellipse cx="96" cy="103" rx="7" ry="4.5" fill="#ffffff" stroke="#684e3d" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}
