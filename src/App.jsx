import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthTest from './AuthTest';
import ShareWall from './ShareWall';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Progress from './Progress'; // <-- added

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('game'); // 'game' | 'share' | 'leaderboard' | 'progress'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  if (!user) return <AuthTest />;

  return (
    <div>
      <header
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          padding: '10px 0',
          borderBottom: '1px solid #ddd',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10
        }}
      >
        <button onClick={() => setTab('game')} style={{ fontWeight: tab === 'game' ? 700 : 400 }}>
          Game
        </button>
        <button onClick={() => setTab('share')} style={{ fontWeight: tab === 'share' ? 700 : 400 }}>
          Share Wall
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          style={{ fontWeight: tab === 'leaderboard' ? 700 : 400 }}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setTab('progress')}
          style={{ fontWeight: tab === 'progress' ? 700 : 400 }}
        >
          Progress
        </button>
      </header>

      {tab === 'game' && <Game onSaved={() => setTab('leaderboard')} />}
      {tab === 'share' && <ShareWall />}
      {tab === 'leaderboard' && <Leaderboard />}
      {tab === 'progress' && <Progress />}{/* <-- added */}
    </div>
  );
}
