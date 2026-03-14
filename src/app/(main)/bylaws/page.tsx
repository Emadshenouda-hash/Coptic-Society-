import type { Metadata } from 'next';
import { BylawsPageClient } from './bylaws-client-page';

export const metadata: Metadata = {
  title: 'Bylaws',
  description:
    'Review the official bylaws of the Grand Coptic Benevolent Society or use our AI-powered tool to generate a concise summary of the document.',
  alternates: {
    canonical: 'https://www.coptic-society.org/bylaws',
  },
};

export default function BylawsPage() {
  return <BylawsPageClient />;
}
