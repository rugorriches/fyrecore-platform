'use client';
import { useEffect, useState } from 'react';

export default function Verify() {
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => { fetch('/api/verify/status').then(r => r.json()).then(setState); }, []);

  async function start() {
    setState({ status: 'starting' });
    const r = await fetch('/api/verify/start', { method: 'POST' });
    const d = await r.json();
    if (d.url) window.location.href = d.url;
    else setState({ status: d.status ?? 'error', error: d.error });
  }

  const copy = {
    none:      ['Verify once', 'Paid brackets, random boxes and high-value purchases need an age and identity check. It takes about two minutes and is done once per account.'],
    pending:   ['In progress', 'Your verification is being processed. This usually completes within a few minutes; refresh to check.'],
    in_review: ['Under review', 'Your documents are being reviewed manually. You will be emailed when it is done.'],
    approved:  ['Verified', 'Your account is verified. Every feature that needs it is now open to you where your region allows.'],
    declined:  ['Not approved', 'The check did not pass. You can try again with a different document, or contact support.'],
    expired:   ['Expired', 'The session timed out before completion. Start again when you have a few minutes.'],
    abandoned: ['Not completed', 'The session was closed before finishing. Start again when ready.'],
    error:     ['Something went wrong', state.error ?? 'Try again in a moment.'],
    loading:   ['Checking', ''], starting: ['Opening', 'Sending you to the verification provider.']
  };
  const [title, body] = copy[state.status] ?? copy.none;
  const canStart = ['none','declined','expired','abandoned','error'].includes(state.status);

  return (
    <section className="section"><div className="wrap" style={{maxWidth:'44rem'}}>
      <div className="head"><span className="eyebrow">Identity</span><h2>{title}</h2><p>{body}</p></div>
      {canStart && <button onClick={start} className="btn btn--heat" style={{cursor:'pointer',border:'none'}}>Start verification</button>}
      <div className="note" style={{marginTop:'2rem'}}>
        <p>We store only the outcome, the date, the country on the document, and a session reference. Documents and photos stay with the verification provider and never reach our servers. Free play, campaign modes and cosmetics you already own never require this.</p>
      </div>
    </div></section>
  );
}