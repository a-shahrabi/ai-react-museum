import { supabase } from './supabaseClient';

export async function markSectionComplete(section) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false, error:'Not signed in' };
  const { error } = await supabase.from('progress').upsert({
    user_id: user.id,
    section: Number(section)
  });
  if (error) return { ok:false, error:error.message };
  return { ok:true };
}

export async function getMyProgress() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false, error:'Not signed in', rows:[] };
  const { data, error } = await supabase
    .from('progress')
    .select('section, completed_at')
    .order('section', { ascending:true });
  if (error) return { ok:false, error:error.message, rows:[] };
  return { ok:true, rows:data || [] };
}
