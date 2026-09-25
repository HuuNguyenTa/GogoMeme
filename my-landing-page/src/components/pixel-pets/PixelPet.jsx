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

const randomBetween = (min, max) => min + Math.random() * (max - min);

function readPetSize(element) {
  const value = Number.parseFloat(window.getComputedStyle(element).width);
  return Number.isFinite(value) ? value : 48;
}

function getLaneBounds(lane, viewportWidth, petSize) {
  const isMobile = viewportWidth < 768;
  const edgeInset = isMobile ? 12 : viewportWidth >= 1200 ? 24 : 16;

  if (isMobile) {
    // Mobile: Both pets stay inside the visible viewport and walk actively
    if (lane === 'left') {
      // Dog wanders on the left side
      return {
        min: edgeInset,
        max: Math.max(edgeInset + 40, Math.floor(viewportWidth * 0.44))
      };
    }
    // Cat wanders on the right side, guaranteed visible
    const rightMax = Math.max(edgeInset + 80, viewportWidth - petSize - edgeInset);
    const rightMin = Math.min(rightMax - 40, Math.floor(viewportWidth * 0.52));
    return {
      min: Math.max(edgeInset + 30, rightMin),
      max: rightMax
    };
  }

  // Desktop / Tablet
  const laneWidth = Math.min(320, viewportWidth * 0.28);
  if (lane === 'right') {
    return {
      min: Math.max(edgeInset, viewportWidth - laneWidth),
      max: Math.max(edgeInset, viewportWidth - petSize - edgeInset)
    };
  }

  return {
    min: edgeInset,
    max: Math.max(edgeInset, laneWidth - petSize)
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

    const readBounds = () => getLaneBounds(lane, overlay.clientWidth, readPetSize(pet));

    const chooseDestination = () => {
      const bounds = readBounds();
      return randomBetween(bounds.min, Math.max(bounds.min, bounds.max));
    };

    const placePet = () => {
      const bounds = readBounds();
      const isMobile = overlay.clientWidth < 768;
      if (currentX === 0) {
        // Initial placement
        const initialX = lane === 'left'
          ? bounds.min + (isMobile ? 8 : 16)
          : bounds.max - (isMobile ? 12 : 24);
        setPosition(Math.min(bounds.max, Math.max(bounds.min, initialX)));
      } else {
        // Clamp to current bounds on resize
        setPosition(Math.min(bounds.max, Math.max(bounds.min, currentX)));
      }
      if (!pet.dataset.moving || pet.dataset.moving === 'false') {
        setPetState('idle');
      }
      pet.style.opacity = '1';
    };

    const moveTo = async (destination, duration) => {
      pet.dataset.moving = 'true';
      setPetState(destination >= currentX ? 'walk-right' : 'walk-left');
      currentAnimation = pet.animate([
        { transform: `translate3d(${currentX.toFixed(1)}px, 0, 0)` },
        { transform: `translate3d(${destination.toFixed(1)}px, 0, 0)` }
      ], {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
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
      currentAnimation = null;
      setPosition(destination);
      pet.dataset.moving = 'false';
      setPetState('idle');
      return true;
    };

    const runBehavior = async () => {
      // Small staggered start
      await pause(kind === 'dog' ? randomBetween(500, 1400) : randomBetween(1000, 2000));

      while (!disposed) {
        // Lively walk loop active on all mobile and desktop devices

        // 68% chance to walk
        if (Math.random() < 0.68) {
          const bounds = readBounds();
          let destination = chooseDestination();
          if (Math.abs(destination - currentX) < 16) {
            destination = Math.abs(currentX - bounds.min) > Math.abs(currentX - bounds.max)
              ? bounds.min
              : bounds.max;
          }

          const distance = Math.abs(destination - currentX);
          // Pace around 38px/sec for natural, lively motion
          const duration = Math.max(1600, (distance / 38) * 1000) * (isNight ? 1.15 : 1);

          const completed = await moveTo(destination, duration);
          if (!completed) continue;
        }

        // Sitting or idle pause
        const shouldSit = Math.random() < (kind === 'cat' ? 0.45 : 0.32);
        setPetState(shouldSit ? 'sit' : 'idle');
        const pauseDuration = shouldSit ? randomBetween(2200, 5200) : randomBetween(1200, 3200);
        await pause(pauseDuration * (isNight ? 1.2 : 1));
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
      currentAnimation?.cancel();
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
      currentAnimation?.cancel();
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
