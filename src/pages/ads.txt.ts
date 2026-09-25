import type { APIRoute } from 'astro';
import { site } from '../site.config';

/** ads.txt authorizes Google to sell ads on this domain. Generated from site.config.ts. */
export const GET: APIRoute = () => {
  const pub = site.adsense.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Set adsense.client in src/site.config.ts to publish your AdSense ads.txt record.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
