import type { Metadata } from 'next';
import { MembershipClient } from './membership-client';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Join the Grand Coptic Benevolent Society. Learn about membership eligibility, rights, obligations, and how to apply to become part of our century-long legacy of service.',
  alternates: {
    canonical: 'https://www.coptic-society.org/membership',
  },
};

export default function MembershipPage() {
  return <MembershipClient />;
}
