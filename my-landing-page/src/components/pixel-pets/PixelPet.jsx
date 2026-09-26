import React, { useEffect, useRef } from 'react';
import dogIdle from '../../assets/pixel-pets/dog/idle.png';
import dogWalkRight from '../../assets/pixel-pets/dog/walk-right.png';
import dogWalkLeft from '../../assets/pixel-pets/dog/walk-left.png';
import dogSit from '../../assets/pixel-pets/dog/sit.png';
import catIdle from '../../assets/pixel-pets/cat/idle.png';
import catWalkRight from '../../assets/pixel-pets/cat/walk-right.png';
import catWalkLeft from '../../assets/pixel-pets/cat/walk-left.png';
import catSit from '../../assets/pixel-pets/cat/sit.png';

const SPRITES = {
  dog: {
    idle: dogIdle,
    'walk-right': dogWalkRight,
    'walk-left': dogWalkLeft,
    sit: dogSit
  },
  cat: {
    idle: catIdle,
    'walk-right': catWalkRight,
    'walk-left': catWalkLeft,
    sit: catSit
  }
};

// 62px per second matches the 680ms 4-frame walk stride without any foot slipping
const WALK_SPEED = 62;

const randomBetween = (min, max) => min + Math.random() * (max - min);

function readPetSize(element) {
  const value = Number.parseFloat(window.getComputedStyle(element).width);
  return Number.isFinite(value) && value > 0 ? value : 56;
}

function getLaneBounds(lane, viewportWidth, petSize) {
  const isMobile = viewportWidth < 768;
  const leftEdge = isMobile ? 12 : 24;
  // Right edge keeps 36px on desktop to stay completely clear of Windows scrollbars
  const rightEdge = isMobile ? 12 : 36;

  if (isMobile) {
    if (lane === 'left') {
      return {
        min: leftEdge,
        max: Math.max(leftEdge + 50, Math.floor(viewportWidth * 0.44))
      };
    }
    const rightMax = Math.max(leftEdge + 90, viewportWidth - petSize - rightEdge);
    const rightMin = Math.min(rightMax - 50, Math.floor(viewportWidth * 0.54));
    return {
      min: Math.max(leftEdge + 40, rightMin),
      max: rightMax
    };
  }

  // Desktop / Tablet: Generous exploration zones so they roam naturally across the footer
  if (lane === 'left') {
    return {
      min: leftEdge,
      max: Math.max(leftEdge + 140, Math.floor(viewportWidth * 0.44))
    };
  }

  const catMax = Math.max(leftEdge + 200, viewportWidth - petSize - rightEdge);
  const catMin = Math.min(catMax - 140, Math.floor(viewportWidth * 0.56));
  return {
    min: Math.max(leftEdge + 120, catMin),
    max: catMax
  };
}

