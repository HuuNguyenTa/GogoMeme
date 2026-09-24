// MascotIllustration.jsx - Lightweight SVG Mascot System for Wish Garden
// Features rounded, adorable, minimal chibi mascots with soft outlines,
// warm pastel tones, blushing cheeks, and multiple fur variations for cats and dogs.

import React from 'react';

export default function MascotIllustration({
  type = 'cat',
  variant = 'tabby',
  size = 76,
  pose = 'idle', // 'idle' | 'happy' | 'sitting' | 'sleeping'
  hasFlower = false,
  hasHeart = false,
  className = '',
  style = {}
}) {
  const isDog = type === 'dog';

  // ── CAT MASCOT RENDERER ──────────────────────────────────────────────────
  if (!isDog) {
    // Fur Palette Definitions for 8 Cat Variants
    const catPalettes = {
      white: { body: '#ffffff', belly: '#fff8f2', earInner: '#ffc4c4', patch1: null, patch2: null, eye: '#2d2424', nose: '#ff8a8a', stripe: null },
      cream: { body: '#fff4de', belly: '#ffffff', earInner: '#ffc8bc', patch1: null, patch2: null, eye: '#3a2d27', nose: '#ff8a8a', stripe: null },
      calico: { body: '#ffffff', belly: '#ffffff', earInner: '#ffbaba', patch1: '#f5923b', patch2: '#473f3d', eye: '#2d2424', nose: '#ff8a8a', stripe: null },
      gray: { body: '#9fa8b8', belly: '#ffffff', earInner: '#ffb4b4', patch1: null, patch2: null, eye: '#2d2424', nose: '#ff7e7e', stripe: null },
      black: { body: '#332f38', belly: '#28252c', earInner: '#ff9c9c', patch1: null, patch2: null, eye: '#ffd043', nose: '#4a3f44', stripe: null },
      tabby: { body: '#e0ae77', belly: '#fff4e5', earInner: '#ffbaba', patch1: null, patch2: null, eye: '#2d2424', nose: '#ff7e7e', stripe: '#875328' },
      'white-gray': { body: '#ffffff', belly: '#ffffff', earInner: '#ffb4b4', patch1: '#7e8799', patch2: null, eye: '#2d2424', nose: '#ff8a8a', stripe: null },
      'white-orange': { body: '#ffffff', belly: '#ffffff', earInner: '#ffbaba', patch1: '#f78d36', patch2: null, eye: '#2d2424', nose: '#ff8a8a', stripe: null }
    };

    const p = catPalettes[variant] || catPalettes.tabby;
    const stroke = p.body === '#332f38' ? '#211d26' : '#453835';

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', filter: 'drop-shadow(0 6px 12px rgba(80,50,40,0.14))', pointerEvents: 'auto', ...style }}
      >
        {/* Full 100x100 Transparent Hit Area to capture mouse events on all pixels */}
        <rect width="100" height="100" fill="transparent" pointerEvents="all" />

        {/* Soft Contact Shadow */}
        <ellipse cx="50" cy="90" rx="32" ry="7" fill="rgba(80, 50, 35, 0.12)" />

        {/* Tail */}
        <path
          d="M 68 76 C 84 74 88 56 82 48 C 78 42 74 46 76 52 C 78 60 76 68 62 78 Z"
          fill={p.patch1 || p.body}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Back Ears */}
        {/* Left Ear */}
        <path
          d="M 28 34 L 20 12 C 26 14 36 20 40 26 Z"
          fill={p.patch1 || p.body}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M 26 30 L 22 17 C 26 18 32 22 35 26 Z" fill={p.earInner} />

        {/* Right Ear */}
        <path
          d="M 60 26 C 64 20 74 14 80 12 L 72 34 Z"
          fill={p.patch2 || (variant === 'calico' ? '#f5923b' : p.body)}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M 65 26 C 68 22 74 18 78 17 L 74 30 Z" fill={p.earInner} />

        {/* Main Chubby Body */}
        <path
          d="M 24 64 C 20 46 30 26 50 26 C 70 26 80 46 76 64 C 74 78 68 86 50 86 C 32 86 26 78 24 64 Z"
          fill={p.body}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Calico / Bi-color Patches */}
        {p.patch1 && (
          <path
            d="M 24 44 C 24 32 32 26 42 26 C 36 34 32 46 36 54 C 28 54 24 50 24 44 Z"
            fill={p.patch1}
          />
        )}
        {p.patch2 && (
          <path
            d="M 76 44 C 76 32 68 26 58 26 C 64 34 68 46 64 54 C 72 54 76 50 76 44 Z"
            fill={p.patch2}
          />
        )}

        {/* Tabby Forehead Stripes */}
        {p.stripe && (
          <g fill={p.stripe}>
            <path d="M 49 27 L 51 27 L 50.5 35 L 49.5 35 Z" />
            <path d="M 43 28 C 45 32 46 34 46 37 L 44.5 37.5 C 44 34 42 31 41 29 Z" />
            <path d="M 57 28 C 55 32 54 34 54 37 L 55.5 37.5 C 56 34 58 31 59 29 Z" />
          </g>
        )}

        {/* Soft Tummy Bib */}
        {p.belly && p.body !== '#ffffff' && (
          <path
            d="M 38 66 C 38 56 44 52 50 52 C 56 52 62 56 62 66 C 62 76 56 82 50 82 C 44 82 38 76 38 66 Z"
            fill={p.belly}
          />
        )}

        {/* Cute Big Eyes */}
        <ellipse cx="40" cy="44" rx="3.8" ry="4.4" fill={p.eye} />
        <ellipse cx="60" cy="44" rx="3.8" ry="4.4" fill={p.eye} />
        {/* Shiny Twinkle */}
        <circle cx="41.5" cy="42.5" r="1.5" fill="#ffffff" />
        <circle cx="61.5" cy="42.5" r="1.5" fill="#ffffff" />
        <circle cx="39" cy="45.5" r="0.7" fill="#ffffff" opacity="0.8" />
        <circle cx="59" cy="45.5" r="0.7" fill="#ffffff" opacity="0.8" />

        {/* Rosy Blushing Cheeks */}
        <ellipse cx="33" cy="50" rx="5.5" ry="3.5" fill="#ff9999" opacity="0.55" />
        <ellipse cx="67" cy="50" rx="5.5" ry="3.5" fill="#ff9999" opacity="0.55" />

        {/* Tiny Pink Nose & W-mouth */}
        <polygon points="48.5,49 51.5,49 50,51" fill={p.nose} />
        <path
          d="M 46 52 Q 48 54.5 50 52 Q 52 54.5 54 52"
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <path d="M 23 48 L 31 49 M 22 53 L 31 52 M 69 49 L 77 48 M 69 52 L 78 53" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

        {/* Cute Little Paws */}
        <ellipse cx="42" cy="80" rx="5" ry="4.2" fill={p.body} stroke={stroke} strokeWidth="2" />
        <ellipse cx="58" cy="80" rx="5" ry="4.2" fill={p.body} stroke={stroke} strokeWidth="2" />

        {/* Optional Flower Accessory */}
        {hasFlower && (
          <g transform="translate(64, 18)">
            <circle cx="0" cy="0" r="4.5" fill="#ff5c5c" />
            <circle cx="5" cy="0" r="4.5" fill="#ff5c5c" />
            <circle cx="2.5" cy="-4" r="4.5" fill="#ff5c5c" />
            <circle cx="-2.5" cy="-4" r="4.5" fill="#ff5c5c" />
            <circle cx="2" cy="-1.5" r="3" fill="#ffe14d" />
          </g>
        )}

        {/* Optional Heart */}
        {hasHeart && (
          <path
            d="M 50 36 C 48 31 42 31 42 36 C 42 41 50 46 50 46 C 50 46 58 41 58 36 C 58 31 52 31 50 36 Z"
            fill="#ff4f64"
            transform="translate(18, -26) scale(0.65)"
          />
        )}
      </svg>
    );
  }

  // ── DOG MASCOT RENDERER ──────────────────────────────────────────────────
  const dogPalettes = {
    golden: { body: '#fca84e', belly: '#fff3e0', earInner: '#e2882d', snout: '#fff5ea', eye: '#2c2220', nose: '#2c2220', patch: null },
    corgi: { body: '#ea9138', belly: '#ffffff', earInner: '#ffc4b8', snout: '#ffffff', eye: '#2c2220', nose: '#2c2220', patch: '#ffffff' },
    spotted: { body: '#ffffff', belly: '#ffffff', earInner: '#5c4e4b', snout: '#ffffff', eye: '#2c2220', nose: '#2c2220', patch: '#473b38' },
    'white-dog': { body: '#ffffff', belly: '#fdf9f4', earInner: '#ffc8c8', snout: '#ffffff', eye: '#222', nose: '#222', patch: null },
    'brown-dog': { body: '#9e6d49', belly: '#f7ede2', earInner: '#7d5232', snout: '#f7ede2', eye: '#2c2220', nose: '#2c2220', patch: null }
  };

  const p = dogPalettes[variant] || dogPalettes.golden;
  const stroke = '#42332e';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', filter: 'drop-shadow(0 6px 12px rgba(80,50,40,0.14))', pointerEvents: 'auto', ...style }}
    >
      {/* Full 100x100 Transparent Hit Area to capture mouse events on all pixels */}
      <rect width="100" height="100" fill="transparent" pointerEvents="all" />

      {/* Soft Contact Shadow */}
      <ellipse cx="50" cy="90" rx="34" ry="7" fill="rgba(80, 50, 35, 0.12)" />

      {/* Wagging Tail */}
      <path
        d="M 68 74 C 84 70 88 52 82 44 C 76 38 72 44 76 52 C 78 60 76 66 64 76 Z"
        fill={p.body}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Upright / Floppy Ears */}
      {variant === 'brown-dog' || variant === 'spotted' ? (
        // Floppy Droopy Puppy Ears
        <>
          <path
            d="M 26 30 C 18 36 14 50 18 60 C 22 64 28 62 28 54 C 28 42 28 34 32 30 Z"
            fill={p.patch || p.body}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 74 30 C 82 36 86 50 82 60 C 78 64 72 62 72 54 C 72 42 72 34 68 30 Z"
            fill={p.body}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </>
      ) : (
        // Perky Triangular Shiba / Corgi Ears
        <>
          <path
            d="M 28 36 L 22 14 C 28 16 38 22 42 28 Z"
            fill={p.body}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 28 32 L 24 18 C 28 19 35 24 38 28 Z" fill={p.earInner} />

          <path
            d="M 58 28 C 62 22 72 16 78 14 L 72 36 Z"
            fill={p.body}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 62 28 C 65 24 72 19 76 18 L 72 32 Z" fill={p.earInner} />
        </>
      )}

      {/* Main Chubby Body */}
      <path
        d="M 24 64 C 20 46 30 26 50 26 C 70 26 80 46 76 64 C 74 78 68 86 50 86 C 32 86 26 78 24 64 Z"
        fill={p.body}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Spotted Dog Eye Patch */}
      {p.patch && variant === 'spotted' && (
        <path
          d="M 26 40 C 26 30 36 28 44 32 C 46 40 44 50 38 52 C 30 52 26 46 26 40 Z"
          fill={p.patch}
        />
      )}

      {/* Corgi White Blaze */}
      {variant === 'corgi' && (
        <path d="M 46 26 L 54 26 L 52 46 L 48 46 Z" fill="#ffffff" />
      )}

      {/* Shiba / Golden White Cheek Highlights */}
      {variant === 'golden' && (
        <>
          <ellipse cx="34" cy="52" rx="7" ry="9" fill="#fff5ea" />
          <ellipse cx="66" cy="52" rx="7" ry="9" fill="#fff5ea" />
          <circle cx="37" cy="34" r="3" fill="#fff5ea" />
          <circle cx="63" cy="34" r="3" fill="#fff5ea" />
        </>
      )}

      {/* Snout Area */}
      <ellipse cx="50" cy="54" rx="13" ry="10" fill={p.snout} stroke={stroke} strokeWidth="1.8" />

      {/* Shiny Nose */}
      <ellipse cx="50" cy="49" rx="4.5" ry="3.5" fill={p.nose} />
      <ellipse cx="49" cy="48" rx="1.5" ry="1" fill="#ffffff" opacity="0.8" />

      {/* Mouth */}
      <path
        d="M 45 54 Q 48 57 50 54 Q 52 57 55 54"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Big Sparkling Eyes */}
      <ellipse cx="37" cy="43" rx="4" ry="4.6" fill={p.eye} />
      <ellipse cx="63" cy="43" rx="4" ry="4.6" fill={p.eye} />
      <circle cx="38.5" cy="41.5" r="1.6" fill="#ffffff" />
      <circle cx="64.5" cy="41.5" r="1.6" fill="#ffffff" />
      <circle cx="36" cy="44.5" r="0.8" fill="#ffffff" opacity="0.8" />
      <circle cx="62" cy="44.5" r="0.8" fill="#ffffff" opacity="0.8" />

      {/* Rosy Cheeks */}
      <ellipse cx="30" cy="51" rx="5.5" ry="3.5" fill="#ff8c8c" opacity="0.5" />
      <ellipse cx="70" cy="51" rx="5.5" ry="3.5" fill="#ff8c8c" opacity="0.5" />

      {/* White Chest Bib */}
      {p.belly && p.body !== '#ffffff' && (
        <path
          d="M 40 68 C 40 60 45 58 50 58 C 55 58 60 60 60 68 C 60 76 55 82 50 82 C 45 82 40 76 40 68 Z"
          fill={p.belly}
        />
      )}

      {/* Paws */}
      <ellipse cx="40" cy="81" rx="5.5" ry="4.5" fill={variant === 'corgi' || variant === 'spotted' ? '#ffffff' : p.body} stroke={stroke} strokeWidth="2" />
      <ellipse cx="60" cy="81" rx="5.5" ry="4.5" fill={variant === 'corgi' || variant === 'spotted' ? '#ffffff' : p.body} stroke={stroke} strokeWidth="2" />

      {/* Red Bandana / Collar */}
      <path
        d="M 33 66 Q 50 72 67 66"
        fill="none"
        stroke="#ff4a36"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="71" r="3" fill="#ffcc00" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

