import { useMemo, useState } from 'react';
import { saveScore } from './lib/scores';
import { markSectionComplete } from './lib/progress';

const ALL = [
  { t: "Roses are red...", a: "human" },
  { t: "The ethereal moonlight cascaded through crystalline dewdrops...", a: "ai" },
  { t: "OMG this pizza is literally fire 🔥🔥🔥", a: "human" },
  { t: "Leverage synergistic paradigms to optimize productivity.", a: "ai" },
  { t: "My dog ate my homework (for real).", a: "human" },
  { t: "In the quantum realm, consciousness emerges from binary.", a: "ai" },
  { t: "Just burned my toast again 😭", a: "human" },
  { t: "An elephant danced upon velvet clouds.", a: "ai" },
];

export default function Game({ onSaved }) {
  const questions = useMemo(() => ALL.slice().sort(() => Math.random() - 0.5).slice(0, 5), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const q = questions[i];

  function pick(ans) {
    if (feedback) return;
    const correct = ans === q.a;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
  }

  async function next() {
    if (i + 1 >= questions.length) {
      setSaving(true);
      const res = await saveScore(score);
      if (!res.ok) setSavedMsg(res.error || 'Could not save score');
      else { setSavedMsg(`Saved: ${score}/5`); await markSectionComplete(0); }
      setSaving(false);
      if (onSaved) setTimeout(() => onSaved?.(), 400); else setTimeout(() => setSavedMsg(''), 1000);
      return;
    }
    setI(i + 1); setFeedback(null);
  }

  const isNextDisabled = (i + 1 >= questions.length) ? saving : false;

  return (
    <div>
      <h2 style={{marginTop:0}}>🎮 AI or Human?</h2>
      <div className="small">Q{i + 1}/5 — Score: {score}</div>

      {!feedback ? (
        <>
          <div className="card" style={{marginTop:12}}>
            {q.t}
          </div>
          <div className="row" style={{marginTop:12}}>
            <button className="btn secondary" onClick={() => pick('ai')} disabled={!!feedback}>AI</button>
            <button className="btn secondary" onClick={() => pick('human')} disabled={!!feedback}>Human</button>
          </div>
        </>
      ) : (
        <>
          <div className="badge" style={{marginTop:12, background: feedback==='correct'?'#062e1f':'#2b0f14', color: feedback==='correct'?'#8ef5c4':'#ffb4b4'}}>
            {feedback === 'correct' ? '✅ Correct!' : '❌ Not quite'}
          </div>
          <div className="spacer"></div>
          <button className="btn" onClick={next} disabled={isNextDisabled}>
            {i + 1 >= questions.length ? (saving ? 'Saving…' : 'Finish & Save') : 'Next'}
          </button>
        </>
      )}

      {savedMsg && <div className="small" style={{marginTop:10}}>{savedMsg}</div>}
    </div>
  );
}
