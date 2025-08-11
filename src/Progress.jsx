import { useEffect, useState } from 'react';
import { getMyProgress, markSectionComplete } from './lib/progress';

const SECTION_NAMES = ['Game', 'Share', 'Leaderboard'];

export default function Progress() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await getMyProgress();
    if (!res.ok) setMsg(res.error || 'Could not load progress');
    setRows(res.rows);
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h2>✅ Your Progress</h2>
      <ul>
        {SECTION_NAMES.map((name, idx) => {
          const found = rows.find(r => r.section === idx);
          return (
            <li key={idx} style={{ margin: '8px 0' }}>
              <b>{name}</b> — {found ? `Done (${new Date(found.completed_at).toLocaleString()})` : 'Not done'}
              {!found && (
                <button
                  style={{ marginLeft: 8 }}
                  onClick={async () => {
                    const r = await markSectionComplete(idx);
                    setMsg(r.ok ? 'Marked complete' : r.error);
                    if (r.ok) load();
                  }}
                >
                  Mark complete
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {msg && <div style={{ marginTop: 8, color: '#7aa' }}>{msg}</div>}
    </div>
  );
}
