import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    '';

const supabasePublishableKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    '';

export const isSupabaseConfigured = Boolean(
    supabaseUrl && supabasePublishableKey
);

export const supabase = isSupabaseConfigured
    ? createClient(
        supabaseUrl,
        supabasePublishableKey,
        {
            realtime: {
                params: {
                    eventsPerSecond: 10,
                },
            },
        }
    )
    : null;