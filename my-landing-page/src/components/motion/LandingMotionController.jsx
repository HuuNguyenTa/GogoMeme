import { useEffect } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const REVEAL_GROUPS = [
  ['#about', ['.section-badge', '.section-title', '.section-subtitle', '.about-pillars-list', '.about-cta-row', '.about-story-visual']],
  ['#comparison', ['.section-title', '.section-subtitle', '.comparison-table-header', '.comparison-row']],
  ['#choose-friend', ['.section-badge', '.section-title', '.section-subtitle', '.pet-choice-photo-card', '.pet-choice-content']],
  ['#station', ['.section-badge', '.section-title', '.section-subtitle', '.garden-filter-tabs', '.wish-garden-canvas-wrap', '.garden-detail-panel-wrap', '.about-banner']],
  ['#protection-layers', ['.section-title', '.section-subtitle', '.journey-step-item']],
  ['#learn', ['.section-title', '.section-subtitle', '.scenario-3d-column', '.scenario-panel-column']],
  ['#support', ['.section-header', '.support-filter-bar-clean', '.rescue-card-clean', '.support-disclaimer-clean']],
  ['#journey', ['.section-title', '.section-subtitle', '.journey-verified-card', '.journey-evidence-box']],
  ['#faq', ['.section-title', '.section-subtitle', '.faq-clean-accordion', '.faq-sleeping-anchor']],
  ['#final-cta', ['.section-badge', '.final-cta-title', '.final-cta-desc', '.final-cta-btn-group', '.final-cta-mascot-grounded']]
];

export default function LandingMotionController() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactMotion = window.matchMedia('(max-width: 768px)');
    const revealElements = [];

    for (const [rootSelector, selectors] of REVEAL_GROUPS) {
      const root = document.querySelector(rootSelector);
      if (!root) continue;
      let order = 0;
      for (const selector of selectors) {
        const matches = root.querySelectorAll(selector);
        for (const element of matches) {
          if (element.dataset.motionReveal) continue;
          element.dataset.motionReveal = selector.includes('photo') || selector.includes('visual') || selector.includes('3d-column')
            ? 'depth'
            : 'rise';
          const entranceDelay = compactMotion.matches ? Math.min(order, 3) * 30 : Math.min(order, 6) * 65;
          const replayDelay = compactMotion.matches ? 0 : Math.min(order, 5) * 35;
          element.style.setProperty('--motion-delay', `${entranceDelay}ms`);
          element.style.setProperty('--motion-replay-delay', `${replayDelay}ms`);
          revealElements.push(element);
          order += 1;
        }
      }
    }

    let revealObserver;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      revealElements.forEach((element) => {
        element.classList.add('is-motion-visible', 'is-motion-visited');
        element.dataset.motionVisited = 'true';
      });
    } else {
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const target = entry.target;
          const isVisible = target.classList.contains('is-motion-visible');
          const isVisited = target.classList.contains('is-motion-visited');

          // Hysteresis entrance: requires at least 25% intersection ratio or 80px visible height
          const shouldEnter = entry.isIntersecting && (entry.intersectionRatio >= 0.08 || entry.intersectionRect.height >= 25);

          if (shouldEnter) {
            if (!isVisible) {
              target.classList.add('is-motion-visible');
              if (!isVisited) {
                target.classList.add('is-motion-visited');
                target.dataset.motionVisited = 'true';
              }
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
            // Hysteresis exit: only triggers when completely outside the viewport margin buffer
            if (isVisible && isVisited) {
              target.classList.remove('is-motion-visible');

              // Track exit boundary for natural bidirectional replay on return
              const rootTop = entry.rootBounds ? entry.rootBounds.top : 0;
              const isAbove = entry.boundingClientRect.bottom < rootTop + 20;
              target.dataset.motionExit = isAbove ? 'top' : 'bottom';
            }
          }
        }
      }, {
        threshold: [0, 0.1, 0.25],
        rootMargin: '20px 0px -20px 0px'
      });

      revealElements.forEach((element) => revealObserver.observe(element));
    }

    const hero = document.getElementById('hero');
    const protection = document.getElementById('protection-layers');
    const journey = document.getElementById('journey');
    const parallaxElements = Array.from(document.querySelectorAll(
      '.about-story-visual, .pet-choice-photo-card, .faq-sleeping-anchor, .final-cta-mascot-grounded'
    ));

    let frame = 0;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;

    const updateProgress = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const direction = currentScrollY >= lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
      document.documentElement.dataset.scrollDirection = direction;

      if (hero) {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--hero-scroll-progress', clamp(-rect.top / Math.max(rect.height * 0.72, 1)).toFixed(3));
      }

      if (protection) {
        const rect = protection.getBoundingClientRect();
        const progress = clamp((viewportHeight * 0.72 - rect.top) / Math.max(rect.height * 0.72, 1));
        protection.style.setProperty('--journey-progress', progress.toFixed(3));
      }

      if (journey) {
        const rect = journey.getBoundingClientRect();
        const progress = clamp((viewportHeight * 0.72 - rect.top) / Math.max(rect.height * 0.72, 1));
        journey.style.setProperty('--project-progress', progress.toFixed(3));
      }

      for (const element of parallaxElements) {
        if (compactMotion.matches) {
          element.style.removeProperty('--section-parallax');
          continue;
        }
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > viewportHeight + 80) continue;
        const centerOffset = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / viewportHeight;
        element.style.setProperty('--section-parallax', `${(centerOffset * -12).toFixed(2)}px`);
      }
    };

    const requestProgressUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate, { passive: true });

    return () => {
      revealObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestProgressUpdate);
      window.removeEventListener('resize', requestProgressUpdate);
      delete document.documentElement.dataset.scrollDirection;
      revealElements.forEach((element) => {
        delete element.dataset.motionReveal;
        delete element.dataset.motionVisited;
        delete element.dataset.motionExit;
        element.classList.remove('is-motion-visible', 'is-motion-visited');
        element.style.removeProperty('--motion-delay');
        element.style.removeProperty('--motion-replay-delay');
      });
      parallaxElements.forEach((element) => element.style.removeProperty('--section-parallax'));
    };
  }, []);

  return null;
}
