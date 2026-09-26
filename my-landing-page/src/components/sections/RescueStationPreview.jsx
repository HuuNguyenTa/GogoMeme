import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Heart, Sparkles, X } from '../ui/Icons';
import {
  fetchPublicWishes,
  getPublicSenderName,
  subscribeToWishInserts
} from '../../services/wishService';
import {
  appendResidentsByWishId,
  GARDEN_BEHAVIORS,
  nextResidentRandom,
  placeResidentForLayout
} from '../garden/gardenResidentModel';
import MascotIllustration from '../garden/MascotIllustration';
import DecorativeAsset from '../ui/DecorativeAsset';

const COLLISION_DISTANCE = 62;
const MAX_GARDEN_RESIDENTS = 70;

function trimResidents(
  residentsList,
  maxCount = MAX_GARDEN_RESIDENTS,
  protectedWishId = null,
  selectedId = null
) {
  if (residentsList.length <= maxCount) return residentsList;

  const excess = residentsList.length - maxCount;
  const protectedSet = new Set([protectedWishId, selectedId].filter(Boolean));

  const candidateIndices = [];
  const protectedIndices = [];

  for (let i = 0; i < residentsList.length; i += 1) {
    const res = residentsList[i];
    const time = res.createdAt ? new Date(res.createdAt).getTime() : 0;
    if (!protectedSet.has(res.residentId)) {
      candidateIndices.push({ index: i, time });
    } else {
      protectedIndices.push({ index: i, time });
    }
  }

  candidateIndices.sort((a, b) => a.time - b.time);

  let indicesToRemove;
  if (candidateIndices.length >= excess) {
    indicesToRemove = new Set(candidateIndices.slice(0, excess).map((c) => c.index));
  } else {
    const neededFromProtected = excess - candidateIndices.length;
    protectedIndices.sort((a, b) => {
      const aIsSelected = residentsList[a.index].residentId === selectedId ? 1 : 0;
      const bIsSelected = residentsList[b.index].residentId === selectedId ? 1 : 0;
      if (aIsSelected !== bIsSelected) return aIsSelected - bIsSelected;
      return a.time - b.time;
    });
    const removedFromProtected = protectedIndices.slice(0, neededFromProtected);
    indicesToRemove = new Set([
      ...candidateIndices.map((c) => c.index),
      ...removedFromProtected.map((p) => p.index)
    ]);
  }

  return residentsList.filter((_, idx) => !indicesToRemove.has(idx));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getGardenLayoutMode() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    ? 'mobile'
    : 'desktop';
}

function formatCreatedAt(createdAt, fallback) {
  if (!createdAt) return fallback || 'Gần đây';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return fallback || 'Gần đây';
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function chooseTarget(resident, residents, bounds, width, height) {
  const collisionDistance = resident.layoutMode === 'mobile' ? 54 : COLLISION_DISTANCE;
  let bestCandidate = null;
  let bestDistance = -1;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = {
      x: bounds.minX + nextResidentRandom(resident) * (bounds.maxX - bounds.minX),
      y: bounds.minY + nextResidentRandom(resident) * (bounds.maxY - bounds.minY)
    };

    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const other of residents) {
      if (other.residentId === resident.residentId) continue;
      const dx = ((candidate.x - other.x) / 100) * width;
      const dy = ((candidate.y - other.y) / 100) * height;
      nearestDistance = Math.min(nearestDistance, Math.hypot(dx, dy));
    }

    if (nearestDistance > collisionDistance * 1.15) {
      bestCandidate = candidate;
      break;
    }
    if (nearestDistance > bestDistance) {
      bestDistance = nearestDistance;
      bestCandidate = candidate;
    }
  }

  resident.targetX = bestCandidate?.x ?? resident.x;
  resident.targetY = bestCandidate?.y ?? resident.y;
  resident.speed = 11 + nextResidentRandom(resident) * 11;
  resident.behavior = GARDEN_BEHAVIORS[Math.floor(nextResidentRandom(resident) * GARDEN_BEHAVIORS.length)];
}

const USER_WISHES_STORAGE_KEY = 'tram-yeu-thuong-my-wishes-v1';

function getLocalMyWishIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(USER_WISHES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveLocalMyWishId(wishId) {
  if (typeof window === 'undefined' || !wishId) return;
  try {
    const current = getLocalMyWishIds();
    current.add(wishId);
    window.localStorage.setItem(USER_WISHES_STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch {
    /* Storage optional */
  }
}

const MascotNode = React.memo(function MascotNode({
  resident,
  isSelected,
  isHovered,
  isEntering,
  isLocalHighlight,
  isMyPet,
  registerElement,
  onHover,
  onLeave,
  onSelect
}) {
  return (
    <div
      ref={(node) => registerElement(resident.residentId, node)}
      className={`garden-resident-anchor ${isSelected ? 'is-selected' : ''} ${
        isHovered ? 'is-hovered' : ''
      } ${isEntering ? 'is-entering' : ''} ${(isMyPet || isLocalHighlight) ? 'is-my-pet is-local-highlight' : ''}`}
      data-behavior={resident.behavior}
      data-moving="false"
    >
      <button
        type="button"
        className="garden-resident-hitbox"
        onClick={() => onSelect(resident.residentId)}
        onMouseEnter={() => onHover(resident.residentId)}
        onMouseLeave={() => onLeave(resident.residentId)}
        onFocus={() => onHover(resident.residentId)}
        onBlur={() => onLeave(resident.residentId)}
        aria-label={`Đọc lời chúc gửi ${resident.animalName} từ ${getPublicSenderName(resident)}`}
        aria-pressed={isSelected}
      >
        {/* Permanent Bouncing Arrow Indicator for User's Pet */}
        {(isMyPet || isLocalHighlight) ? (
          <span className="my-pet-marker" aria-label="Bé của bạn">
            <span className="my-pet-badge">Bé của bạn ⭐</span>
            <span className="my-pet-arrow" aria-hidden="true">▼</span>
          </span>
        ) : null}

        <span className="garden-resident-visual" aria-hidden="true">
          {isEntering ? (
            <span className="resident-entrance-particles">
              <span>♥</span>
              <span>✦</span>
            </span>
          ) : null}
          <span className="garden-resident-mascot">
            <MascotIllustration
              type={resident.animalType}
              variant={resident.visualVariant}
              size={68}
              hasFlower={resident.hasFlower}
              hasHeart={isEntering || isLocalHighlight || isMyPet}
            />
          </span>
          <span className="garden-resident-shadow" />
        </span>

        <span className={`garden-resident-name ${(isMyPet || isLocalHighlight) ? 'is-my-pet-name' : ''}`}>{resident.animalName}</span>

        {isHovered ? (
          <span className="garden-resident-tooltip" role="tooltip">
            <strong>Gửi {resident.animalName}</strong>
            <small>bởi {getPublicSenderName(resident)}</small>
            <span>“{resident.message}”</span>
            <em>{resident.date || 'Gần đây'} · Nhấn để đọc kỹ</em>
          </span>
        ) : null}
      </button>
    </div>
  );
});

export default function RescueStationPreview({ newWish, onGoToScenarios }) {
  const [residents, setResidents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedWishId, setSelectedWishId] = useState(null);
  const [hoveredWishId, setHoveredWishId] = useState(null);
  const [enteringIds, setEnteringIds] = useState(() => new Set());
  const [welcomedWishId, setWelcomedWishId] = useState(null);
  const [localHighlightWishId, setLocalHighlightWishId] = useState(null);
  const [myWishIds, setMyWishIds] = useState(() => getLocalMyWishIds());
  const [latestLocalWishId, setLatestLocalWishId] = useState(() => {
    const ids = Array.from(getLocalMyWishIds());
    return ids.length > 0 ? ids[ids.length - 1] : null;
  });
  const [showFindHelper, setShowFindHelper] = useState(() => getLocalMyWishIds().size > 0);

  const canvasRef = useRef(null);
  const meadowRef = useRef(null);
  const residentsRef = useRef([]);
  const elementRefs = useRef(new Map());
  const pausedIdsRef = useRef(new Set());
  const selectedWishIdRef = useRef(null);
  const hoveredWishIdRef = useRef(null);
  const enteringTimersRef = useRef(new Map());
  const welcomeTimerRef = useRef(null);
  const localHighlightTimerRef = useRef(null);
  const lastLocalWishIdRef = useRef(null);
  const layoutModeRef = useRef(getGardenLayoutMode());
  const isGardenVisibleRef = useRef(true);
  const resumeGardenMotionRef = useRef(() => {});
  const activeTabRef = useRef(activeTab);
  const latestLocalWishIdRef = useRef(latestLocalWishId);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    latestLocalWishIdRef.current = latestLocalWishId;
  }, [latestLocalWishId]);

  useEffect(() => {
    residentsRef.current = residents;
  }, [residents]);

  const registerElement = useCallback((residentId, node) => {
    if (node) elementRefs.current.set(residentId, node);
    else elementRefs.current.delete(residentId);
  }, []);

  const markEntrance = useCallback((wishId) => {
    setEnteringIds((current) => {
      const next = new Set(current);
      next.add(wishId);
      return next;
    });
    setWelcomedWishId(wishId);

    const existingTimer = enteringTimersRef.current.get(wishId);
    if (existingTimer) window.clearTimeout(existingTimer);
    enteringTimersRef.current.set(wishId, window.setTimeout(() => {
      setEnteringIds((current) => {
        const next = new Set(current);
        next.delete(wishId);
        return next;
      });
      enteringTimersRef.current.delete(wishId);
    }, 1100));

    if (welcomeTimerRef.current) window.clearTimeout(welcomeTimerRef.current);
    welcomeTimerRef.current = window.setTimeout(() => setWelcomedWishId(null), 2400);
  }, []);

  const markLocalWish = useCallback((wishId) => {
    saveLocalMyWishId(wishId);
    setMyWishIds((prev) => new Set([...prev, wishId]));
    setLatestLocalWishId(wishId);
    latestLocalWishIdRef.current = wishId;
    setShowFindHelper(true);
    setLocalHighlightWishId(wishId);
  }, []);

  const appendWish = useCallback((wish, { entrance = false, select = false, local = false } = {}) => {
    if (!wish?.id) return;

    if (local) {
      latestLocalWishIdRef.current = wish.id;
    }

    const exists = residentsRef.current.some((resident) => resident.residentId === wish.id);
    if (!exists) {
      const next = appendResidentsByWishId(residentsRef.current, [wish], layoutModeRef.current);
      const activeProtectedWishId = local ? wish.id : latestLocalWishIdRef.current;
      const activeSelectedId = select ? wish.id : selectedWishIdRef.current;
      const trimmed = trimResidents(next, MAX_GARDEN_RESIDENTS, activeProtectedWishId, activeSelectedId);
      residentsRef.current = trimmed;
      setResidents(trimmed);
    }

    if (entrance) markEntrance(wish.id);
    if (local) markLocalWish(wish.id);

    if (select) {
      selectedWishIdRef.current = wish.id;
      pausedIdsRef.current.add(wish.id);
      setSelectedWishId(wish.id);
      setActiveTab('all');
    }
  }, [markEntrance, markLocalWish]);

  useEffect(() => {
    let isCurrent = true;

    const unsubscribe = subscribeToWishInserts((wish) => {
      if (isCurrent) appendWish(wish, { entrance: true });
    });

    fetchPublicWishes().then((wishes) => {
      if (!isCurrent) return;
      const next = appendResidentsByWishId(residentsRef.current, wishes, layoutModeRef.current);
      const trimmed = trimResidents(next, MAX_GARDEN_RESIDENTS, latestLocalWishIdRef.current, selectedWishIdRef.current);
      residentsRef.current = trimmed;
      setResidents(trimmed);
    }).catch(() => {
      // Keep the Garden usable when the network is unavailable; realtime can still recover later.
    });

    return () => {
      isCurrent = false;
      unsubscribe();
    };
  }, [appendWish]);

  useEffect(() => {
    if (!newWish?.id || lastLocalWishIdRef.current === newWish.id) return undefined;
    lastLocalWishIdRef.current = newWish.id;
    const frame = window.requestAnimationFrame(() => {
      appendWish(newWish, { entrance: true, select: true, local: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [appendWish, newWish]);

  useEffect(() => () => {
    for (const timer of enteringTimersRef.current.values()) window.clearTimeout(timer);
    if (welcomeTimerRef.current) window.clearTimeout(welcomeTimerRef.current);
    if (localHighlightTimerRef.current) window.clearTimeout(localHighlightTimerRef.current);
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 768px)');

    const centerGarden = () => {
      const canvas = canvasRef.current;
      if (!canvas || !compactQuery.matches) return;
      canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2);
      canvas.scrollTop = Math.max(0, (canvas.scrollHeight - canvas.clientHeight) / 2);
    };

    const syncLayout = () => {
      const nextMode = compactQuery.matches ? 'mobile' : 'desktop';
      if (layoutModeRef.current !== nextMode) {
        layoutModeRef.current = nextMode;
        residentsRef.current.forEach((resident, index) => {
          placeResidentForLayout(resident, index, nextMode);
        });
        resumeGardenMotionRef.current();
      }
      window.requestAnimationFrame(centerGarden);
    };

    syncLayout();
    compactQuery.addEventListener('change', syncLayout);
    window.addEventListener('resize', syncLayout, { passive: true });
    return () => {
      compactQuery.removeEventListener('change', syncLayout);
      window.removeEventListener('resize', syncLayout);
    };
  }, []);

  useEffect(() => {
    const meadow = meadowRef.current;
    if (!meadow || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      isGardenVisibleRef.current = entry.isIntersecting;
      meadow.classList.toggle('is-motion-paused', !entry.isIntersecting);
      if (entry.isIntersecting) resumeGardenMotionRef.current();
    }, { threshold: 0.05 });
    observer.observe(meadow);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const renderPositions = (width, height) => {
      for (const resident of residentsRef.current) {
        const element = elementRefs.current.get(resident.residentId);
        if (!element) continue;
        element.style.transform = `translate3d(${(resident.x / 100) * width}px, ${(resident.y / 100) * height}px, 0) translate(-50%, -50%)`;
        element.style.zIndex = String(Math.round(resident.y) + (resident.residentId === selectedWishIdRef.current ? 120 : 20));
        element.style.setProperty('--resident-facing', String(resident.direction));
        element.dataset.behavior = resident.behavior;
        element.dataset.tooltipPlacement = resident.y < 35 ? 'below' : 'above';
        element.dataset.tooltipAlign = resident.x < 24 ? 'left' : resident.x > 76 ? 'right' : 'center';
      }
    };

    const scheduleFrame = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(tick);
    };

    const tick = (now) => {
      animationFrame = 0;
      const meadow = meadowRef.current;
      if (!meadow) return;

      const rect = meadow.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      if (!isGardenVisibleRef.current || reduceMotion.matches) {
        renderPositions(rect.width, rect.height);
        previousTime = now;
        return;
      }

      const deltaSeconds = Math.min(0.05, Math.max(0, (now - previousTime) / 1000));
      previousTime = now;
      const residentsNow = residentsRef.current;
      const currentTab = activeTabRef.current;
      const activeResidents = currentTab === 'all'
        ? residentsNow
        : residentsNow.filter((r) => r.animalType === currentTab);

      const horizontalPadding = clamp((48 / rect.width) * 100, 7, 17);
      const verticalPadding = clamp((54 / rect.height) * 100, 11, 17);
      const bounds = {
        minX: horizontalPadding,
        maxX: 100 - horizontalPadding,
        minY: verticalPadding,
        maxY: 100 - verticalPadding
      };

      for (const resident of activeResidents) {
        const isPaused = pausedIdsRef.current.has(resident.residentId);
        const element = elementRefs.current.get(resident.residentId);
        if (isPaused) {
          if (element) element.dataset.moving = 'false';
          continue;
        }

        let dxPixels = ((resident.targetX - resident.x) / 100) * rect.width;
        let dyPixels = ((resident.targetY - resident.y) / 100) * rect.height;
        let distance = Math.hypot(dxPixels, dyPixels);

        if (distance < 3) {
          if (!resident.pauseUntil) {
            resident.pauseUntil = now + 850 + nextResidentRandom(resident) * 2400;
            resident.behavior = nextResidentRandom(resident) > 0.72 ? 'small-hop' : 'idle';
          } else if (now >= resident.pauseUntil) {
            resident.pauseUntil = 0;
            chooseTarget(resident, activeResidents, bounds, rect.width, rect.height);
            dxPixels = ((resident.targetX - resident.x) / 100) * rect.width;
            dyPixels = ((resident.targetY - resident.y) / 100) * rect.height;
            distance = Math.hypot(dxPixels, dyPixels);
          }
        }

        if (!resident.pauseUntil && distance >= 3) {
          const step = Math.min(distance, resident.speed * deltaSeconds);
          resident.x = clamp(resident.x + ((dxPixels / distance) * step / rect.width) * 100, bounds.minX, bounds.maxX);
          resident.y = clamp(resident.y + ((dyPixels / distance) * step / rect.height) * 100, bounds.minY, bounds.maxY);
          resident.direction = dxPixels >= 0 ? 1 : -1;
          if (element) element.dataset.moving = 'true';
        } else if (element) {
          element.dataset.moving = 'false';
        }
      }

      const collisionDistance = layoutModeRef.current === 'mobile' ? 54 : COLLISION_DISTANCE;
      for (let firstIndex = 0; firstIndex < activeResidents.length; firstIndex += 1) {
        const first = activeResidents[firstIndex];
        for (let secondIndex = firstIndex + 1; secondIndex < activeResidents.length; secondIndex += 1) {
          const second = activeResidents[secondIndex];
          let dx = ((second.x - first.x) / 100) * rect.width;
          let dy = ((second.y - first.y) / 100) * rect.height;
          let distance = Math.hypot(dx, dy);

          if (distance >= collisionDistance) continue;
          if (distance < 0.1) {
            const angle = (nextResidentRandom(first) + nextResidentRandom(second)) * Math.PI;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            distance = 1;
          }

          const separation = Math.min(1.2, (collisionDistance - distance) * 0.035);
          const offsetX = (dx / distance) * separation;
          const offsetY = (dy / distance) * separation;

          if (!pausedIdsRef.current.has(first.residentId)) {
            first.x = clamp(first.x - (offsetX / rect.width) * 100, bounds.minX, bounds.maxX);
            first.y = clamp(first.y - (offsetY / rect.height) * 100, bounds.minY, bounds.maxY);
          }
          if (!pausedIdsRef.current.has(second.residentId)) {
            second.x = clamp(second.x + (offsetX / rect.width) * 100, bounds.minX, bounds.maxX);
            second.y = clamp(second.y + (offsetY / rect.height) * 100, bounds.minY, bounds.maxY);
          }
        }
      }

      renderPositions(rect.width, rect.height);
      scheduleFrame();
    };

    resumeGardenMotionRef.current = scheduleFrame;
    scheduleFrame();
    return () => {
      resumeGardenMotionRef.current = () => {};
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleHover = useCallback((wishId) => {
    hoveredWishIdRef.current = wishId;
    pausedIdsRef.current.add(wishId);
    setHoveredWishId(wishId);
  }, []);

  const handleLeave = useCallback((wishId) => {
    hoveredWishIdRef.current = null;
    if (selectedWishIdRef.current !== wishId) pausedIdsRef.current.delete(wishId);
    setHoveredWishId(null);
  }, []);

  const handleSelect = useCallback((wishId) => {
    const previousId = selectedWishIdRef.current;
    if (previousId && previousId !== hoveredWishIdRef.current) pausedIdsRef.current.delete(previousId);
    selectedWishIdRef.current = wishId;
    pausedIdsRef.current.add(wishId);
    setSelectedWishId(wishId);
  }, []);

  const handleCloseDetails = useCallback(() => {
    const selectedId = selectedWishIdRef.current;
    selectedWishIdRef.current = null;
    if (selectedId !== hoveredWishIdRef.current) pausedIdsRef.current.delete(selectedId);
    setSelectedWishId(null);
  }, []);

  const handleGardenBackgroundClick = useCallback((event) => {
    if (event.target instanceof Element && event.target.closest('.garden-resident-hitbox')) return;
    handleCloseDetails();
  }, [handleCloseDetails]);

  const handleFindLatestResident = useCallback(() => {
    if (!latestLocalWishId) return;
    setActiveTab('all');
    handleSelect(latestLocalWishId);
    setShowFindHelper(false);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const residentElement = elementRefs.current.get(latestLocalWishId);
        if (!canvas || !residentElement) return;

        const canvasRect = canvas.getBoundingClientRect();
        const residentRect = residentElement.getBoundingClientRect();
        const targetLeft = canvas.scrollLeft
          + residentRect.left + residentRect.width / 2
          - canvasRect.left - canvas.clientWidth / 2;
        const targetTop = canvas.scrollTop
          + residentRect.top + residentRect.height / 2
          - canvasRect.top - canvas.clientHeight / 2;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        canvas.scrollTo({
          left: clamp(targetLeft, 0, canvas.scrollWidth - canvas.clientWidth),
          top: clamp(targetTop, 0, canvas.scrollHeight - canvas.clientHeight),
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
        residentElement.querySelector('.garden-resident-hitbox')?.focus({ preventScroll: true });
      });
    });
  }, [handleSelect, latestLocalWishId]);

  const displayedResidents = useMemo(() => residents.filter((resident) => {
    if (activeTab === 'cat') return resident.animalType === 'cat';
    if (activeTab === 'dog') return resident.animalType === 'dog';
    return true;
  }), [activeTab, residents]);

  const selectedResident = useMemo(
    () => residents.find((resident) => resident.residentId === selectedWishId) || null,
    [residents, selectedWishId]
  );

  const catCount = residents.filter((resident) => resident.animalType === 'cat').length;
  const dogCount = residents.filter((resident) => resident.animalType === 'dog').length;

  return (
    <section className="landing-section wish-garden-section" id="station">
      <div id="garden" style={{ position: 'relative', top: '-60px' }} aria-hidden="true" />
      <DecorativeAsset asset="mushroom-lantern" variant="corner-bottom-left" />
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <Heart size={14} fill="currentColor" />
            <span>Khu Vườn Yêu Thương</span>
          </div>
          <h2 className="section-title">Trạm Cứu Hộ Ảo</h2>
          <p className="section-subtitle">
            Mỗi lời chúc là một người bạn nhỏ riêng trong khu vườn. Rê chuột để xem nhanh,
            hoặc chọn một bé để đọc trọn lời nhắn.
          </p>
          <div className="station-tabs garden-filter-tabs" aria-label="Lọc lời chúc theo loài">
            <button type="button" className={`station-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              Tất cả ({residents.length})
            </button>
            <button type="button" className={`station-tab-btn ${activeTab === 'cat' ? 'active' : ''}`} onClick={() => setActiveTab('cat')}>
              Hội Mèo ({catCount})
            </button>
            <button type="button" className={`station-tab-btn ${activeTab === 'dog' ? 'active' : ''}`} onClick={() => setActiveTab('dog')}>
              Hội Cún ({dogCount})
            </button>
          </div>
        </div>

        {latestLocalWishId && showFindHelper ? (
          <button type="button" className="garden-find-resident" onClick={handleFindLatestResident}>
            <Sparkles size={15} />
            <span>Tìm bé của bạn</span>
          </button>
        ) : null}

        <div className="wish-garden-explorer">
          <div
            className="wish-garden-canvas-wrap"
            ref={canvasRef}
            onClick={handleGardenBackgroundClick}
            aria-label="Khu vườn lời chúc có thể kéo để khám phá"
          >
            <div className="wish-garden-meadow wish-garden-meadow--wandering" ref={meadowRef}>
            <div className="garden-sun-glow" />
            <div className="garden-dandelion-puff p1" />
            <div className="garden-dandelion-puff p2" />
            <div className="garden-dandelion-puff p3" />
            <div className="garden-hill-bg" />
            <div className="garden-hill-mid" />
            <div className="garden-hill-fore" />
            <div className="garden-fireflies" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className="garden-landscape-details" aria-hidden="true">
              <div className="garden-winding-path">
                <span className="garden-path-stone stone-a" />
                <span className="garden-path-stone stone-b" />
                <span className="garden-path-stone stone-c" />
                <span className="garden-path-stone stone-d" />
              </div>
              <div className="garden-low-fence">
                <span /><span /><span /><span /><span /><span />
              </div>
              <div className="garden-grass-cluster grass-a"><i /><i /><i /></div>
              <div className="garden-grass-cluster grass-b"><i /><i /><i /></div>
              <div className="garden-grass-cluster grass-c"><i /><i /><i /></div>
              <div className="garden-grass-cluster grass-d"><i /><i /><i /></div>
              <div className="garden-flower-cluster cluster-a"><i /><i /><i /></div>
              <div className="garden-flower-cluster cluster-b"><i /><i /><i /></div>
              <div className="garden-pebble pebble-a" />
              <div className="garden-pebble pebble-b" />
              <div className="garden-pebble pebble-c" />
            </div>
            <div className="garden-prop-picnic-mat" style={{ left: '46%', top: '56%' }}>
              <div className="picnic-bowl" />
              <div className="picnic-toy-ball" />
            </div>
            <div className="garden-prop-bed" style={{ left: '84%', top: '72%' }}>
              <div className="pet-cushion" />
              <div className="pet-yarn-ball" />
            </div>
            <div className="garden-prop-signpost" style={{ left: '6%', top: '38%' }}>
              <div className="sign-board"><span>Vườn Bình Yên</span></div>
              <div className="sign-post" />
            </div>
            <div className="garden-prop-bush b1" style={{ left: '8%', top: '58%' }} />
            <div className="garden-prop-bush b2" style={{ left: '86%', top: '38%' }} />
            <div className="garden-prop-flower f1" style={{ left: '14%', top: '75%' }} />
            <div className="garden-prop-flower f2" style={{ left: '89%', top: '63%' }} />
            <div className="garden-prop-flower f3" style={{ left: '38%', top: '80%' }} />
            <div className="garden-prop-flower f4" style={{ left: '72%', top: '30%' }} />

            {welcomedWishId ? (
              <div className="garden-welcome-toast" role="status" aria-live="polite">
                <Sparkles size={15} />
                <span>Một lời chúc mới vừa vào khu vườn</span>
              </div>
            ) : null}

            {displayedResidents.map((resident) => (
              <MascotNode
                key={resident.wishId}
                resident={resident}
                isSelected={selectedWishId === resident.residentId}
                isHovered={hoveredWishId === resident.residentId}
                isEntering={enteringIds.has(resident.residentId)}
                isLocalHighlight={localHighlightWishId === resident.residentId}
                isMyPet={myWishIds.has(resident.residentId)}
                registerElement={registerElement}
                onHover={handleHover}
                onLeave={handleLeave}
                onSelect={handleSelect}
              />
            ))}
            </div>
          </div>

          {selectedResident ? (
            <div className="garden-mobile-detail" role="status" aria-live="polite">
              <div className="garden-mobile-detail-copy">
                <strong>{selectedResident.animalName}</strong>
                <small>Gửi bởi {getPublicSenderName(selectedResident)}</small>
                <p>“{selectedResident.message}”</p>
              </div>
              <button type="button" onClick={handleCloseDetails} aria-label="Đóng lời chúc đang chọn">
                <X size={18} />
              </button>
            </div>
          ) : null}
        </div>

        <div className="garden-detail-panel-wrap">
          {selectedResident ? (
            <div className="garden-detail-panel">
              <div className="panel-avatar-col">
                <div className="panel-avatar-circle">
                  <MascotIllustration type={selectedResident.animalType} variant={selectedResident.visualVariant} size={68} />
                </div>
                <span className="panel-animal-type">
                  {selectedResident.animalType === 'cat' ? 'Bé mèo' : 'Bé cún'}
                </span>
              </div>
              <div className="panel-body-col">
                <div className="panel-header-row">
                  <div className="panel-title-group">
                    <h3 className="panel-wish-title">Lời chúc dành cho {selectedResident.animalName}</h3>
                    <span className="panel-author-meta">
                      Gửi bởi {getPublicSenderName(selectedResident)} · {formatCreatedAt(selectedResident.createdAt, selectedResident.date)}
                    </span>
                  </div>
                  <button type="button" className="panel-close-btn" onClick={handleCloseDetails} aria-label="Đóng chi tiết lời chúc">
                    <X size={16} />
                  </button>
                </div>
                <div className="panel-quote-box">
                  <p className="panel-quote-text">“{selectedResident.message}”</p>
                </div>
                <p className="panel-guide-hint">Chọn một người bạn khác trong vườn để đọc lời chúc tiếp theo.</p>
              </div>
            </div>
          ) : (
            <div className="garden-empty-panel">
              <div className="empty-panel-icon"><Sparkles size={22} color="#ff7e54" /></div>
              <div className="empty-panel-text">
                <h4>Chọn một người bạn trong vườn</h4>
                <p>Lời chúc đầy đủ sẽ xuất hiện ở đây.</p>
              </div>
            </div>
          )}
        </div>

        <div className="about-banner" style={{ marginTop: 40 }}>
          <div className="about-banner-quote">“Nếu gặp một bé cần giúp đỡ ngoài đời, <strong>bạn sẽ làm gì?</strong>”</div>
          <button type="button" className="btn-primary-warm" onClick={onGoToScenarios}>
            <span>Học cách xử lý ngay</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
