import type { Metadata } from 'next';
import { DonateClient } from './donate-client';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support the Grand Coptic Benevolent Society. Your donation funds social assistance, healthcare, education, and community development programs across Egypt.',
  alternates: {
    canonical: 'https://www.coptic-society.org/donate',
  },
};

export default function DonatePage() {
  return <DonateClient />;
}
