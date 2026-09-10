import { redirect } from 'next/navigation';

/** The old combined page split into /terms and /privacy. Keep the link alive. */
export default function Legal(){ redirect('/terms'); }
