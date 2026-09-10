'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide ember layer: a quiet version of the Forge behind every page (fixed, non-interactive, ~70 embers).
 * The home page has the full Forge, so it is skipped there. Reduced motion renders a still frame.
 */
export default function Embers() {
  const ref = useRef(null);
  const path = usePathname();
  const off = path === '/';

  useEffect(() => {
    if (off) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = window.innerWidth < 720 ? 40 : 70;
    let w, h, raf, t = 0; const P = [];
    const spawn = (p, fresh) => { p.x = Math.random() * w; p.y = fresh ? Math.random() * h : h + 10; p.r = 0.5 + Math.random() * 1.6; p.vy = 0.12 + Math.random() * 0.35;
      p.vx = (Math.random() - 0.5) * 0.12; p.life = 0; p.ttl = 700 + Math.random() * 700; p.hue = 18 + Math.random() * 26; p.f = Math.random() * 6.28; return p; };
    const resize = () => { const d = Math.min(2, window.devicePixelRatio || 1); w = window.innerWidth; h = window.innerHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); for (let i = 0; i < N; i++) P.push(spawn({}, true));
    const frame = () => {
      t++; ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      for (const p of P) {
        if (!still) { p.life++; p.x += p.vx + Math.sin((t + p.f * 60) * 0.015) * 0.1; p.y -= p.vy; if (p.y < -10 || p.life > p.ttl) spawn(p, false); }
        const a = Math.min(1, p.life / 60) * (1 - p.life / p.ttl) * (0.35 + 0.3 * Math.sin(t * 0.07 + p.f));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,72%,${a})`); g.addColorStop(0.4, `hsla(${p.hue},100%,52%,${a * 0.35})`); g.addColorStop(1, 'hsla(20,100%,40%,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!still) raf = requestAnimationFrame(frame);
    };
    frame(); window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [off]);

  if (off) return null;
  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
