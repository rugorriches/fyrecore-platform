'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural 200-mesh chest. One rig, ten tiers by colour.
 * Phases: 'idle' | 'charge' | 'crack' | 'open'
 *  - 8 body plates, 12 corner reinforcements, 48 lid panels (8x6) on a hinge, 24 rivets,
 *    6 seam emitters, 3 interior lattice rings, plinth = ~102 meshes + 48 hinge groups.
 * Colours from box_defs.color / glow. Everything else is derived.
 */
export default function Box3D({ color = '#FF4423', glow = 'rgba(255,68,35,.8)', phase = 'idle', charge = 0, height = 360 }) {
  const mount = useRef(null);
  const state = useRef({});

  useEffect(() => {
    const el = mount.current; if (!el) return;
    const W = el.clientWidth, H = height;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    cam.position.set(0, 2.6, 6.2); cam.lookAt(0, 0.6, 0);
    const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setPixelRatio(Math.min(2, window.devicePixelRatio)); ren.setSize(W, H);
    ren.toneMapping = THREE.ACESFilmicToneMapping; ren.toneMappingExposure = 1.05;
    el.appendChild(ren.domElement);

    const tint = new THREE.Color(color);
    const iron = new THREE.MeshStandardMaterial({ color: 0x2a2734, metalness: 0.85, roughness: 0.38 });
    const trim = new THREE.MeshStandardMaterial({ color: tint.clone().multiplyScalar(0.55), metalness: 0.9, roughness: 0.3 });
    const emis = new THREE.MeshStandardMaterial({ color: 0x0a0910, emissive: tint, emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.6 });
    const glass = new THREE.MeshPhysicalMaterial({ color: tint, transmission: 0.35, thickness: 0.4, roughness: 0.15, metalness: 0.1, emissive: tint, emissiveIntensity: 0.25 });

    const root = new THREE.Group(); scene.add(root);
    const bw = 2.2, bd = 1.5, bh = 1.15;

    // plinth
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.3, 0.22, 48), new THREE.MeshStandardMaterial({ color: 0x151320, roughness: 0.9 }));
    plinth.position.y = -0.11; root.add(plinth);

    // 8 body plates (4 sides x 2 rows)
    const plateGeo = new THREE.BoxGeometry(1, 1, 0.08);
    const sides = [[0, bd / 2, 0, bw], [0, -bd / 2, Math.PI, bw], [bw / 2, 0, Math.PI / 2, bd], [-bw / 2, 0, -Math.PI / 2, bd]];
    sides.forEach(([x, z, ry, len]) => { for (let row = 0; row < 2; row++) {
      const m = new THREE.Mesh(plateGeo, iron); m.scale.set(len * 0.96, bh / 2 * 0.94, 1);
      m.position.set(x, bh / 4 + row * bh / 2, z); m.rotation.y = ry; root.add(m);
    }});
    // 12 corner reinforcements
    const cornerGeo = new THREE.BoxGeometry(0.14, bh + 0.06, 0.14);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
      for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(cornerGeo, trim); c.position.set(sx * bw / 2, bh / 2, sz * bd / 2); c.scale.set(1 + k * 0.15, 1 - k * 0.3, 1 + k * 0.15); root.add(c); }
    });
    // 24 rivets
    const rivetGeo = new THREE.SphereGeometry(0.045, 10, 10);
    for (let n = 0; n < 24; n++) {
      const side = n % 4, t = ((n >> 2) + 0.5) / 6; const [x, z, ry, len] = sides[side];
      const rv = new THREE.Mesh(rivetGeo, trim);
      const off = (t - 0.5) * len * 0.9; const c = Math.cos(ry), s = Math.sin(ry);
      rv.position.set(x + off * c, bh * 0.5, z - off * s); root.add(rv);
    }
    // 6 seam emitters
    const seamGeo = new THREE.BoxGeometry(1, 0.035, 0.09);
    const seams = [];
    sides.forEach(([x, z, ry, len]) => { const sm = new THREE.Mesh(seamGeo, emis); sm.scale.x = len * 0.98; sm.position.set(x, bh + 0.02, z); sm.rotation.y = ry; root.add(sm); seams.push(sm); });
    [[bw * 0.25, 0], [-bw * 0.25, 0]].forEach(([x, z]) => { const sm = new THREE.Mesh(seamGeo, emis); sm.scale.x = bd * 0.98; sm.position.set(x, bh + 0.02, z); sm.rotation.y = Math.PI / 2; root.add(sm); seams.push(sm); });
    // interior lattice + glow core
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 2), glass); core.position.y = bh * 0.55; root.add(core);
    const rings = [];
    for (let k = 0; k < 3; k++) { const rg = new THREE.Mesh(new THREE.TorusGeometry(0.45 + k * 0.18, 0.02, 8, 48), emis); rg.position.y = bh * 0.55; rg.rotation.x = Math.PI / 2 + k * 0.5; rg.rotation.z = k * 0.7; root.add(rg); rings.push(rg); }
    const coreLight = new THREE.PointLight(tint, 0, 6); coreLight.position.y = bh * 0.6; root.add(coreLight);

    // 48 lid panels, 8 x 6, each on its own hinge group at the lid's back edge
    const lid = new THREE.Group(); lid.position.set(0, bh, 0); root.add(lid);
    const panels = [];
    const px = bw / 8, pz = bd / 6;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) {
      const hinge = new THREE.Group();
      hinge.position.set(-bw / 2 + i * px + px / 2, 0, -bd / 2);
      const p = new THREE.Mesh(new THREE.BoxGeometry(px * 0.93, 0.07, pz * 0.93), (i + j) % 5 === 0 ? trim : iron);
      p.position.set(0, 0.035, j * pz + pz / 2);
      hinge.add(p); lid.add(hinge);
      panels.push({ hinge, delay: (j * 0.06) + (Math.abs(i - 3.5) * 0.025) });
    }

    // lights
    scene.add(new THREE.HemisphereLight(0xb8c4ff, 0x120e18, 0.55));
    const key = new THREE.DirectionalLight(0xfff0dc, 1.4); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(tint, 0.9); rim.position.set(-4, 2, -3); scene.add(rim);

    state.current = { scene, cam, ren, root, seams, rings, core, coreLight, panels, emis, t0: performance.now(), crackAt: null };
    let raf;
    const loop = () => {
      const st = state.current; const t = (performance.now() - st.t0) / 1000;
      const ph = st.phase ?? 'idle', ch = st.charge ?? 0;
      root.position.y = Math.sin(t * 1.3) * 0.03; root.rotation.y = Math.sin(t * 0.35) * 0.12;
      const glowI = ph === 'idle' ? 0.6 + Math.sin(t * 2) * 0.15 : ph === 'charge' ? 0.6 + ch * 2.4 : 3.2;
      emis.emissiveIntensity = glowI; coreLight.intensity = ph === 'idle' ? 0.4 : ph === 'charge' ? 0.4 + ch * 3 : 5;
      rings.forEach((rg, k) => { rg.rotation.z += 0.004 * (k + 1) * (ph === 'charge' ? 1 + ch * 4 : 1); });
      core.rotation.y += 0.01; core.scale.setScalar(1 + (ph === 'charge' ? ch * 0.35 : ph === 'open' ? 0.5 : 0) + Math.sin(t * 3) * 0.03);
      if (ph === 'charge') root.position.x = (Math.random() - 0.5) * ch * 0.03;
      if ((ph === 'crack' || ph === 'open') && st.crackAt == null) st.crackAt = t;
      if (st.crackAt != null) {
        const e = t - st.crackAt;
        panels.forEach(pn => { const k = Math.min(1, Math.max(0, (e - pn.delay) / 0.45)); const ease = 1 - Math.pow(1 - k, 3); pn.hinge.rotation.x = -ease * 1.9; });
      } else panels.forEach(pn => pn.hinge.rotation.x = 0);
      ren.render(scene, cam); raf = requestAnimationFrame(loop);
    };
    loop();
    const onResize = () => { const w = el.clientWidth; cam.aspect = w / H; cam.updateProjectionMatrix(); ren.setSize(w, H); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); ren.dispose(); el.removeChild(ren.domElement); };
  }, [color, height]);

  useEffect(() => { state.current.phase = phase; state.current.charge = charge; if (phase === 'idle') state.current.crackAt = null; }, [phase, charge]);

  return <div ref={mount} style={{ width: '100%', height, filter: `drop-shadow(0 0 40px ${glow})` }} />;
}