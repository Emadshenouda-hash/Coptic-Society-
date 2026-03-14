import type { Metadata } from 'next';
import { GovernanceClient } from './governance-client';

export const metadata: Metadata = {
  title: 'Governance',
  description:
    'Learn about the governance structure of the Grand Coptic Benevolent Society, including the General Assembly, Board of Directors, and organizational committees.',
  alternates: {
    canonical: 'https://www.coptic-society.org/governance',
  },
};

export default function GovernancePage() {
  return <GovernanceClient />;
}
