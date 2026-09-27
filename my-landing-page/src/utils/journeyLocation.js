/**
 * Utility for one-page journey URL management and history synchronization.
 * Canonical hash states:
 * - '#choose'
 * - '#/write-wish/:animalId'
 * - '#/rescue-station'
 */

export const CANONICAL_HASHES = {
  CHOOSE: '#choose',
  WRITE_WISH: (animalId) => `#/write-wish/${animalId}`,
  RESCUE_STATION: '#/rescue-station',
};

/**
 * Parses current location (hash and legacy pathname) to determine journey state.
 *
 * @param {Location} location - window.location object
 * @param {Array<{ id: string }>} animals - List of available animals
 * @returns {{
 *   type: 'write' | 'station' | 'choose' | 'invalid_animal' | 'other',
 *   animal: Object | null,
 *   rawId: string | null,
 *   hash?: string
 * }}
 */
export function parseJourneyLocation(location, animals = []) {
  if (!location) {
    return { type: 'choose', animal: null, rawId: null };
  }

  const hash = location.hash || '';
  const pathname = location.pathname || '';

  // 1. Check for write-wish route: #/write-wish/:id or legacy /write-wish/:id
  const writeWishMatch =
    hash.match(/^#\/?write-wish\/([^/?#]+)/) ||
    pathname.match(/\/write-wish\/([^/?#]+)/);

  if (writeWishMatch) {
    const rawId = writeWishMatch[1];
    const foundAnimal = animals.find((a) => a.id === rawId);
    if (foundAnimal) {
      return { type: 'write', animal: foundAnimal, rawId };
    }
    // Invalid animal ID
    return { type: 'invalid_animal', animal: null, rawId };
  }

  // 2. Check for rescue station route: #/rescue-station, #rescue-station, #station, or legacy /rescue-station
  if (
    hash === '#/rescue-station' ||
    hash === '#rescue-station' ||
    hash === '#station' ||
    pathname === '/rescue-station'
  ) {
    return { type: 'station', animal: null, rawId: null };
  }

  // 3. Check for choose route: #choose, #/choose, #choose-friend, or home '/'
  if (
    hash === '#choose' ||
    hash === '#/choose' ||
    hash === '#choose-friend' ||
    (!hash && (pathname === '/' || pathname === ''))
  ) {
    return { type: 'choose', animal: null, rawId: null };
  }

  // 4. Other anchor hashes (e.g. #about, #learn, #support, #faq, #final-cta)
  return { type: 'other', animal: null, rawId: null, hash };
}

/**
 * Navigates to Choose Friend mode with canonical hash.
 */
export function navigateToChoose({ replace = false } = {}) {
  if (typeof window === 'undefined') return;
  const target = CANONICAL_HASHES.CHOOSE;
  if (replace) {
    window.history.replaceState(null, '', target);
  } else {
    window.history.pushState(null, '', target);
  }
}

/**
 * Navigates to Write Wish mode for a specific animal with canonical hash.
 */
export function navigateToWriteWish(animalId, { replace = false } = {}) {
  if (typeof window === 'undefined' || !animalId) return;
  const target = CANONICAL_HASHES.WRITE_WISH(animalId);
  if (replace) {
    window.history.replaceState(null, '', target);
  } else {
    window.history.pushState(null, '', target);
  }
}

/**
 * Navigates to Rescue Station / Wish Garden with canonical hash.
 */
export function navigateToRescueStation({ replace = false } = {}) {
  if (typeof window === 'undefined') return;
  const target = CANONICAL_HASHES.RESCUE_STATION;
  if (replace) {
    window.history.replaceState(null, '', target);
  } else {
    window.history.pushState(null, '', target);
  }
}

/**
 * Normalizes any legacy fake pathname (e.g. /write-wish/id or /rescue-station)
 * back to base pathname '/' with canonical hash, preventing F5 404s.
 */
export function normalizeLegacyPathname() {
  if (typeof window === 'undefined') return;
  const pathname = window.location.pathname;
  if (!pathname || pathname === '/' || pathname === '') return;

  const writeMatch = pathname.match(/\/write-wish\/([^/?#]+)/);
  if (writeMatch) {
    window.history.replaceState(null, '', `#/write-wish/${writeMatch[1]}`);
    return;
  }

  if (pathname === '/rescue-station') {
    window.history.replaceState(null, '', '#/rescue-station');
  }
}
