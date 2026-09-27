import { ANIMALS, SAMPLE_WISHES } from '../data/mockData.js';
import { isSupabaseConfigured, supabase } from './supabaseClient.js';

function createSupabaseError(operation, error) {
  const serviceError = new Error(error?.message || `Supabase ${operation} failed.`);
  serviceError.name = 'WishServiceError';
  serviceError.operation = operation;
  serviceError.status = error?.status ?? null;
  serviceError.code = error?.code ?? null;
  serviceError.details = error?.details ?? null;
  serviceError.hint = error?.hint ?? null;
  return serviceError;
}

export function getPublicSenderName(wish) {
  if (!wish) return 'Một người bạn ẩn danh';
  const raw = wish.senderDisplayName ?? wish.sender_display_name;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  return 'Một người bạn ẩn danh';
}

/**
 * Computes the always-visible Garden resident label.
 * 1. If sender_display_name exists and is non-empty: "Bé của {sender_display_name}"
 * 2. If null, empty or whitespace: fallback to animal display name (e.g. "Bé Bơ")
 * 3. Truncates unusually long sender names deterministically to safeguard Garden pills.
 */
export function getGardenResidentLabel(resident, maxSenderLength = 16) {
  if (!resident) return '';
  const rawSender = resident.senderDisplayName ?? resident.sender_display_name;
  if (typeof rawSender === 'string' && rawSender.trim()) {
    const cleanSender = rawSender.trim();
    const truncatedSender = cleanSender.length > maxSenderLength
      ? `${cleanSender.slice(0, maxSenderLength - 1).trimEnd()}…`
      : cleanSender;
    return `Bé của ${truncatedSender}`;
  }
  return resident.animalName || 'Bé ngoan';
}

