import { MetadataRoute } from 'next';

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/about',
    '/programs',
    '/governance',
    '/membership',
    '/bylaws',
    '/contact',
    '/donate',
  ];

  return staticPages.map((path) => ({
    url: `${VERCEL_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
