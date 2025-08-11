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
import Finish from './Finish';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('intro');
  
  // Theme state and functionality
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

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
            <button className={`tab ${tab==='finish'?'active':''}`} onClick={()=>setTab('finish')}>Finish</button> {/* NEW */}
          </div>
          <div className="row right" style={{alignItems:'center'}}>
            <button className="btn secondary" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
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
        {tab === 'finish'      && <div className="card"><Finish /></div>} {/* NEW */}
      </main>
    </>
  );
}