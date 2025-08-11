import { useEffect, useState, useMemo } from 'react';
import { supabase } from './lib/supabaseClient';
import { markSectionComplete } from './lib/progress';
import { fetchReactionsFor, toggleReaction } from './lib/reactions';

const MAX = 120;
const EMOJIS = ['👍','❤️','🤯','😂'];

export default function ShareWall() {
  const [what, setWhat] = useState('');
  const [best, setBest] = useState('');
  const [hard, setHard] = useState('');
  const [caption, setCaption] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const [shares, setShares] = useState([]);
  const [reactions, setReactions] = useState([]); // array of {post_id, emoji, user_id}
  const [me, setMe] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user || null));
    loadShares();
  }, []);

  // Realtime: new shares
  useEffect(() => {
    const ch = supabase
      .channel('realtime:shares')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shares' }, (payload) => {
        setShares((prev) => [payload.new, ...prev]);
        // fetch reactions for the new post (none yet, safe to skip)
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // Realtime: reactions
  useEffect(() => {
    const ch = supabase
      .channel('realtime:reactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, () => {
        // Reload reactions for currently shown posts
        if (shares.length) refreshReactions(shares.map(s => s.id));
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [shares]);

  async function loadShares() {
    setListLoading(true);
    const { data, error } = await supabase
      .from('shares')
      .select('id, what, best, hard, caption, created_at')
      .order('created_at', { ascending: false })
      .limit(30);
    if (!error) {
      setShares(data || []);
      await refreshReactions((data || []).map(s => s.id));
    }
    setListLoading(false);
  }

  async function refreshReactions(postIds) {
    try {
      const rows = await fetchReactionsFor(postIds);
      setReactions(rows);
    } catch (e) {
      // non-fatal
    }
  }

  function valid() {
    if (!what.trim() || !best.trim() || !hard.trim()) {
      setMsg('Please fill in What, Best, and Hardest.');
      return false;
    }
    if ([what, best, hard, caption].some(v => v.length > MAX)) {
      setMsg(`Each field must be ≤ ${MAX} characters.`);
      return false;
    }
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (!valid()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('You must be signed in to post.'); return; }

    setLoading(true);
    const { error } = await supabase.from('shares').insert({
      user_id: user.id,
      what: what.trim(),
      best: best.trim(),
      hard: hard.trim(),
      caption: caption.trim() || null
    });
    setLoading(false);

    if (error) { setMsg(error.message); return; }

    setWhat(''); setBest(''); setHard(''); setCaption('');
    setMsg('Shared!');
    await markSectionComplete(1);
    // No need to reload; realtime will prepend the new post
  }

  // Build counts + whether I reacted
  const reactionIndex = useMemo(() => {
    const byPost = new Map();
    for (const r of reactions) {
      if (!byPost.has(r.post_id)) byPost.set(r.post_id, {});
      const entry = byPost.get(r.post_id);
      entry[r.emoji] = entry[r.emoji] || { count: 0, mine: false };
      entry[r.emoji].count += 1;
      if (me && r.user_id === me.id) entry[r.emoji].mine = true;
    }
    return byPost; // Map(post_id -> { emoji: {count, mine} })
  }, [reactions, me]);

  async function onReact(postId, emoji) {
    const res = await toggleReaction(postId, emoji);
    if (!res.ok) setMsg(res.error);
    // realtime handler will refresh counts
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>📣 Share What You Built</h2>

      <form onSubmit={submit} className="card" aria-label="Share your project">
        <label className="small">What did you build? <span className="small">({what.length}/{MAX})</span></label>
        <input className="input" value={what} onChange={e=>setWhat(e.target.value)} maxLength={MAX} placeholder="My AI can recognize…"/>

        <label className="small">Best part <span className="small">({best.length}/{MAX})</span></label>
        <input className="input" value={best} onChange={e=>setBest(e.target.value)} maxLength={MAX} placeholder="The best part was…"/>

        <label className="small">Hardest part <span className="small">({hard.length}/{MAX})</span></label>
        <input className="input" value={hard} onChange={e=>setHard(e.target.value)} maxLength={MAX} placeholder="The hardest part was…"/>

        <label className="small">Caption (optional) <span className="small">({caption.length}/{MAX})</span></label>
        <input className="input" value={caption} onChange={e=>setCaption(e.target.value)} maxLength={MAX} placeholder="When your AI works on the first try…"/>

        <div className="row" style={{alignItems:'center', marginTop:8}}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Posting…' : 'Post'}</button>
          {msg && <span className="small" style={{marginLeft:8}}>{msg}</span>}
        </div>
      </form>

      <div className="card">
        <h3 style={{marginTop:0}}>Recent Shares</h3>
        {listLoading && <div className="small">Loading…</div>}
        {!listLoading && shares.length === 0 && <div className="small">No posts yet. Be the first!</div>}
        {!listLoading && shares.map((s) => {
          const idx = reactionIndex.get(s.id) || {};
          return (
            <div key={s.id} style={{padding:'12px 0', borderBottom: '1px solid var(--border)'}}>
              <div><b>🧠 What:</b> {s.what}</div>
              <div><b>✅ Best:</b> {s.best}</div>
              <div><b>🧩 Hard:</b> {s.hard}</div>
              {s.caption && <div><b>💬 Caption:</b> {s.caption}</div>}
              <div className="small">{new Date(s.created_at).toLocaleString()}</div>

              {/* Reactions bar */}
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                {EMOJIS.map((e) => {
                  const info = idx[e] || { count: 0, mine: false };
                  return (
                    <button
                      key={e}
                      type="button"
                      className="btn secondary"
                      onClick={() => onReact(s.id, e)}
                      style={{
                        border: info.mine ? '1px solid var(--primary)' : undefined,
                        opacity: info.mine ? 1 : 0.9
                      }}
                      title={info.mine ? 'You reacted' : 'React'}
                    >
                      {e} {info.count || ''}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
