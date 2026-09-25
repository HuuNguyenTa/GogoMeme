import { useEffect, useRef } from 'react';

const SECTION_TONES = {
  hero: 'hero',
  about: 'cream',
  comparison: 'quiet',
  'choose-friend': 'wish',
  station: 'garden',
  'protection-layers': 'cream',
  learn: 'scenario',
  support: 'quiet',
  journey: 'cream',
  faq: 'quiet',
  'final-cta': 'final',
  footer: 'final'
};

export default function AmbientBackgroundLayer() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof IntersectionObserver === 'undefined') return undefined;

    const updateBottomTone = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight || 1;
      const documentHeight = document.documentElement.scrollHeight || 1;
      return scrollY + windowHeight >= documentHeight - 320;
    };

    let activeTone = 'hero';
    const visibleSections = new Map();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.dataset.motionActive = String(entry.isIntersecting);
        if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
        else visibleSections.delete(entry.target.id);
      }

      let activeId = null;
      let activeRatio = -1;
      for (const [id, ratio] of visibleSections) {
        if (ratio > activeRatio) {
          activeId = id;
          activeRatio = ratio;
        }
      }
      if (updateBottomTone()) {
        activeTone = 'final';
      } else if (activeId && SECTION_TONES[activeId]) {
        activeTone = SECTION_TONES[activeId];
      }
      layer.dataset.tone = activeTone;
    }, { threshold: [0.1, 0.3, 0.5, 0.7] });

    for (const id of Object.keys(SECTION_TONES)) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    const onScroll = () => {
      if (updateBottomTone() && layer.dataset.tone !== 'final') {
        layer.dataset.tone = 'final';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const syncPageVisibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };
    syncPageVisibility();
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', syncPageVisibility);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);

  return (
    <div className="ambient-background" data-tone="hero" ref={layerRef} aria-hidden="true">
      <span className="ambient-moon" />
      <span className="ambient-field ambient-field--one" />
      <span className="ambient-field ambient-field--two" />
      <span className="ambient-field ambient-field--three" />
      <span className="ambient-particles">
        {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
      </span>
    </div>
  );
}
