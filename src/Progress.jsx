import { useEffect, useState } from 'react';
import { getMyProgress, markSectionComplete } from './lib/progress';
import { supabase } from './lib/supabaseClient';
import { ensureProfile } from './lib/ensureProfile';

const SECTION_NAMES = ['Game', 'Share', 'Leaderboard', 'Intro', 'Train', 'Discuss'];

export default function Progress() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingName, setLoadingName] = useState(true);

  async function loadProgress() {
    const res = await getMyProgress();
    if (!res.ok) setMsg(res.error || 'Could not load progress');
    setRows(res.rows || []);
  }
  async function loadProfile() {
    setLoadingName(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setDisplayName(''); setLoadingName(false); return; }
    const { data } = await supabase.from('users').select('display_name').eq('id', user.id).single();
    setDisplayName(data?.display_name || ''); setLoadingName(false);
  }

  useEffect(() => { loadProgress(); loadProfile(); }, []);

  async function saveName() {
    setMsg(''); await ensureProfile(displayName || null);
    setMsg('Display name saved. New scores will show this name.');
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>✅ Your Progress</h2>

      <div className="card">
        <div style={{fontWeight:600, marginBottom:8}}>Profile</div>
        {loadingName ? <div className="small">Loading name…</div> : (
          <div className="row" style={{alignItems:'center'}}>
            <input className="input" placeholder="Display name (e.g., Ardi)" value={displayName}
                   onChange={e=>setDisplayName(e.target.value)} maxLength={40}/>
            <button className="btn" onClick={saveName}>Save name</button>
          </div>
        )}
        <div className="small" style={{marginTop:6}}>Tip: Old scores keep the old name; new scores will use the updated name.</div>
      </div>

      <div className="card">
        {SECTION_NAMES.map((name, idx) => {
          const found = rows.find(r => r.section === idx);
          return (
            <div key={idx} style={{padding:'8px 0', borderBottom: idx===SECTION_NAMES.length-1?'none':'1px solid var(--border)'}}>
              <b>{name}</b> — {found ? `Done (${new Date(found.completed_at).toLocaleString()})` : 'Not done'}
              {!found && (
                <button className="btn secondary" style={{marginLeft:8}}
                        onClick={async()=>{ const r=await markSectionComplete(idx); setMsg(r.ok?'Marked complete':r.error); if(r.ok) loadProgress(); }}>
                  Mark complete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {msg && <div className="small">{msg}</div>}
    </div>
  );
}
