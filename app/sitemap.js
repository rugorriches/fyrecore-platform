const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';

export default function sitemap(){
  const routes = ['','/games','/platform','/arena','/token','/ledger','/founders-pass','/faq','/roadmap','/dev-log','/legal','/join'];
  return routes.map(route => ({
    url: site + route,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7
  }));
}