import type { Metadata } from 'next';
import { AboutClient } from './about-client';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about the history, mission, and vision of the Grand Coptic Benevolent Society — a charitable organisation founded in Cairo in 1881 to serve needy families.',
  alternates: {
    canonical: 'https://www.coptic-society.org/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
