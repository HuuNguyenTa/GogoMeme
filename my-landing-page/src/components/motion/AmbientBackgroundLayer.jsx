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
  'final-cta': 'final'
};

export default function AmbientBackgroundLayer() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof IntersectionObserver === 'undefined') return undefined;

    const visibleSections = new Map();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.dataset.motionActive = String(entry.isIntersecting);
        if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
        else visibleSections.delete(entry.target.id);
      }

      let activeId = 'hero';
      let activeRatio = -1;
      for (const [id, ratio] of visibleSections) {
        if (ratio > activeRatio) {
          activeId = id;
          activeRatio = ratio;
        }
      }
      layer.dataset.tone = SECTION_TONES[activeId] || 'cream';
    }, { threshold: [0.15, 0.35, 0.55, 0.75] });

    for (const id of Object.keys(SECTION_TONES)) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    const syncPageVisibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };
    syncPageVisibility();
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => {
      observer.disconnect();
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