export default function PixelPet({ kind, lane }) {
  const petRef = useRef(null);
  const spriteRef = useRef(null);

  useEffect(() => {
    const pet = petRef.current;
    const sprite = spriteRef.current;
    const overlay = pet?.parentElement;
    if (!pet || !sprite || !overlay) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timerIds = new Set();
    let currentAnimation = null;
    let currentX = 0;
    let disposed = false;
    let isNight = document.documentElement.dataset.theme === 'night';
    let wakeBehavior = null;

    const pause = (duration) => new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timerId);
        timerIds.delete(timerId);
        if (wakeBehavior === finish) wakeBehavior = null;
        resolve();
      };
      const timerId = window.setTimeout(finish, duration);
      timerIds.add(timerId);
      wakeBehavior = finish;
    });

    const setPetState = (state) => {
      pet.dataset.state = state;
      sprite.src = SPRITES[kind][state];
    };

    const setPosition = (x) => {
      currentX = x;
      pet.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    };

    const getAvailableWidth = () => {
      return document.documentElement.clientWidth || overlay.clientWidth || window.innerWidth;
    };

    const readBounds = () => getLaneBounds(lane, getAvailableWidth(), readPetSize(pet));

    const chooseDestination = () => {
      const bounds = readBounds();
      return randomBetween(bounds.min, Math.max(bounds.min, bounds.max));
    };

    const placePet = () => {
      const bounds = readBounds();
      const isMobile = getAvailableWidth() < 768;
      if (currentX === 0) {
        const initialX = lane === 'left'
          ? bounds.min + (isMobile ? 8 : 20)
          : bounds.max - (isMobile ? 12 : 28);
        setPosition(Math.min(bounds.max, Math.max(bounds.min, initialX)));
      } else {
        setPosition(Math.min(bounds.max, Math.max(bounds.min, currentX)));
      }
      if (!pet.dataset.moving || pet.dataset.moving === 'false') {
        setPetState('idle');
      }
      pet.style.opacity = '1';
    };

    const moveTo = async (destination, duration) => {
      if (disposed) return false;
      const isRight = destination >= currentX;
      pet.dataset.moving = 'true';
      setPetState(isRight ? 'walk-right' : 'walk-left');

      if (currentAnimation) {
        try { currentAnimation.cancel(); } catch {}
        currentAnimation = null;
      }

      currentAnimation = pet.animate([
        { transform: `translate3d(${currentX.toFixed(1)}px, 0, 0)` },
        { transform: `translate3d(${destination.toFixed(1)}px, 0, 0)` }
      ], {
        duration,
        easing: 'linear' // Constant linear movement synchronizes with footsteps
      });

      try {
        await currentAnimation.finished;
      } catch {
        currentAnimation = null;
        pet.dataset.moving = 'false';
        setPetState('idle');
        return false;
      }

      if (disposed) return false;
      // Properly cancel animation after finishing so no lingering forward fills collide
      try { currentAnimation?.cancel(); } catch {}
      currentAnimation = null;
      setPosition(destination);
      pet.dataset.moving = 'false';
      setPetState('idle');
      return true;
    };

    const runBehavior = async () => {
      // Natural staggered startup
      await pause(kind === 'dog' ? randomBetween(500, 1400) : randomBetween(1200, 2400));

      while (!disposed) {
        if (reducedMotionQuery.matches) {
          placePet();
          await pause(2500);
          continue;
        }

        // 70% chance to walk
        if (Math.random() < 0.70) {
          const bounds = readBounds();
          const range = bounds.max - bounds.min;

          if (range > 35) {
            let destination = chooseDestination();
            // Guarantee at least 45px of walking distance for a deliberate, cute stroll
            if (Math.abs(destination - currentX) < 45 && range >= 90) {
              destination = currentX < (bounds.min + bounds.max) / 2
                ? randomBetween(currentX + 45, bounds.max)
                : randomBetween(bounds.min, currentX - 45);
            }
            destination = Math.max(bounds.min, Math.min(bounds.max, destination));

            const distance = Math.abs(destination - currentX);
            if (distance >= 15) {
              const duration = (distance / WALK_SPEED) * 1000 * (isNight ? 1.08 : 1);
              const completed = await moveTo(destination, duration);
              if (!completed) continue;
            }
          }
        }

        // Relaxing pose: Sit down (adorable tail wag / blink) or Stand alert (idle)
        const shouldSit = Math.random() < (kind === 'cat' ? 0.55 : 0.40);
        setPetState(shouldSit ? 'sit' : 'idle');
        const restDuration = shouldSit
          ? randomBetween(2600, 5500)
          : randomBetween(1400, 3200);
        await pause(restDuration * (isNight ? 1.2 : 1));
      }
    };

    const themeObserver = new MutationObserver(() => {
      isNight = document.documentElement.dataset.theme === 'night';
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const handleVisibilityChange = () => {
      pet.dataset.visible = document.hidden ? 'false' : 'true';
      if (document.hidden) currentAnimation?.pause();
      else currentAnimation?.play();
    };

    const handleLayoutChange = () => {
      try { currentAnimation?.cancel(); } catch {}
      currentAnimation = null;
      wakeBehavior?.();
      placePet();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleLayoutChange, { passive: true });
    reducedMotionQuery.addEventListener('change', handleLayoutChange);

    placePet();
    runBehavior();

    return () => {
      disposed = true;
      try { currentAnimation?.cancel(); } catch {}
      timerIds.forEach((timerId) => window.clearTimeout(timerId));
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleLayoutChange);
      reducedMotionQuery.removeEventListener('change', handleLayoutChange);
    };
  }, [kind, lane]);

  return (
    <span
      ref={petRef}
      className={`pixel-pet pixel-pet--${kind}`}
      data-state="idle"
      data-moving="false"
      data-visible="true"
    >
      <span className="pixel-pet__frame">
        <img
          ref={spriteRef}
          className="pixel-pet__strip"
          src={SPRITES[kind].idle}
          alt=""
          draggable="false"
        />
      </span>
    </span>
  );
}
