// Icons.jsx - Lightweight direct SVG icons for Trạm Yêu Thương
// 100% resilient, zero React hook / context overhead

import React from 'react';

export function Heart({ size = 20, color = 'currentColor', fill = 'none', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function Sparkles({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}


export function Compass({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function ShieldAlert({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function ShieldCheck({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function MessageCircle({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function Send({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function ArrowRight({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ArrowLeft({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function CheckCircle({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function CheckCircle2({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return <CheckCircle size={size} color={color} className={className} style={style} />;
}

export function BookOpen({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function PhoneCall({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ExternalLink({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function MapPin({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Package({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export function HeartHandshake({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.18 0l2.5 1.83" />
    </svg>
  );
}

export function Users({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function Award({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

export function TrendingUp({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function Volume2({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export function X({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChevronDown({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ChevronUp({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export function Check({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function AlertTriangle({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function HelpCircle({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function Paw({ size = 20, color = 'currentColor', fill = 'none', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="15" r="4" fill={fill} />
      <circle cx="6.5" cy="10.5" r="2.5" fill={fill} />
      <circle cx="17.5" cy="10.5" r="2.5" fill={fill} />
      <circle cx="9" cy="6" r="2" fill={fill} />
      <circle cx="15" cy="6" r="2" fill={fill} />
    </svg>
  );
}

export function CuteMascotHeader({ width = 120, height = 70 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cute Dog on Left */}
      <g id="dog-mascot">
        {/* Dog Ears */}
        <ellipse cx="44" cy="46" rx="9" ry="16" fill="#8C7060" transform="rotate(-25 44 46)" />
        <ellipse cx="88" cy="46" rx="9" ry="16" fill="#8C7060" transform="rotate(25 88 46)" />
        {/* Dog Head */}
        <circle cx="66" cy="54" r="26" fill="#FCE5D4" />
        {/* Dog Eyes */}
        <ellipse cx="57" cy="50" rx="3.5" ry="4" fill="#2D2420" />
        <ellipse cx="75" cy="50" rx="3.5" ry="4" fill="#2D2420" />
        <circle cx="58" cy="48" r="1.2" fill="#FFFFFF" />
        <circle cx="76" cy="48" r="1.2" fill="#FFFFFF" />
        {/* Blush */}
        <ellipse cx="51" cy="56" rx="4" ry="2.5" fill="#FFB4A2" opacity="0.65" />
        <ellipse cx="81" cy="56" rx="4" ry="2.5" fill="#FFB4A2" opacity="0.65" />
        {/* Snout & Nose */}
        <ellipse cx="66" cy="60" rx="9" ry="7" fill="#FFFFFF" />
        <polygon points="63,57 69,57 66,61" fill="#4A3B32" />
        <path d="M66 61v3m0 0c-1.5 0-3-.8-3-2m3 2c1.5 0 3-.8 3-2" stroke="#4A3B32" strokeWidth="1.2" strokeLinecap="round" />
        {/* Paws on bar */}
        <ellipse cx="50" cy="78" rx="7" ry="5" fill="#FCE5D4" stroke="#E2C1A8" strokeWidth="1" />
        <ellipse cx="82" cy="78" rx="7" ry="5" fill="#FCE5D4" stroke="#E2C1A8" strokeWidth="1" />
      </g>
      {/* Cute Cat on Right */}
      <g id="cat-mascot">
        {/* Cat Ears */}
        <polygon points="100,42 108,22 120,38" fill="#FBB040" />
        <polygon points="104,39 110,26 117,37" fill="#FFD79E" />
        <polygon points="132,38 144,22 152,42" fill="#FBB040" />
        <polygon points="135,37 142,26 148,39" fill="#FFD79E" />
        {/* Cat Head */}
        <circle cx="126" cy="54" r="23" fill="#FEE8C8" />
        {/* Cat Eyes */}
        <ellipse cx="118" cy="50" rx="3.5" ry="4" fill="#2D2420" />
        <ellipse cx="134" cy="50" rx="3.5" ry="4" fill="#2D2420" />
        <circle cx="119" cy="48" r="1.2" fill="#FFFFFF" />
        <circle cx="135" cy="48" r="1.2" fill="#FFFFFF" />
        {/* Blush */}
        <ellipse cx="112" cy="55" rx="3.5" ry="2.2" fill="#FF6B8B" opacity="0.45" />
        <ellipse cx="140" cy="55" rx="3.5" ry="2.2" fill="#FF6B8B" opacity="0.45" />
        {/* Nose & Mouth */}
        <polygon points="124,56 128,56 126,59" fill="#FF8FA3" />
        <path d="M126 59v2m0 0c-1.2 0-2.5-.7-2.5-1.8m2.5 1.8c1.2 0 2.5-.7 2.5-1.8" stroke="#5E4E44" strokeWidth="1" strokeLinecap="round" />
        {/* Whiskers */}
        <line x1="108" y1="56" x2="114" y2="57" stroke="#7A685D" strokeWidth="0.8" />
        <line x1="108" y1="60" x2="114" y2="59" stroke="#7A685D" strokeWidth="0.8" />
        <line x1="138" y1="57" x2="144" y2="56" stroke="#7A685D" strokeWidth="0.8" />
        <line x1="138" y1="59" x2="144" y2="60" stroke="#7A685D" strokeWidth="0.8" />
        {/* Paws */}
        <ellipse cx="114" cy="76" rx="6" ry="4.5" fill="#FEE8C8" stroke="#E6CBA7" strokeWidth="1" />
        <ellipse cx="138" cy="76" rx="6" ry="4.5" fill="#FEE8C8" stroke="#E6CBA7" strokeWidth="1" />
      </g>
      {/* Floating Mini Heart between them */}
      <path d="M96 28 C96 25, 93 23, 91 25 C89 23, 86 25, 86 28 C86 32, 91 36, 91 36 C91 36, 96 32, 96 28 Z" fill="#FF6B8B" />
    </svg>
  );
}

export function ChevronLeft({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRight({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function RotateCcw({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function Clock({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function Filter({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function Eye({ size = 20, color = 'currentColor', className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}



