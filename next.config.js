/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    // /token predates the decision to drop the token. Keep old links working.
    return [{ source: '/token', destination: '/economy', permanent: true }];
  }
};