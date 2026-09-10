import './globals.css';
import { Anton, Barlow } from 'next/font/google';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Embers from '../components/Embers';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });
const barlow = Barlow({ weight: ['400','500','600','700'], subsets: ['latin'], variable: '--font-body', display: 'swap' });

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';

export const metadata = {
  metadataBase: new URL(site),
  title: { default: 'FyreCore - competition-backed game platform', template: '%s - FyreCore' },
  description: 'FyreCore builds its own competitive games on an economy with no reward emissions. Every payout comes from an entry fee, a sale, or a marketplace cut.',
  openGraph: {
    title: 'FyreCore - competition-backed game platform',
    description: 'Prize pools you can trace to a person. No emissions, no presale, a redeemable floor under every item.',
    type: 'website'
  },
  robots: { index: true, follow: true }
};

export const viewport = { themeColor: '#12111A' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        <Embers />
        <a href="#main" className="skip">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}