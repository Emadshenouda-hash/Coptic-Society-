import type { Metadata } from 'next';
import { ProgramsClient } from './programs-client';

export const metadata: Metadata = {
  title: 'Our Programs',
  description:
    'Explore the diverse programs of the Grand Coptic Benevolent Society — social assistance, healthcare, education, elderly care, child protection, and community development.',
  alternates: {
    canonical: 'https://www.coptic-society.org/programs',
  },
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
