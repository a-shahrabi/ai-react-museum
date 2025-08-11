import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { markSectionComplete } from './lib/progress';

const PROMPTS = [
  'What would you do if AI took over everything?',
  'Can AI mess up or be unfair? Give examples.',
  'Should there be rules for AI? Who should make them?'
];

export default function Discuss() {
  const [choice, setChoice] = useState(0);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [mine, setMine] = useState([]);

  useEffect(() => { loadMyReflections(); }, []);

  async function loadMyReflections() {
    // With RLS, filter by user_id for clarity
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMine([]); return; }

    const { data, error } = await supabase
      .from('reflections')
      .select('id, prompt, body, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error) setMine(data || []);
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (!text.trim()) { setMsg('Please write your thoughts.'); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Please sign in.'); return; }

    setSaving(true);
    const { error } = await supabase.from('reflections').insert({
      user_id: user.id,
      prompt: PROMPTS[choice],
      body: text.trim()
    });
    setSaving(false);

    if (error) { setMsg(error.message); return; }

    setText('');
    setMsg('Reflection saved (private).');
    await markSectionComplete(5); // Discuss = 5
    await loadMyReflections();
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>💬 Discuss: Think about AI</h2>

      <form onSubmit={submit} className="card">
        <label className="small">Choose a prompt</label>
        <select className="input" value={choice} onChange={e=>setChoice(Number(e.target.value))}>
          {PROMPTS.map((p, i) => <option key={i} value={i}>{p}</option>)}
        </select>

        <label className="small" style={{marginTop:8}}>Your private reflection</label>
        <textarea
          className="textarea"
          rows={5}
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Write a short reflection (only you can see it)."
          maxLength={500}
        />

        <div className="row" style={{alignItems:'center'}}>
          <button className="btn" disabled={saving}>{saving ? 'Submitting…' : 'Save Reflection'}</button>
          {msg && <span className="small">{msg}</span>}
        </div>
      </form>

      <div className="card">
        <h3 style={{marginTop:0}}>Your Recent Reflections</h3>
        {mine.length === 0 && <div className="small">No reflections yet.</div>}
        {mine.map(r => (
          <div key={r.id} style={{padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
            <div className="small">{new Date(r.created_at).toLocaleString()}</div>
            <div><b>Prompt:</b> {r.prompt}</div>
            <div style={{marginTop:6}}>{r.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
