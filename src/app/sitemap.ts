import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.coptic-society.org';

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
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
