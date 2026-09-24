const DOG_VARIANTS = ['golden', 'corgi', 'spotted', 'white-dog'];
const CAT_VARIANTS = ['tabby', 'calico', 'white', 'cream', 'black', 'gray'];
const BEHAVIORS = ['walk', 'tiny-run', 'idle', 'look-around', 'small-hop'];

export function hashString(value) {
  let hash = 2166136261;
  const input = String(value ?? '');
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededFraction(seed, salt) {
  let value = (seed + Math.imul(salt, 2654435761)) >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967295;
}

export function getVisualVariant(wish) {
  if (wish.variant) return wish.variant;
  const variants = wish.animalType === 'dog' ? DOG_VARIANTS : CAT_VARIANTS;
  return variants[hashString(wish.id) % variants.length];
}

export function createGardenResident(wish, index = 0) {
  const seed = hashString(wish.id);
  const column = index % 6;
  const row = Math.floor(index / 6) % 6;
  const x = 9 + column * 16.4 + (seededFraction(seed, 1) - 0.5) * 4;
  const y = 18 + row * 13.8 + (seededFraction(seed, 2) - 0.5) * 4;

  return {
    ...wish,
    residentId: wish.id,
    wishId: wish.id,
    visualVariant: getVisualVariant(wish),
    variant: getVisualVariant(wish),
    hasFlower: seed % 3 === 0,
    x: Math.max(7, Math.min(93, x)),
    y: Math.max(14, Math.min(88, y)),
    targetX: Math.max(7, Math.min(93, x)),
    targetY: Math.max(14, Math.min(88, y)),
    speed: 11 + seededFraction(seed, 3) * 10,
    direction: seededFraction(seed, 4) > 0.5 ? 1 : -1,
    behavior: BEHAVIORS[seed % BEHAVIORS.length],
    pauseUntil: 0,
    randomState: seed || 1
  };
}

/**
 * Merge wishes into residents using wish.id as the only identity key.
 * Animal, sender, and message values intentionally have no role in deduplication.
 */
export function appendResidentsByWishId(currentResidents, incomingWishes) {
  const residentIds = new Set(currentResidents.map((resident) => resident.residentId));
  const nextResidents = [...currentResidents];

  for (const wish of incomingWishes) {
    if (!wish?.id || residentIds.has(wish.id)) continue;
    residentIds.add(wish.id);
    nextResidents.push(createGardenResident(wish, nextResidents.length));
  }

  return nextResidents;
}

export function nextResidentRandom(resident) {
  resident.randomState = (Math.imul(resident.randomState, 1664525) + 1013904223) >>> 0;
  return resident.randomState / 4294967295;
}

export const GARDEN_BEHAVIORS = BEHAVIORS;
