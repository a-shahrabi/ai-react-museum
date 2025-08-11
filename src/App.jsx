import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthTest from './AuthTest';
import Intro from './Intro';
import Game from './Game';
import Train from './Train';
import ShareWall from './ShareWall';
import Discuss from './Discuss';
import Leaderboard from './Leaderboard';
import Progress from './Progress';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('intro'); // default to Intro

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setTab('intro');
  }

  if (!user) return <div className="container"><AuthTest /></div>;

  return (
    <>
      <div className="header">
        <div className="header-inner container">
          <div className="tabs">
            <button className={`tab ${tab==='intro'?'active':''}`} onClick={()=>setTab('intro')}>Intro</button>
            <button className={`tab ${tab==='game'?'active':''}`} onClick={()=>setTab('game')}>Game</button>
            <button className={`tab ${tab==='train'?'active':''}`} onClick={()=>setTab('train')}>Train</button>
            <button className={`tab ${tab==='share'?'active':''}`} onClick={()=>setTab('share')}>Share</button>
            <button className={`tab ${tab==='discuss'?'active':''}`} onClick={()=>setTab('discuss')}>Discuss</button>
            <button className={`tab ${tab==='leaderboard'?'active':''}`} onClick={()=>setTab('leaderboard')}>Leaderboard</button>
            <button className={`tab ${tab==='progress'?'active':''}`} onClick={()=>setTab('progress')}>Progress</button>
          </div>
          <div className="row right" style={{alignItems:'center'}}>
            <span className="small">{user?.email}</span>
            <button className="btn danger" onClick={handleSignOut}>Log out</button>
          </div>
        </div>
      </div>

      <main className="container">
        {tab === 'intro'       && <div className="card"><Intro /></div>}
        {tab === 'game'        && <div className="card"><Game onSaved={() => setTab('leaderboard')} /></div>}
        {tab === 'train'       && <div className="card"><Train /></div>}
        {tab === 'share'       && <div className="card"><ShareWall /></div>}
        {tab === 'discuss'     && <div className="card"><Discuss /></div>}
        {tab === 'leaderboard' && <div className="card"><Leaderboard /></div>}
        {tab === 'progress'    && <div className="card"><Progress /></div>}
      </main>
    </>
  );
}
