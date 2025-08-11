import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { ensureProfile } from './lib/ensureProfile'; 

export default function AuthTest() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) await ensureProfile(); // create profile row if missing
      setMsg(error ? error.message : 'Signed in!');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setMsg(error ? error.message : 'Check your email to confirm.');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMsg('Signed out');
  }

  async function saveName() {
    await ensureProfile(displayName || null);
    setMsg('Profile saved');
    setDisplayName('');
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Auth Test</h2>

      {user ? (
        <>
          <div>Logged in as: <b>{user.email}</b></div>

          <div style={{ marginTop: 8 }}>
            <input
              placeholder="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ display: 'block', width: '100%', margin: '8px 0', padding: 10 }}
            />
            <button onClick={saveName}>Save name</button>
          </div>

          <button style={{ marginTop: 8 }} onClick={signOut}>Sign out</button>
          <div style={{ marginTop: 8, color: '#7aa' }}>{msg}</div>
        </>
      ) : (
        <form onSubmit={submit}>
          <input
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            style={{ display:'block', width:'100%', margin:'8px 0', padding:10 }}
          />
          <button type="submit">{mode==='signin' ? 'Sign in' : 'Sign up'}</button>
          <div style={{ marginTop: 8, color: '#7aa' }}>{msg}</div>
          <button
            type="button"
            onClick={()=>setMode(mode==='signin'?'signup':'signin')}
            style={{ marginTop: 8 }}
          >
            {mode==='signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
          </button>
        </form>
      )}
    </div>
  );
}
