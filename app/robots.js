const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';

export default function robots(){
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/core', '/auth/'] }],
    sitemap: `${site}/sitemap.xml`
  };
}