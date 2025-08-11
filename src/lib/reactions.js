import { supabase } from './supabaseClient';

export async function fetchReactionsFor(postIds = []) {
  if (!postIds.length) return [];
  const { data, error } = await supabase
    .from('reactions')
    .select('post_id, emoji, user_id')
    .in('post_id', postIds);
  if (error) throw error;
  return data || [];
}

// Toggle: add if missing, remove if already reacted with same emoji
export async function toggleReaction(postId, emoji) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false, error:'Not signed in' };

  //  insert
  const { error: insertErr } = await supabase.from('reactions').insert({
    post_id: postId,
    user_id: user.id,
    emoji
  });

  // If unique violation, delete instead (toggle off)
  if (insertErr && insertErr.code === '23505') {
    const { error: delErr } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('emoji', emoji);
    if (delErr) return { ok:false, error: delErr.message };
    return { ok:true, removed:true };
  }

  if (insertErr) return { ok:false, error: insertErr.message };
  return { ok:true, added:true };
}
