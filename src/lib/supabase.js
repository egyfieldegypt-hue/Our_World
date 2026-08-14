import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

/** Resolve an image value to a displayable URL.
 *  - absolute URLs pass through
 *  - "/images/..." = bundled site asset
 *  - any other relative path = file in the public "bayna" storage bucket
 */
export function storageUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/')) return path;
  if (isSupabaseConfigured) {
    return `${url}/storage/v1/object/public/bayna/${path}`;
  }
  return path;
}