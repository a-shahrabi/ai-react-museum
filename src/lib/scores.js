import { supabase } from './supabaseClient';

export async function saveScore(score) {
  const s = Math.max(0, Math.min(5, Number(score))); // clamp 0..5

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false, error:'Not signed in' };

  // Try to fetch profile for display_name
  let display_name = null;
  const { data: profile } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single();
  if (profile?.display_name) display_name = profile.display_name;

  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    score: s,
    display_name
  });

  if (error) return { ok:false, error:error.message };
  return { ok:true };
}
