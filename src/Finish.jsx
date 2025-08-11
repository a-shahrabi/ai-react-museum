import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { getMyProgress } from './lib/progress';

const REQUIRED_SECTIONS = [0, 1, 2, 3, 4, 5]; // Game, Share, Leaderboard, Intro, Train, Discuss

export default function Finish() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [progressRows, setProgressRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);

      if (user) {
        // load display name (fallback to email prefix)
        const { data } = await supabase.from('users').select('display_name').eq('id', user.id).single();
        const fallback = user.email?.split('@')[0] || 'Student';
        setDisplayName((data?.display_name || '').trim() || fallback);
      }

      const p = await getMyProgress();
      setProgressRows(p.rows || []);
    })();
  }, []);

  const allDone = useMemo(() => {
    const done = new Set(progressRows.map(r => r.section));
    return REQUIRED_SECTIONS.every(s => done.has(s));
  }, [progressRows]);

  function drawCertificate() {
    // Canvas setup
    const W = 1600, H = 1000;
    const canvas = canvasRef.current;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0b1220');
    grad.addColorStop(1, '#1b2641');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Title
    ctx.fillStyle = '#e5e7eb';
    ctx.textAlign = 'center';

    ctx.font = 'bold 72px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText('Certificate of Completion', W / 2, 180);

    // Subtitle
    ctx.font = '28px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillStyle = '#bfc7d9';
    ctx.fillText('AI Learning Module (Ages 10–14)', W / 2, 230);

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText(displayName, W / 2, 380);

    // Line under name
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W/2 - 400, 410);
    ctx.lineTo(W/2 + 400, 410);
    ctx.stroke();

    // Body text
    ctx.fillStyle = '#d2d8ea';
    ctx.font = '32px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText('has completed all sections:', W / 2, 470);

    ctx.font = '26px system-ui, -apple-system, Segoe UI, Roboto';
    const lines = [
      '🎬 Intro · 🎮 AI or Human Game · 🧪 Train an AI',
      '📣 Share · 💬 Discuss · 🏆 Leaderboard'
    ];
    ctx.fillText(lines[0], W/2, 520);
    ctx.fillText(lines[1], W/2, 560);

    // Date & signature line
    const date = new Date().toLocaleDateString();
    ctx.font = '24px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillStyle = '#bfc7d9';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${date}`, 140, H - 140);

    ctx.textAlign = 'right';
    ctx.fillText('Instructor: ____________________', W - 140, H - 140);

    // Badge
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(W/2, 690, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 40px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText('AI', W/2, 705);

    // Export to data URL
    const url = canvas.toDataURL('image/png');
    setPreview(url);
    setMsg('Certificate ready. Click Download.');
  }

  function download() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = `certificate-${displayName}.png`;
    a.click();
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>🎉 Finish & Certificate</h2>

      {!allDone && (
        <div className="card" role="alert">
          You haven’t completed all sections yet. Keep going!
          <div className="small" style={{ marginTop: 6 }}>
            You need: Intro, Game, Train, Share, Discuss, and Leaderboard.
          </div>
        </div>
      )}

      <div className="card">
        <div className="row" style={{ alignItems: 'center' }}>
          <button className="btn" onClick={drawCertificate} disabled={!allDone}>
            {allDone ? 'Generate Certificate' : 'Complete all sections to unlock'}
          </button>
          {preview && (
            <>
              <button className="btn secondary" onClick={download}>Download</button>
              <span className="small">PNG • looks great printed on A4/Letter</span>
            </>
          )}
        </div>

        {/* Hidden canvas used to render the certificate */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: 12 }}>
            <img
              src={preview}
              alt="Certificate preview"
              style={{ width: '100%', maxWidth: 800, display: 'block', borderRadius: 12, border: '1px solid var(--border)' }}
            />
          </div>
        )}

        {msg && <div className="small" style={{ marginTop: 8 }}>{msg}</div>}
      </div>
    </div>
  );
}
