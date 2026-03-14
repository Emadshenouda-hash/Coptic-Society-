import type { Metadata } from 'next';
import { NewsClient } from './news-client';

export const metadata: Metadata = {
  title: 'News & Updates',
  description:
    'Stay up-to-date with the latest news, events, and announcements from the Grand Coptic Benevolent Society.',
  alternates: {
    canonical: 'https://www.coptic-society.org/news',
  },
};

export default function NewsPage() {
  return <NewsClient />;
}
