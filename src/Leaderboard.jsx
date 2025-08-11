import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg]   = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setMsg('');
    const { data, error } = await supabase
      .from('scores')
      .select('score, user_id, created_at')      // keep simple; names later
      .order('score', { ascending: false })
      .limit(10);
    if (error) { setMsg(error.message); return; }
    setRows(data || []);
  }

  // Temporary helper so you can test inserting a score from the UI
  async function addTestScore(score = Math.floor(Math.random()*6)) {
    setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Please sign in first.'); return; }
    const { error } = await supabase.from('scores').insert({ user_id: user.id, score });
    if (error) { setMsg(error.message); return; }
    setMsg(`Saved score: ${score}`);
    await load();
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h2>🏆 Leaderboard (Top 10)</h2>
      <button onClick={() => addTestScore()} style={{ padding:'8px 12px', margin:'8px 0' }}>
        Add Test Score
      </button>
      <div style={{ marginTop: 6, color: '#7aa' }}>{msg}</div>

      <table style={{ width:'100%', borderCollapse:'collapse', marginTop:12 }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left', borderBottom:'1px solid #ccc', padding:'8px' }}>#</th>
            <th style={{ textAlign:'left', borderBottom:'1px solid #ccc', padding:'8px' }}>User</th>
            <th style={{ textAlign:'left', borderBottom:'1px solid #ccc', padding:'8px' }}>Score</th>
            <th style={{ textAlign:'left', borderBottom:'1px solid #ccc', padding:'8px' }}>When</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan="4" style={{ padding:'10px' }}>No scores yet.</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding:'8px' }}>{i+1}</td>
              <td style={{ padding:'8px' }}>
                {/* We'll show display names later; for now, short user id */}
                {String(r.user_id).slice(0,8)}…
              </td>
              <td style={{ padding:'8px' }}>{r.score}</td>
              <td style={{ padding:'8px' }}>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
