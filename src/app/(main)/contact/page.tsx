import type { Metadata } from 'next';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Grand Coptic Benevolent Society at 175 Ramsis Street, Cairo. Call +20 2 591 2234 or send us a message through our contact form.',
  alternates: {
    canonical: 'https://www.coptic-society.org/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
