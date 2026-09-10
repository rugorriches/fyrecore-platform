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

  async function google() {
    if (!ready) { setState('error'); setMessage('Sign-in is not connected yet on this deployment.'); return; }
    setState('google');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { prompt: 'select_account' } }
    });
    if (error) { setState('error'); setMessage(error.message); }
  }

  return (
    <section className="section"><div className="wrap" style={{maxWidth:'44rem'}}>
      <div className="head">
        <h2>Create your Core</h2>
        <p>One identity across every FyreCore game. Sign in with Google or an email link; nothing to install and no wallet needed to play. Connect a wallet you control later, only when money is involved.</p>
      </div>

      <div className="hud" style={{padding:'1.6rem'}}>
        <button onClick={google} disabled={state==='google'||state==='sent'}
                className="btn btn--heat" style={{width:'100%',justifyContent:'center',cursor:'pointer',border:'none',gap:'.6rem'}}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
          {state==='google' ? 'Opening Google…' : 'Continue with Google'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'.8rem',margin:'1.2rem 0',color:'var(--steel)',fontSize:'.78rem'}}>
          <span style={{flex:1,height:1,background:'var(--edge)'}} />or use an email link<span style={{flex:1,height:1,background:'var(--edge)'}} />
        </div>
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
                className="btn btn--ghost" style={{marginTop:'1rem',width:'100%',justifyContent:'center',cursor:'pointer'}}>
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