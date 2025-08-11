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
      .select('score, user_id, created_at')
      .order('score', { ascending: false })
      .limit(10);
    if (error) { setMsg(error.message); return; }
    setRows(data || []);
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h2>🏆 Leaderboard (Top 10)</h2>
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
              <td style={{ padding:'8px' }}>{String(r.user_id).slice(0,8)}…</td>
              <td style={{ padding:'8px' }}>{r.score}</td>
              <td style={{ padding:'8px' }}>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
