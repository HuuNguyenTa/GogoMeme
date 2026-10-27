// HeroSection.jsx - 3D Landing Page Hero for Trạm Yêu Thương
import React, { useEffect, useRef } from 'react';
import { initThreeSanctuary } from './ThreeSanctuaryScene';
import { mountLiquidMetal } from './LiquidMetalEngine';
import '../../styles/hero.css';

export default function HeroSection({ onOpenJourney, onExploreGarden, theme, themeControl }) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const dockRef = useRef(null);
  const sceneRef = useRef(null);
  const initialThemeRef = useRef(theme);

  useEffect(() => {
    let cleanupExplore = () => { };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    try {
      if (canvasRef.current) {
        sceneRef.current = initThreeSanctuary(canvasRef.current, heroRef.current, initialThemeRef.current);
      }
    } catch (e) {
      console.warn('Three.js scene initialization error:', e);
    }

    const configureLiquid = () => {
      cleanupExplore();
      cleanupExplore = () => { };
      if (exploreBtnRef.current && !motionQuery.matches) {
        cleanupExplore = mountLiquidMetal(exploreBtnRef.current) || (() => { });
      }
    };
    configureLiquid();

    // Pointer Parallax on Hero Container
    const heroEl = heroRef.current;
    let canParallax = true;
    let px = 0, py = 0, targetPx = 0, targetPy = 0;
    let rafParallax = 0;
    let isHeroVisible = true;

    const onPointerMove = (e) => {
      if (!heroEl || !canParallax) return;
      const rect = heroEl.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
      targetPx = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width * 0.5)));
      targetPy = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height * 0.5)));

      // Dock specular rim tracking
      if (dockRef.current) {
        const dRect = dockRef.current.getBoundingClientRect();
        const dx = e.clientX - (dRect.left + dRect.width * 0.5);
        const dy = e.clientY - (dRect.top + dRect.height * 0.5);
        const angle = Math.atan2(dy, dx);
        const dist = Math.hypot(dx, dy);
        dockRef.current.style.setProperty('--spec-angle', `${angle + Math.PI}rad`);
        dockRef.current.style.setProperty('--spec-bright', `${Math.max(0.2, 1 - dist / 350)}`);

        // Magnify near items
        const pills = dockRef.current.querySelectorAll('.dock-item');
        pills.forEach((p) => {
          const pr = p.getBoundingClientRect();
          const pd = Math.hypot(e.clientX - (pr.left + pr.width * 0.5), e.clientY - (pr.top + pr.height * 0.5));
          if (pd < 60) {
            p.setAttribute('data-near', 'true');
          } else {
            p.removeAttribute('data-near');
          }
        });
      }
    };

    const updateParallax = () => {
      rafParallax = 0;
      if (!isHeroVisible || !canParallax || document.hidden) return;
      px += (targetPx - px) * 0.08;
      py += (targetPy - py) * 0.08;
      if (heroEl) {
        heroEl.style.setProperty('--px', px.toFixed(3));
        heroEl.style.setProperty('--py', py.toFixed(3));
      }
      if (Math.abs(targetPx - px) + Math.abs(targetPy - py) > 0.001) {
        rafParallax = requestAnimationFrame(updateParallax);
      }
    };

    const requestParallax = () => {
      if (!rafParallax && isHeroVisible && canParallax) {
        rafParallax = requestAnimationFrame(updateParallax);
      }
    };

    const handlePointer = (event) => {
      onPointerMove(event);
      requestParallax();
    };

    const onMotionChange = () => {
      canParallax = !motionQuery.matches;
      configureLiquid();
      if (!canParallax) {
        px = py = targetPx = targetPy = 0;
        heroEl?.style.setProperty('--px', '0');
        heroEl?.style.setProperty('--py', '0');
      }
    };
    motionQuery.addEventListener('change', onMotionChange);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) requestParallax();
      else if (rafParallax) {
        cancelAnimationFrame(rafParallax);
        rafParallax = 0;
      }
    }, { threshold: 0.02 });

    if (heroEl) visibilityObserver.observe(heroEl);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('touchmove', handlePointer, { passive: true });
    requestParallax();

    return () => {
      cancelAnimationFrame(rafParallax);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
      visibilityObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      sceneRef.current?.dispose();
      sceneRef.current = null;
      cleanupExplore();
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="hero" id="hero" ref={heroRef}>
      <span className="night-moon" aria-hidden="true" />
      {/* 3D WebGL Canvas */}
      <canvas id="scene" ref={canvasRef} />

      {/* Floating Dock Navigation */}
      <div className="dock-wrap">
        <nav className="dock par-dock" ref={dockRef} style={{ '--pd': '5' }} data-spec aria-label="Primary Navigation">
          <a
            className="dock-item dock-mark"
            href="#hero"
            onClick={scrollTo('hero')}
            style={{ '--d': '120ms' }}
            aria-label="GoGo & MeMe — Trang chủ"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </a>

          <a
            className="dock-item dock-item--mobile-secondary is-active"
            href="#about"
            onClick={scrollTo('about')}
            style={{ '--d': '160ms' }}
            aria-label="Về GoGo & MeMe"
            title="Về GoGo & MeMe"
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </span>
            <span>Về GoGo & MeMe</span>
          </a>

          <a className="dock-item" href="#choose" onClick={scrollTo('choose')} style={{ '--d': '200ms' }} aria-label="Chọn bạn" title="Chọn bạn">
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" /></svg>
            </span>
            <span>Chọn Bạn</span>
          </a>

          <a className="dock-item" href="#station" onClick={scrollTo('station')} style={{ '--d': '240ms' }} aria-label="Khu vườn lời chúc" title="Khu vườn lời chúc">
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </span>
            <span>Trạm Cứu Hộ</span>
          </a>

          <a className="dock-item" href="#learn" onClick={scrollTo('learn')} style={{ '--d': '280ms' }} aria-label="Cẩm nang cứu hộ" title="Cẩm nang cứu hộ">
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            </span>
            <span>Cẩm Nang</span>
          </a>

          <a className="dock-item" href="#support" onClick={scrollTo('support')} style={{ '--d': '320ms' }} aria-label="Nơi hỗ trợ" title="Nơi hỗ trợ">
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </span>
            <span>Nơi Hỗ Trợ</span>
          </a>

          <a
            className="dock-item dock-item--enter"
            href="#journey-flow"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenJourney) onOpenJourney();
            }}
            style={{ '--d': '360ms' }}
            aria-label="Bắt đầu hành trình"
            title="Bắt đầu hành trình"
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
            </span>
            <span>Bắt Đầu</span>
          </a>
          {themeControl}
        </nav>
      </div>

      {/* Stage Grid */}
      <div className="stage" id="stage">
        {/* Column Guides */}
        <div className="guides" aria-hidden="true">
          <i style={{ left: 'calc(405 * var(--u))' }} />
          <i style={{ left: 'calc(748 * var(--u))' }} />
          <i style={{ left: 'calc(1091 * var(--u))' }} />
        </div>

        {/* Ghost Wordmark */}
        <div className="ghost" aria-hidden="true">
          GoGo & MeMe
        </div>


        {/* Main Headline */}
        <h1 className="headline" style={{ '--pd': '18', '--pr': '1.2' }}>
          <span><i>Một lời chúc nhỏ.</i></span>
          <span><i className="headline-accent">Một hành động yêu thương.</i></span>
        </h1>

        {/* Supporting Lede */}
        <p className="lede" style={{ '--pd': '14', '--pr': '1' }}>
          Chọn một người bạn, gửi lời chúc ấm áp và cùng học cách giúp đỡ những bé chó mèo đang cần một bàn tay che chở.
        </p>

        {/* Hero Actions Row: Primary CTA & Secondary Wish Garden CTA */}
        <div className="hero-actions-row" style={{ '--pd': '15', '--pr': '1.4' }}>
          {/* Primary CTA: Refined Soft Peach Liquid Glass */}
          <button
            type="button"
            className="primary-glass-cta"
            ref={exploreBtnRef}
            onClick={onOpenJourney}
            aria-label="Bắt đầu hành trình cùng GoGo & MeMe"
          >
            <span className="glass-base-plate" aria-hidden="true" />
            <span className="glass-liquid-sheen" aria-hidden="true" />
            <span className="glass-specular-highlight" aria-hidden="true" />
            <span className="glass-inner-rim" aria-hidden="true" />
            <span className="glass-ripple-container" aria-hidden="true" />

            <span className="glass-content">
              <svg className="glass-heart-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="glass-label-text">Bắt đầu hành trình</span>
            </span>
          </button>

          {/* Secondary CTA: Quieter frosted glass exploring the Wish Garden */}
          <button
            type="button"
            className="secondary-garden-cta"
            onClick={onExploreGarden || scrollTo('learn')}
            aria-label="Bắt đầu trả lời 4 tình huống"
          >
            <span className="garden-cta-icon-disc" aria-hidden="true">
              <svg className="garden-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className="garden-cta-label">Câu hỏi tình huống</span>
          </button>
        </div>


        {/* 3D World Floating Indicator (Top Right) */}
        <div className="hero-world-tag" style={{ '--pd': '10' }}>
          <span className="world-tag-name">Trạm Yêu Thương Thu Nhỏ</span>
        </div>

        {/* Scroll Cue */}
        <a
          className="scroll"
          style={{ '--pd': '9' }}
          href="#about"
          onClick={scrollTo('about')}
        >
          Khám phá
          <span className="track" />
        </a>
      </div>
    </main>
  );
}
