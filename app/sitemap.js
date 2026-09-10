const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';

export default function sitemap(){
  const routes = ['','/games','/omen','/nfts','/platform','/arena','/economy','/ledger','/vip-pass','/dev','/faq','/roadmap','/dev-log','/legal','/join'];
  return routes.map(route => ({
    url: site + route,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7
  }));
}