import type { Metadata } from 'next';
import { HomeClient } from './home-client';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'The Grand Coptic Benevolent Society — a charitable, non-profit organisation founded in 1881 serving needy families and promoting social justice across Egypt.',
  alternates: {
    canonical: 'https://www.coptic-society.org',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
