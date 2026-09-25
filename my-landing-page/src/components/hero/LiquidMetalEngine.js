// LiquidMetalEngine.js - Refined Soft Peach Liquid Glass Controller
// Provides subtle, organic liquid glass sheen, tactile magnetic damping,
// and ripple feedback without heavy WebGL shaders or chromatic distortion.

export function mountLiquidMetal(host) {
  if (!host) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  let targetMagX = 0;
  let targetMagY = 0;
  let currentMagX = 0;
  let currentMagY = 0;
  let targetGlow = 0;
  let currentGlow = 0;
  let rafId = 0;

  const rippleContainer = host.querySelector('.glass-ripple-container');

  const onPointerMove = (e) => {
    if (isTouch) return;
    const rect = host.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const normY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    host.style.setProperty('--ptr-x', `${normX.toFixed(1)}%`);
    host.style.setProperty('--ptr-y', `${normY.toFixed(1)}%`);

    if (!prefersReduced) {
      // Gentle, subtle magnetic offset: maximum +/- 3.5px
      const cx = rect.width * 0.5;
      const cy = rect.height * 0.5;
      targetMagX = ((x - cx) / cx) * 3.5;
      targetMagY = ((y - cy) / cy) * 2.5;
    }
    requestMotion();
  };

  const onPointerEnter = (e) => {
    targetGlow = 1;
    onPointerMove(e);
  };

  const onPointerLeave = () => {
    targetGlow = 0;
    targetMagX = 0;
    targetMagY = 0;
    requestMotion();
  };

  const onPointerDown = (e) => {
    const rect = host.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rippleContainer) {
      const ripple = document.createElement('span');
      ripple.className = 'glass-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      rippleContainer.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode === rippleContainer) {
          ripple.remove();
        }
      }, 700);
    }
  };

  const updateMotion = () => {
    rafId = 0;
    if (document.hidden) return;
    if (!prefersReduced) {
      currentMagX += (targetMagX - currentMagX) * 0.14;
      currentMagY += (targetMagY - currentMagY) * 0.14;
      host.style.setProperty('--mag-x', `${currentMagX.toFixed(2)}px`);
      host.style.setProperty('--mag-y', `${currentMagY.toFixed(2)}px`);
    }

    currentGlow += (targetGlow - currentGlow) * 0.12;
    host.style.setProperty('--glow-opacity', currentGlow.toFixed(3));

    if (Math.abs(targetGlow - currentGlow) + Math.abs(targetMagX - currentMagX) + Math.abs(targetMagY - currentMagY) > 0.002) {
      rafId = requestAnimationFrame(updateMotion);
    }
  };

  const requestMotion = () => {
    if (!rafId && !document.hidden) rafId = requestAnimationFrame(updateMotion);
  };

  host.addEventListener('pointerenter', onPointerEnter);
  host.addEventListener('pointerleave', onPointerLeave);
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerdown', onPointerDown);

  rafId = requestAnimationFrame(updateMotion);

  return () => {
    cancelAnimationFrame(rafId);
    host.removeEventListener('pointerenter', onPointerEnter);
    host.removeEventListener('pointerleave', onPointerLeave);
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerdown', onPointerDown);
  };
}
