import { supabase } from './supabaseClient';

// Call this when the player finishes the game
export async function saveScore(score) {
  // DB constraint is 0..5; clamp just in case
  const s = Math.max(0, Math.min(5, Number(score)));

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not signed in' };

  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    score: s
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
