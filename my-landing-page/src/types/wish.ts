/**
 * wish.ts - TypeScript Definitions for Wishes in Trạm Yêu Thương
 */

export type AnimalType = 'cat' | 'dog';

/**
 * Frontend runtime Wish object.
 * Animal display properties (animalName, animalBreed, animalAvatar)
 * are resolved on the frontend using animalId.
 */
export interface Wish {
  id: string;
  animalId: string;
  animalName: string;
  animalType: AnimalType;
  animalBreed?: string;
  animalAvatar?: string;
  message: string;
  /** Optional public sender display name chosen by user. If null/undefined/empty -> fallback to "Một người bạn ẩn danh" */
  senderDisplayName?: string | null;
  /** Database column mapping */
  sender_display_name?: string | null;
  date?: string;
  createdAt?: string;
  /** Legacy database field. Public visibility no longer depends on a UI moderation state. */
  status?: string;
  variant?: string;
  x?: number;
  y?: number;
}

/**
 * Product model input for submitting a wish.
 * Primarily stores animalId, animalType, message, and senderDisplayName.
 */
export interface CreateWishInput {
  animalId: string;
  animalType: AnimalType;
  message: string;
  senderDisplayName?: string | null;
  /** Optional client-side fallback hint */
  animalName?: string;
}

/**
 * Minimal database record as stored in Supabase `public.wishes`
 */
export interface WishRow {
  id: string;
  animal_id: string;
  animal_type: AnimalType;
  message: string;
  sender_display_name?: string | null;
  status?: string;
  created_at: string;
}

/**
 * Helper to resolve the public sender display name with fallback
 * @param wish Wish or partial wish object
 * @returns Clean display name or "Một người bạn ẩn danh"
 */
export function getPublicSenderName(wish?: Partial<Wish> | null): string {
  if (!wish) return 'Một người bạn ẩn danh';
  const raw = wish.senderDisplayName ?? wish.sender_display_name;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return 'Một người bạn ẩn danh';
}

/**
 * Helper to resolve the always-visible Garden resident label.
 * If senderDisplayName exists -> "Bé của {senderDisplayName}"
 * Otherwise fallback to animalName (e.g. "Bé Bơ")
 */
export function getGardenResidentLabel(resident?: Partial<Wish> | null, maxSenderLength = 16): string {
  if (!resident) return '';
  const rawSender = resident.senderDisplayName ?? resident.sender_display_name;
  if (typeof rawSender === 'string' && rawSender.trim().length > 0) {
    const cleanSender = rawSender.trim();
    const truncatedSender = cleanSender.length > maxSenderLength
      ? `${cleanSender.slice(0, maxSenderLength - 1).trimEnd()}…`
      : cleanSender;
    return `Bé của ${truncatedSender}`;
  }
  return resident.animalName || 'Bé ngoan';
}
