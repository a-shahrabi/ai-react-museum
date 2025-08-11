import { supabase } from './supabaseClient';

export async function ensureProfile(displayName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  await supabase.from('users').upsert({ id: user.id, display_name: displayName ?? null });
  return user;
}
