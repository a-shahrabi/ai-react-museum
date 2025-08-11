import { useState } from 'react';
import { markSectionComplete } from './lib/progress';

export default function Train() {
  const [msg, setMsg] = useState('');

  async function markDone() {
    const r = await markSectionComplete(4); // Train = 4
    setMsg(r.ok ? 'Nice! Marked complete.' : r.error);
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>🧪 Train Your Own Mini-AI</h2>

      <div className="card">
        <ol style={{ paddingLeft: '1.1rem' }}>
          <li>Go to <a href="https://teachablemachine.withgoogle.com" target="_blank" rel="noreferrer">teachablemachine.withgoogle.com</a></li>
          <li>Click <b>Get Started</b>, choose <b>Image Project</b> (or Audio/Pose).</li>
          <li>Create <b>2 classes</b> (e.g., Peace ✌️ vs Thumbs 👍).</li>
          <li>Record <b>20–30 samples</b> per class.</li>
          <li>Click <b>Train model</b> → test in the preview.</li>
          <li>Optional: record a short demo on your phone.</li>
        </ol>
      </div>

      <div className="row" style={{alignItems:'center'}}>
        <button className="btn" onClick={markDone}>I Trained It!</button>
        {msg && <span className="small">{msg}</span>}
      </div>
    </div>
  );
}
