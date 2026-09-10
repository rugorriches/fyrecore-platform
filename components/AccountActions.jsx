'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

/** Add the other sign-in method, and sign out (this device or everywhere). */
export default function AccountActions({ hasEmail, hasWallet }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);

  async function addEmail() {
    if (!email.includes('@')) { setMsg('That does not look like an email address.'); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${window.location.origin}/auth/callback` });
    setMsg(error ? error.message : 'Check that inbox — the link confirms the address and adds email sign-in to this Core.');
  }
  async function signOut(scope) {
    await fetch(`/api/auth/signout?scope=${scope}`, { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="hud" style={{padding:'1.4rem', marginTop:'1rem'}}>
      {!hasEmail && (<>
        <label style={{display:'block', fontSize:'.8rem', fontWeight:700, color:'var(--steel)', marginBottom:'.4rem'}}>Add an email to this Core</label>
        <div style={{display:'flex', gap:'.6rem'}}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{flex:1, padding:'.7rem .9rem', background:'#0D0C13', border:'1px solid var(--edge)', color:'var(--bone)', font:'inherit'}} />
          <button className="btn btn--ghost" onClick={addEmail} style={{cursor:'pointer'}}>Send link</button>
        </div>
      </>)}
      {!hasWallet && <p style={{color:'var(--steel)', fontSize:'.85rem', margin: hasEmail ? 0 : '1rem 0 0'}}>Link your payout wallet below and you can sign in with it too — the wallet signs one message and lands in this same Core.</p>}
      <div style={{display:'flex', gap:'.6rem', marginTop:'1.2rem', flexWrap:'wrap'}}>
        <button className="btn btn--ghost" onClick={() => signOut('local')} style={{cursor:'pointer'}}>Sign out</button>
        <button className="btn btn--ghost" onClick={() => signOut('global')} style={{cursor:'pointer'}}>Sign out everywhere</button>
      </div>
      {msg && <small className="buy__status" style={{display:'block', marginTop:'.6rem'}}>{msg}</small>}
    </div>
  );
}
