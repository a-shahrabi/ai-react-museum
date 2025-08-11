import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthTest from './AuthTest';
import ShareWall from './ShareWall';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  // If not signed in, show Auth
  if (!user) return <AuthTest />;

  // Signed in → show Share Wall
  return <ShareWall />;
}
