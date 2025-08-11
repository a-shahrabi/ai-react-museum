import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { ensureProfile } from './lib/ensureProfile';

export default function ShareWall() {
  const [what, setWhat]   = useState('');
  const [best, setBest]   = useState('');
  const [hard, setHard]   = useState('');
  const [caption, setCaption] = useState('');
  const [items, setItems] = useState([]);
  const [msg, setMsg]     = useState('');

  // Load latest shares on mount
  useEffect(() => {
    loadShares();
  }, []);

  async function loadShares() {
    const { data, error } = await supabase
      .from('shares')
      .select('*')                 // keep it simple: no joins for now
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) { setMsg(error.message); return; }
    setItems(data || []);
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    // must be logged in to post
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Please sign in first.'); return; }

    // Make sure profile row exists (safe no-op if it already does)
    await ensureProfile();

    // Insert new share (RLS allows only your own user_id)
    const { error } = await supabase.from('shares').insert({
      user_id: user.id,
      what, best, hard, caption
    });

    if (error) { setMsg(error.message); return; }

    // Clear form and refresh list
    setWhat(''); setBest(''); setHard(''); setCaption('');
    setMsg('Shared!');
    await loadShares();
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h2>📣 Share What You Built</h2>

      <form onSubmit={submit} style={{ margin: '1rem 0' }}>
        <input
          placeholder="My AI can recognize…"
          value={what}
          onChange={e=>setWhat(e.target.value)}
          maxLength={120}
          style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
          required
        />
        <input
          placeholder="Best part…"
          value={best}
          onChange={e=>setBest(e.target.value)}
          maxLength={120}
          style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
          required
        />
        <input
          placeholder="Hardest part…"
          value={hard}
          onChange={e=>setHard(e.target.value)}
          maxLength={120}
          style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
          required
        />
        <input
          placeholder="Caption (optional)"
          value={caption}
          onChange={e=>setCaption(e.target.value)}
          maxLength={120}
          style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
        />
        <button type="submit" style={{ padding:'10px 14px' }}>Post</button>
        <div style={{ marginTop:8, color:'#7aa' }}>{msg}</div>
      </form>

      <h3>Recent Shares</h3>
      <div>
        {items.length === 0 && <div>No posts yet.</div>}
        {items.map(item => (
          <div key={item.id}
               style={{ border:'1px solid #ccc', borderRadius:8, padding:12, margin:'10px 0' }}>
            <div style={{ fontSize:12, opacity:0.7 }}>
              {new Date(item.created_at).toLocaleString()}
            </div>
            <div>🧠 <b>What:</b> {item.what}</div>
            <div>✅ <b>Best:</b> {item.best}</div>
            <div>🧩 <b>Hard:</b> {item.hard}</div>
            {item.caption && <div>💬 <b>Caption:</b> {item.caption}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