const ANIMAL_PROFILE_MAP = {
  'dog-bo': { name: 'Bé Bơ', type: 'dog', breed: 'Shiba Inu lai', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80' },
  'cat-may': { name: 'Bé Mây', type: 'cat', breed: 'Mèo mướp Tabby', avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80' },
  'dog-hatde': { name: 'Bé Hạt Dẻ', type: 'dog', breed: 'Corgi lai cỏ', avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80' },
  'cat-miumiu': { name: 'Bé Miu Miu', type: 'cat', breed: 'Mèo tam thể', avatar: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80' },
  'dog-dom': { name: 'Bé Đốm', type: 'dog', breed: 'Chó ta chân trắng', avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80' },
  'cat-bong': { name: 'Bé Bông', type: 'cat', breed: 'Mèo lông dài', avatar: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80' },
  'cat-mochi': { name: 'Bé Mochi', type: 'cat', breed: 'Mèo Scottish', avatar: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80' },
  'cat-mun': { name: 'Bé Mun', type: 'cat', breed: 'Mèo đen Bombay', avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80' },
  'cat-khoi': { name: 'Bé Khói', type: 'cat', breed: 'Mèo Nga xanh', avatar: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80' },
  'dog-banhbao': { name: 'Bé Bánh Bao', type: 'dog', breed: 'Samoyed lai', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80' },
  'dog-1': { name: 'Bé Bơ', type: 'dog', breed: 'Shiba Inu lai' },
  'dog-2': { name: 'Bé Hạt Dẻ', type: 'dog', breed: 'Corgi lai cỏ' },
  'dog-3': { name: 'Bé Đốm', type: 'dog', breed: 'Chó ta chân trắng' },
  'cat-1': { name: 'Bé Mây', type: 'cat', breed: 'Mèo mướp Tabby' },
  'cat-2': { name: 'Bé Miu Miu', type: 'cat', breed: 'Mèo tam thể' },
  'cat-3': { name: 'Bé Bông', type: 'cat', breed: 'Mèo lông dài' }
};

export function resolveAnimalProfile(animalId, animalTypeFallback) {
  if (Array.isArray(ANIMALS)) {
    const found = ANIMALS.find((a) => a.id === animalId);
    if (found) {
      return {
        animalId: found.id,
        animalName: found.name,
        animalType: found.type || animalTypeFallback || 'dog',
        animalBreed: found.breed || '',
        animalAvatar: found.avatar || ''
      };
    }
  }

  const mapped = ANIMAL_PROFILE_MAP[animalId];
  if (mapped) {
    return {
      animalId,
      animalName: mapped.name,
      animalType: mapped.type || animalTypeFallback || 'dog',
      animalBreed: mapped.breed || '',
      animalAvatar: mapped.avatar || ''
    };
  }

  const isCat = animalTypeFallback === 'cat' || (typeof animalId === 'string' && animalId.startsWith('cat'));
  return {
    animalId,
    animalName: isCat ? 'Bé Mèo' : 'Bé Cún',
    animalType: isCat ? 'cat' : 'dog',
    animalBreed: '',
    animalAvatar: ''
  };
}

export function formatWishRow(row, fallbackOverrides = {}) {
  if (!row) return null;
  const cleanSender = row.sender_display_name?.trim() || fallbackOverrides.senderDisplayName || fallbackOverrides.sender_display_name || null;
  const animalProfile = resolveAnimalProfile(row.animal_id, row.animal_type);

  return {
    id: row.id,
    animalId: row.animal_id,
    animalName: row.animal_name || fallbackOverrides.animalName || animalProfile.animalName,
    animalType: row.animal_type || fallbackOverrides.animalType || animalProfile.animalType,
    animalBreed: row.animal_breed || fallbackOverrides.animalBreed || animalProfile.animalBreed || '',
    animalAvatar: row.animal_avatar || fallbackOverrides.animalAvatar || animalProfile.animalAvatar || '',
    message: row.message,
    senderDisplayName: cleanSender,
    sender_display_name: cleanSender,
    date: row.created_at ? formatRelativeTime(row.created_at) : 'Gần đây',
    createdAt: row.created_at
  };
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Gần đây';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 5) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

export async function submitWish({
  animalId,
  animalType,
  animalName,
  message,
  senderDisplayName = null
}) {
  const trimmedMessage = (message || '').trim();
  if (trimmedMessage.length < 2) throw new Error('Lời chúc cần tối thiểu 2 ký tự.');
  if (trimmedMessage.length > 200) throw new Error('Lời chúc không được vượt quá 200 ký tự.');

  const cleanSender = typeof senderDisplayName === 'string' && senderDisplayName.trim()
    ? senderDisplayName.trim().slice(0, 30)
    : null;

  // PRODUCT MODEL: Only store essential fields in Supabase.
  // Unsupported fields (animal_avatar, animal_name, animal_breed, animal_age) are omitted.
  const payload = {
    animal_id: animalId,
    animal_type: animalType,
    message: trimmedMessage
  };

  if (cleanSender) {
    payload.sender_display_name = cleanSender;
  }

  if (isSupabaseConfigured) {
    let { data, error } = await supabase
      .from('wishes')
      .insert(payload)
      .select()
      .single();

    // If sender_display_name column is not in schema cache on remote table,
    // gracefully fall back to inserting without it so user wishes are never lost.
    if (error && error.code === 'PGRST204' && payload.sender_display_name) {
      console.warn('[wishService] sender_display_name column not found in schema cache. Retrying without it...');
      const fallbackPayload = {
        animal_id: payload.animal_id,
        animal_type: payload.animal_type,
        message: payload.message
      };
      const retryResult = await supabase
        .from('wishes')
        .insert(fallbackPayload)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      throw createSupabaseError('insert', error);
    }

    return formatWishRow(data, {
      senderDisplayName: cleanSender,
      animalName
    });
  }

  const createdAt = new Date().toISOString();
  return {
    id: globalThis.crypto?.randomUUID?.() || `wish-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    animalId,
    animalName: animalName || resolveAnimalProfile(animalId, animalType).animalName,
    animalType,
    message: trimmedMessage,
    senderDisplayName: cleanSender,
    sender_display_name: cleanSender,
    date: 'Vừa xong',
    createdAt
  };
}

export async function fetchPublicWishes() {
  if (!isSupabaseConfigured) return [...SAMPLE_WISHES];

  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(60);

  if (error) {
    throw createSupabaseError('select', error);
  }

  return Array.isArray(data) ? data.map((row) => formatWishRow(row)).filter(Boolean) : [];
}

export function subscribeToWishInserts(onInsert, onStatusChange) {
  if (!isSupabaseConfigured) return () => {};

  const channelName = `wish-garden-${globalThis.crypto?.randomUUID?.() || Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'wishes' },
      (payload) => {
        const wish = formatWishRow(payload.new);
        if (wish) onInsert(wish);
      }
    )
    .subscribe((status) => onStatusChange?.(status));

  return () => {
    void supabase.removeChannel(channel);
  };
}

export const fetchApprovedWishes = fetchPublicWishes;
