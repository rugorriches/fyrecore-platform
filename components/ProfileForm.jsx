'use client';
import { useState } from 'react';

const inp = { width:'100%', padding:'.7rem .9rem', background:'#0D0C13', border:'1px solid var(--edge)', color:'var(--bone)', font:'inherit', fontSize:'.95rem' };
const lab = { display:'block', fontSize:'.8rem', fontWeight:700, color:'var(--steel)', margin:'1rem 0 .4rem' };

export default function ProfileForm({ initial }) {
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function save() {
    setBusy(true); setMsg(null);
    const r = await fetch('/api/profile', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const d = await r.json();
    setBusy(false); setMsg(r.ok ? 'Saved.' : d.error ?? 'Could not save');
    if (r.ok) window.location.reload();
  }

  return (
    <div className="hud" style={{padding:'1.4rem'}}>
      <label style={{...lab, marginTop:0}}>Handle</label>
      <input style={inp} value={f.handle} onChange={set('handle')} maxLength={20} placeholder="lowercase, digits, underscore" />
      <label style={lab}>Display name</label>
      <input style={inp} value={f.display_name} onChange={set('display_name')} maxLength={32} />
      <label style={lab}>Bio</label>
      <textarea style={{...inp, minHeight:'5rem'}} value={f.bio} onChange={set('bio')} maxLength={280} />
      <label style={lab}>Region</label>
      <input style={inp} value={f.region} onChange={set('region')} maxLength={40} placeholder="e.g. US East, EU West" />
      <label style={{...lab, display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer'}}><input type="checkbox" checked={f.public_profile} onChange={set('public_profile')} /> Public profile (rating, mastery and cosmetics visible to others)</label>
      <button className="btn btn--heat" onClick={save} disabled={busy} style={{marginTop:'1.2rem', border:'none', cursor:busy?'default':'pointer'}}>{busy ? 'Saving…' : 'Save profile'}</button>
      {msg && <small className="buy__status" style={{display:'block', marginTop:'.6rem'}}>{msg}</small>}
    </div>
  );
}
