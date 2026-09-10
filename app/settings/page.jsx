import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import ProfileForm from '../../components/ProfileForm';
import LinkWallet from '../../components/LinkWallet';
import AccountActions from '../../components/AccountActions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Settings' };

/** Account settings: who you are, how you sign in, where you get paid, and what has happened on the account. */
export default async function Settings() {
  if (!isSupabaseConfigured()) redirect('/join');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/join');

  const [{ data: profile }, { data: events }] = await Promise.all([
    supabase.from('profiles').select('handle, display_name, bio, region, public_profile, wallet_address, founder_tier, created_at').eq('id', user.id).single(),
    supabase.from('auth_events').select('event, method, ip, user_agent, created_at').order('created_at', { ascending: false }).limit(15)
  ]);
  const hasEmail = !!user.email;
  const hasWallet = (user.identities ?? []).some(i => i.provider === 'web3');

  return (
    <section className="section"><div className="wrap" style={{maxWidth:'48rem'}}>
      <div className="head"><span className="eyebrow">Settings</span><h2>Your account</h2>
        <p>Member since {new Date(profile?.created_at ?? user.created_at).toLocaleDateString()}. <Link href="/core">Back to your Core</Link>{profile?.handle ? <> · <Link href={`/u/${profile.handle}`}>public profile</Link></> : null}</p></div>

      <div className="head" style={{marginTop:'2.5rem'}}><h2 style={{fontSize:'var(--s2)'}}>Profile</h2>
        <p>Your handle is how other players find you. Everything here except the handle is optional.</p></div>
      <div className="acct">
      <ProfileForm initial={{ handle: profile?.handle ?? '', display_name: profile?.display_name ?? '', bio: profile?.bio ?? '', region: profile?.region ?? '', public_profile: profile?.public_profile ?? true }} />

      </div>
<div className="head" style={{marginTop:'3rem'}}><h2 style={{fontSize:'var(--s2)'}}>Sign-in methods</h2>
        <p>Either method signs you into the same Core. Add the other so you are never locked out.</p></div>
      <div className="acct">
      <ul className="chips">
        <li>Email: {hasEmail ? user.email : 'not linked'}</li>
        <li>Wallet sign-in: {hasWallet ? 'linked' : 'not linked'}</li>
      </ul>
      <AccountActions hasEmail={hasEmail} hasWallet={hasWallet} />

      </div>
<div className="head" style={{marginTop:'3rem'}}><h2 style={{fontSize:'var(--s2)'}}>Payout wallet</h2>
        <p>Prize money, marketplace sales and Vault redemptions are paid here. Linking is a signature, not a transaction.</p></div>
      <div className="acct">
      <LinkWallet current={profile?.wallet_address ?? null} />

      </div>
<div className="head" style={{marginTop:'3rem'}}><h2 style={{fontSize:'var(--s2)'}}>Recent activity</h2></div>
      <div className="acct">
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>When</th><th>Event</th><th>Method</th><th>From</th></tr></thead>
        <tbody>{(events ?? []).map((e, i) => (
          <tr key={i}><td>{new Date(e.created_at).toLocaleString()}</td><td>{e.event.replace('_', ' ')}</td><td>{e.method ?? '--'}</td><td style={{fontFamily:'monospace',fontSize:'.8rem'}}>{e.ip ?? '--'}</td></tr>
        ))}{!(events ?? []).length && <tr><td colSpan={4} style={{color:'var(--steel)'}}>Nothing yet.</td></tr>}</tbody>
      </table></div>
</div>
    </div></section>
  );
}
