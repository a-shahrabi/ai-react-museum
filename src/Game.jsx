import { useMemo, useState } from 'react';
import { saveScore } from './lib/scores';

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
  const questions = useMemo(() => ALL.slice().sort(() => Math.random() - 0.5).slice(0,5), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const q = questions[i];

  function pick(ans) {
    const correct = ans === q.a;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
  }

  async function next() {
    if (i + 1 >= questions.length) {
      // finished → save
      const res = await saveScore(score);
      if (!res.ok) alert(res.error);
      else alert(`Score saved: ${score}/5`);
      onSaved?.(); // e.g., go to leaderboard
      return;
    }
    setI(i + 1);
    setFeedback(null);
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h2>🎮 AI or Human?</h2>
      <div style={{ margin: '8px 0' }}>Q{i+1}/5 — Score: {score}</div>

      {!feedback ? (
        <>
          <div style={{ padding:12, border:'1px solid #ccc', borderRadius:8, minHeight:80 }}>
            {q.t}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button onClick={() => pick('ai')}>AI</button>
            <button onClick={() => pick('human')}>Human</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop:12, fontWeight:700, color: feedback==='correct' ? 'green' : 'crimson' }}>
            {feedback === 'correct' ? '✅ Correct!' : '❌ Not quite'}
          </div>
          <button style={{ marginTop:8 }} onClick={next}>
            {i + 1 >= questions.length ? 'Finish & Save' : 'Next'}
          </button>
        </>
      )}
    </div>
  );
}
