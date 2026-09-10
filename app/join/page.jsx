'use client';
import { useState } from 'react';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';
import { signInWithWallet, hasWalletConnect } from '../../lib/wallet';

/**
 * Sign up and sign in are the same action. Wallet first (the address is the identity and the
 * payout wallet), email link second for people who only want to play free.
 */
export default function Join() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');   // idle | wallet | sending | sent | error
  const [message, setMessage] = useState('');
  const ready = isSupabaseConfigured();
  const wc = hasWalletConnect();
  const next = () => { const n = new URLSearchParams(window.location.search).get('next'); return n && n.startsWith('/') && !n.startsWith('//') ? n : '/core'; };

  async function wallet(method) {
    if (!ready) { setState('error'); setMessage('Sign-in is not connected yet on this deployment.'); return; }
    setState('wallet'); setMessage('');
    try {
      const supabase = createClient();
      await signInWithWallet({ supabase, method, onStatus: setMessage });
      window.location.href = next();
    } catch (e) { setState('error'); setMessage(e.message); }
  }

  async function send() {
    if (!ready) { setState('error'); setMessage('Sign-in is not connected yet on this deployment.'); return; }
    if (!email.includes('@')) { setState('error'); setMessage('That does not look like an email address.'); return; }
    setState('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next())}` } });
    if (error) { setState('error'); setMessage(error.message); return; }
    setState('sent'); setMessage('Check your email. The link signs you in and creates your Core.');
  }

  const busy = state === 'wallet' || state === 'sending';
  return (
    <section className="section"><div className="wrap" style={{maxWidth:'44rem'}}>
      <div className="head">
        <h2>Enter FyreCore</h2>
        <p>One Core across every game. New here or coming back, it is the same door.</p>
      </div>

      <div className="hud" style={{padding:'1.6rem'}}>
        <div style={{display:'grid', gridTemplateColumns: wc ? '1fr 1fr' : '1fr', gap:'.6rem'}}>
          <button onClick={() => wallet('injected')} disabled={busy} className="btn btn--heat" style={{justifyContent:'center',cursor:busy?'default':'pointer',border:'none'}}>
            {state==='wallet' ? 'Check your wallet…' : 'Continue with wallet'}
          </button>
          {wc && <button onClick={() => wallet('walletconnect')} disabled={busy} className="btn btn--ghost" style={{justifyContent:'center',cursor:busy?'default':'pointer'}}>Phone wallet (WalletConnect)</button>}
        </div>
        <small style={{display:'block',color:'var(--steel)',fontSize:'.78rem',marginTop:'.6rem'}}>Any Base-compatible wallet: MetaMask, Rabby, Rainbow, Trust, or the app on your phone. One free signature, no transaction. Prizes are paid to this wallet.</small>
        {state==='wallet' && message && <p style={{margin:'.9rem 0 0',fontSize:'.85rem',color:'var(--forge)'}}>{message}</p>}

        <div style={{display:'flex',alignItems:'center',gap:'.8rem',margin:'1.4rem 0 1rem',color:'var(--steel)',fontSize:'.78rem'}}>
          <span style={{flex:1,height:1,background:'var(--edge)'}} />or an email link<span style={{flex:1,height:1,background:'var(--edge)'}} />
        </div>
        <label htmlFor="email" style={{display:'block',fontSize:'.82rem',fontWeight:700,color:'var(--steel)',marginBottom:'.5rem',position:'relative',zIndex:2}}>Email address</label>
        <input id="email" type="email" value={email} autoComplete="email"
          onChange={(e)=>{setEmail(e.target.value); if(state==='error'||state==='wallet') setState('idle');}}
          onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} disabled={state==='sending'||state==='sent'}
          style={{position:'relative',zIndex:2,width:'100%',padding:'.8rem 1rem',background:'#0D0C13',border:'1px solid var(--edge)',color:'var(--bone)',font:'inherit',fontSize:'.95rem'}} />
        <button onClick={send} disabled={state==='sending'||state==='sent'} className="btn btn--ghost" style={{position:'relative',zIndex:2,marginTop:'1rem',width:'100%',justifyContent:'center',cursor:state==='sending'?'default':'pointer'}}>
          {state==='sending' ? 'Sending the link' : state==='sent' ? 'Link sent' : 'Send me a sign-in link'}
        </button>
        {message && state!=='wallet' && <p style={{marginTop:'1rem',marginBottom:0,fontSize:'.82rem',color: state==='error' ? 'var(--magma)' : 'var(--jade)'}}>{message}</p>}
      </div>

      {!ready && <div className="note note--warn" style={{marginTop:'1.5rem'}}><p>Sign-in is not wired up on this deployment yet.</p></div>}
      <div className="note" style={{marginTop:'2rem'}}>
        <p>Creating a Core costs nothing and commits you to nothing. You can add an email to a wallet account, or a wallet to an email account, any time from your settings.</p>
      </div>
    </div></section>
  );
}
