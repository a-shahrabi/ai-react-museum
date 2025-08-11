import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthTest from './AuthTest';
import ShareWall from './ShareWall';
import Leaderboard from './Leaderboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab]   = useState('share'); // 'share' | 'leaderboard'

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
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:16 }}>
        <button onClick={() => setTab('share')}>Share Wall</button>
        <button onClick={() => setTab('leaderboard')}>Leaderboard</button>
      </div>
      {tab === 'share' ? <ShareWall /> : <Leaderboard />}
    </div>
  );
}
