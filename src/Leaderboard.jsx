import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { markSectionComplete } from './lib/progress';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  async function loadScores() {
    const { data, error } = await supabase
      .from('scores')
      .select('score, created_at, user_id, display_name')
      .order('score', { ascending: false })
      .limit(10);
    if (!error) setScores(data || []);
  }

  useEffect(() => {
    loadScores();
    markSectionComplete(2);

    // 🔵 Realtime: new scores
    const channel = supabase
      .channel('realtime:scores')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scores' },
        () => loadScores() // just reload top 10 for simplicity
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div>
      <h2 style={{marginTop:0}}>🏆 Leaderboard (Top 10)</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th><th>Score</th><th>When</th>
            </tr>
          </thead>
          <tbody>
            {scores.length===0 && <tr><td colSpan="3" className="small">No scores yet.</td></tr>}
            {scores.map((row, i) => (
              <tr key={i}>
                <td>{row.display_name?.trim() || `${row.user_id?.slice(0,8)}…`}</td>
                <td><span className="badge">{row.score}/5</span></td>
                <td className="small">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
