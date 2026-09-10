'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * The Forge. One full-viewport moment: an ember field that breathes on its own and leans toward the cursor,
 * the wordmark forged in once on load, two actions. Reduced-motion users get a still frame.
 */
export default function Forge() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 720;
    const N = still ? 90 : mobile ? 120 : 260;
    let w, h, dpr, raf, t = 0;
    const m = { x: -1e4, y: -1e4, on: false };
    const P = [];

    const spawn = (p, fresh) => {
      p.x = Math.random() * w; p.y = fresh ? Math.random() * h : h + 10 + Math.random() * 40;
      p.r = 0.6 + Math.random() * 2.2; p.vy = 0.25 + Math.random() * 0.9; p.vx = (Math.random() - 0.5) * 0.25;
      p.life = 0; p.ttl = 400 + Math.random() * 500; p.hue = 18 + Math.random() * 26; p.flick = Math.random() * 6.28;
      return p;
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); for (let i = 0; i < N; i++) P.push(spawn({}, true));

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of P) {
        p.life++;
        if (!still) {
          const dx = m.x - p.x, dy = m.y - p.y, d2 = dx * dx + dy * dy;
          if (m.on && d2 < 48400) {                       // within 220px: lean toward the cursor, scatter when very close
            const d = Math.sqrt(d2) + 0.01, f = d < 70 ? -0.9 : 0.045;
            p.vx += (dx / d) * f * 0.6; p.vy += (dy / d) * f * 0.6;
          }
          p.vx *= 0.96; p.vy = p.vy * 0.985 - 0.003;
          p.x += p.vx + Math.sin((t + p.flick * 60) * 0.02) * 0.15; p.y += p.vy < 0 ? p.vy : -p.vy;
          if (p.y < -12 || p.life > p.ttl || p.x < -20 || p.x > w + 20) spawn(p, false);
        }
        const a = Math.min(1, p.life / 40) * (1 - p.life / p.ttl) * (0.55 + 0.45 * Math.sin(t * 0.09 + p.flick));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,72%,${a})`); g.addColorStop(0.35, `hsla(${p.hue},100%,52%,${a * 0.45})`); g.addColorStop(1, 'hsla(20,100%,40%,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!still) raf = requestAnimationFrame(frame);
    };
    frame();
    const move = (e) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.on = true; };
    const leave = () => { m.on = false; };
    window.addEventListener('resize', resize); c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); };
  }, []);

  return (
    <section className="forge" aria-label="FyreCore">
      <canvas ref={ref} className="forge__embers" aria-hidden="true" />
      <div className="forge__glow" aria-hidden="true" />
      <div className="forge__in">
        <h1 className="forge__mark"><span>FYRE</span><span>CORE</span></h1>
        <p className="forge__line">Games worth competing in. Prizes paid in USDC.</p>
        <div className="forge__acts">
          <Link href="/join" className="btn btn--heat forge__cta">Enter</Link>
          <Link href="/games" className="btn btn--ghost">See the games</Link>
        </div>
      </div>
      <a href="#games" className="forge__down" aria-label="Scroll"><span /></a>
    </section>
  );
}
