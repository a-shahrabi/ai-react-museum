import { useState } from 'react';
import { markSectionComplete } from './lib/progress';

export default function Intro() {
  const [msg, setMsg] = useState('');

  async function markDone() {
    const r = await markSectionComplete(3); 
    setMsg(r.ok ? 'Marked as watched.' : r.error);
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>🎬 Intro: What is AI?</h2>
      <div className="card">
        {/* Replace with desired nocookie video URL */}
        <div style={{position:'relative', paddingTop:'56.25%', borderRadius:10, overflow:'hidden', border:'1px solid var(--border)'}}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/G6de8L7cVvM?rel=0"
            title="Intro to AI"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}
          />
        </div>
        <div className="small" style={{marginTop:8}}>
          Can’t see the video? <a href="https://www.youtube.com/watch?v=G6de8L7cVvM" target="_blank" rel="noreferrer">Open on YouTube</a>
        </div>
      </div>

      <div className="row" style={{alignItems:'center'}}>
        <button className="btn" onClick={markDone}>Mark as Watched</button>
        {msg && <span className="small">{msg}</span>}
      </div>
    </div>
  );
}
