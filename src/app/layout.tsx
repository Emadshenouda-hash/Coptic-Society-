import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Grand Coptic Benevolent Society | الجمعية القبطية الخيرية الكبرى',
  description:
    'The Grand Coptic Benevolent Society is a charitable, non-profit organisation founded in 1881 to serve needy families and promote social justice and dignity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head />
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
