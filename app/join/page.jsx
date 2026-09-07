'use client';
import { useState } from 'react';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';

export default function Join() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  const ready = isSupabaseConfigured();

  async function send() {
    if (!ready) { setState('error'); setMessage('Sign-in is not connected yet on this deployment.'); return; }
    if (!email.includes('@')) { setState('error'); setMessage('That does not look like an email address.'); return; }
    setState('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) { setState('error'); setMessage(error.message); return; }
    setState('sent');
    setMessage('Check your email. The link signs you in and creates your Core.');
  }

  return (
    <section className="section"><div className="wrap" style={{maxWidth:'44rem'}}>
      <div className="head">
        <h2>Create your Core</h2>
        <p>One identity across every FyreCore game. An email address is all it takes &mdash; a wallet is created for you and you will never see a seed phrase.</p>
      </div>

      <div className="hud" style={{padding:'1.6rem'}}>
        <label htmlFor="email" style={{display:'block',fontSize:'.82rem',fontWeight:700,color:'var(--steel)',marginBottom:'.5rem',position:'relative'}}>Email address</label>
        <input
          id="email" type="email" value={email} autoComplete="email"
          onChange={(e)=>{setEmail(e.target.value); if(state==='error') setState('idle');}}
          onKeyDown={(e)=>{ if(e.key==='Enter') send(); }}
          disabled={state==='sending'||state==='sent'}
          style={{position:'relative',width:'100%',padding:'.8rem 1rem',background:'#0D0C13',
                  border:'1px solid var(--edge)',color:'var(--bone)',font:'inherit',fontSize:'.95rem'}}
        />
        <button onClick={send} disabled={state==='sending'||state==='sent'}
                className="btn btn--heat" style={{marginTop:'1rem',width:'100%',justifyContent:'center',cursor:'pointer',border:'none'}}>
          {state==='sending' ? 'Sending the link' : state==='sent' ? 'Link sent' : 'Send me a sign-in link'}
        </button>
        {message && (
          <p style={{marginTop:'1rem',marginBottom:0,fontSize:'.82rem',position:'relative',
                     color: state==='error' ? 'var(--magma)' : 'var(--jade)'}}>{message}</p>
        )}
      </div>

      {!ready && (
        <div className="note note--warn" style={{marginTop:'1.5rem'}}>
          <p>Sign-in is not wired up on this deployment yet. Everything else on the site works; creating a Core comes online once the environment variables are set.</p>
        </div>
      )}

      <div className="note" style={{marginTop:'2rem'}}>
        <p>Creating a Core costs nothing and commits you to nothing. There is no token to buy, and there will not be one until the first game has proven it deserves one.</p>
      </div>
    </div></section>
  );
}