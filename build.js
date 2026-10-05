const fs = require('fs');
const path = require('path');

// Read base64 image
const avatarB64 = fs.readFileSync('avatar_b64.txt', 'utf8').trim();

// ── THANK YOU PAGE ──────────────────────────────────────────────────
const thankyouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Received — Phantom X Core</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: #a855f7;
      --accent2: #6366f1;
    }
    html, body {
      height: 100%;
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #000;
      color: #e2e8f0;
      overflow: hidden;
    }
    * { cursor: none; }
    #cursor-dot {
      position: fixed; top: 0; left: 0; z-index: 9999;
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 12px var(--accent), 0 0 24px var(--accent);
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: transform 0.05s;
    }
    #cursor-ring {
      position: fixed; top: 0; left: 0; z-index: 9998;
      width: 36px; height: 36px; border-radius: 50%;
      border: 2px solid rgba(168,85,247,0.5);
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: left 0.1s ease, top 0.1s ease, width 0.2s, height 0.2s;
    }
    #bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

    /* Navbar */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2.5rem; height: 62px;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(168,85,247,0.18);
    }
    .nav-logo {
      font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px;
      background: linear-gradient(90deg, #fff 10%, var(--accent) 55%, var(--accent2) 100%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-home {
      padding: 0.4rem 1rem; border-radius: 8px;
      text-decoration: none; font-size: 0.88rem; font-weight: 600;
      color: #94a3b8;
      border: 1px solid rgba(168,85,247,0.28);
      background: rgba(168,85,247,0.1);
      transition: color 0.2s;
    }
    .nav-home:hover { color: var(--accent); }

    /* Main content */
    main {
      position: relative; z-index: 1;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 100vh;
      padding: 5rem 2rem 2rem;
      text-align: center;
    }

    /* Animated check ring */
    .check-wrap {
      position: relative;
      width: 110px; height: 110px;
      margin-bottom: 2rem;
      animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }
    .check-wrap svg { width: 100%; height: 100%; }
    @keyframes popIn {
      from { transform: scale(0) rotate(-20deg); opacity: 0; }
      to   { transform: scale(1) rotate(0deg);  opacity: 1; }
    }

    /* Circle progress animation */
    .check-circle {
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
      animation: drawCircle 0.7s 0.1s ease forwards;
    }
    .check-tick {
      stroke-dasharray: 80;
      stroke-dashoffset: 80;
      animation: drawTick 0.45s 0.7s ease forwards;
    }
    @keyframes drawCircle { to { stroke-dashoffset: 0; } }
    @keyframes drawTick   { to { stroke-dashoffset: 0; } }

    /* Heading */
    h1 {
      font-size: clamp(1.8rem, 5vw, 3rem);
      font-weight: 900;
      background: linear-gradient(90deg, #fff 0%, var(--accent) 60%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.7rem;
      animation: fadeUp 0.6s 0.5s ease both;
    }

    /* Status pill */
    .status-pill {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 1.2rem;
      border-radius: 999px;
      background: rgba(34,197,94,0.15);
      border: 1px solid rgba(34,197,94,0.4);
      color: #4ade80;
      font-size: 0.9rem; font-weight: 700;
      margin-bottom: 1.5rem;
      animation: fadeUp 0.6s 0.6s ease both;
    }
    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80;
      animation: pulse 1.4s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

    /* Info card */
    .info-card {
      max-width: 520px;
      width: 100%;
      border-radius: 20px;
      background: rgba(15,10,30,0.8);
      border: 1px solid rgba(168,85,247,0.25);
      padding: 2rem 2.5rem;
      box-shadow: 0 8px 48px rgba(168,85,247,0.15);
      backdrop-filter: blur(10px);
      animation: fadeUp 0.6s 0.7s ease both;
    }

    .info-card p {
      font-size: 1rem;
      color: #94a3b8;
      line-height: 1.8;
    }
    .info-card p strong { color: #c4b5fd; }

    /* Steps */
    .steps {
      display: flex; flex-direction: column; gap: 0.9rem;
      margin-top: 1.5rem;
      text-align: left;
    }

    .step {
      display: flex; align-items: flex-start; gap: 0.9rem;
    }

    .step-num {
      flex-shrink: 0;
      width: 28px; height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 800; color: #fff;
    }

    .step-text {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.5;
      padding-top: 0.15rem;
    }
    .step-text strong { color: #e2e8f0; }

    /* Divider */
    .divider {
      width: 60px; height: 2px;
      margin: 1.5rem auto 0;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      opacity: 0.4;
    }

    /* Action buttons */
    .actions {
      display: flex; flex-wrap: wrap; gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      animation: fadeUp 0.6s 0.85s ease both;
    }

    .btn-dc {
      display: inline-flex; align-items: center; gap: 0.55rem;
      padding: 0.75rem 1.6rem;
      border-radius: 12px;
      background: #5865f2; color: #fff;
      font-weight: 700; font-size: 0.95rem;
      text-decoration: none;
      box-shadow: 0 4px 24px rgba(88,101,242,0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-dc:hover { transform: translateY(-3px); box-shadow: 0 8px 36px rgba(88,101,242,0.6); }

    .btn-back {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.75rem 1.6rem;
      border-radius: 12px;
      background: rgba(168,85,247,0.12);
      border: 1px solid rgba(168,85,247,0.3);
      color: var(--accent);
      font-weight: 700; font-size: 0.95rem;
      text-decoration: none;
      transition: transform 0.2s, background 0.2s;
    }
    .btn-back:hover {
      transform: translateY(-3px);
      background: rgba(168,85,247,0.2);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 999px; }
  </style>
</head>
<body>

  <div id="cursor-dot"></div>
  <div id="cursor-ring"></div>
  <canvas id="bg-canvas"></canvas>

  <!-- Navbar -->
  <nav class="navbar">
    <div class="nav-logo">Phantom X Core</div>
    <a href="index.html" class="nav-home">← Back to Home</a>
  </nav>

  <main>
    <!-- Animated check -->
    <div class="check-wrap">
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45"
          stroke="url(#cg)" stroke-width="4"
          stroke-linecap="round"
          class="check-circle" />
        <polyline points="30,52 44,66 70,36"
          stroke="url(#cg)" stroke-width="5"
          stroke-linecap="round" stroke-linejoin="round"
          class="check-tick" />
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#a855f7"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <h1>Order Received!</h1>

    <div class="status-pill">
      <span class="pulse-dot"></span>
      Payment Done — Awaiting Developer
    </div>

    <div class="info-card">
      <p>
        Thank you for your order! 🎉<br/>
        <strong>The developer will talk to you soon.</strong>
        Make sure to join our Discord server so we can reach you directly.
      </p>

      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Join Discord</strong> — click the button below &amp; verify in the server.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Open a ticket</strong> or DM the developer — mention your order.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Receive your cheat</strong> — after confirmation, the file will be delivered.</div>
        </div>
      </div>

      <div class="divider"></div>
    </div>

    <div class="actions">
      <a class="btn-dc" href="https://discord.gg/fDSMWMHGU" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        Open Discord Server
      </a>
      <a class="btn-back" href="index.html">← Go Back Home</a>
    </div>
  </main>

  <script>
    // Cursor
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; dot.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
    });

    // Particles
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COLORS = ['#a855f7','#6366f1','#818cf8','#c084fc','#7c3aed'];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10;
        this.r = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4; this.vy = -(Math.random() * 0.5 + 0.2);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.y < -10) this.reset(false);
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
      }
      draw() {
        ctx.save(); ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    function init() { particles = Array.from({ length: 100 }, () => new Particle()); }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); loop();
  </script>
</body>
</html>`;

fs.writeFileSync('thankyou.html', thankyouHtml, 'utf8');
console.log('thankyou.html written ✓');

// ── Read current index.html and patch it ──────────────────────────
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix avatar: replace src="avatar.jpg" with embedded base64
html = html.replace(/src="avatar\.jpg"/g, \`src="\${avatarB64}"\`);

// 2. Replace inline success screen logic with redirect to thankyou.html
const oldBlock = \`        try {
        const res = await fetch('http://localhost:3000/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, product }),
        });

        const data = await res.json();

        if (data.ok) {
          // Show success screen
          form.style.display    = 'none';
          successScreen.classList.add('show');

          // Auto-open Discord in new tab
          window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error(data.message || 'Server error');
        }

      } catch (err) {
        // If server not running, still show success & open Discord
        // (graceful fallback for offline / direct file open)
        form.style.display = 'none';
        successScreen.classList.add('show');
        window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
      }\`;

const newBlock = \`        try {
        const res = await fetch('http://localhost:3000/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, product }),
        });
        const data = await res.json();
        if (data.ok) {
          // Redirect to thank you page & open Discord
          window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
          window.location.href = 'thankyou.html';
        } else {
          throw new Error(data.message || 'Server error');
        }
      } catch (err) {
        // Fallback: redirect anyway & open Discord
        window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
        window.location.href = 'thankyou.html';
      }\`;

html = html.replace(oldBlock, newBlock);

// 3. Remove the inline success screen HTML from index.html (keep form only)
// (the success screen is now a separate page)
const successScreenStart = \`      <!-- Success screen (hidden until submitted) -->
      <div class="success-screen" id="successScreen" aria-live="polite">\`;
const successScreenEnd = \`      </div>

    </div>

  </section>\`;

const ssStartIdx = html.indexOf(successScreenStart);
const ssEndIdx   = html.indexOf(successScreenEnd, ssStartIdx);
if (ssStartIdx !== -1 && ssEndIdx !== -1) {
  html = html.slice(0, ssStartIdx) + \`\n    </div>\\n\\n  </section>\` + html.slice(ssEndIdx + successScreenEnd.length);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html patched ✓  (avatar embedded, redirect added, success screen removed)');
