import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: {
    default: 'Grand Coptic Benevolent Society | الجمعية القبطية الخيرية الكبرى',
    template: `%s | Grand Coptic Benevolent Society`,
  },
  description:
    'The Grand Coptic Benevolent Society is a charitable, non-profit organisation founded in 1881 to serve needy families and promote social justice and dignity.',
  openGraph: {
    title: 'Grand Coptic Benevolent Society',
    description: 'Serving Egypt since 1881. A charitable, non-profit organisation dedicated to social justice.',
    url: VERCEL_URL,
    siteName: 'Grand Coptic Benevolent Society',
    images: [
      {
        url: '/og-image.jpg', // Path to your OG image in the `public` folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grand Coptic Benevolent Society',
    description: 'Serving Egypt since 1881. A charitable, non-profit organisation dedicated to social justice.',
    // images: ['/twitter-image.jpg'], // Path to your Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    // shortcut: '/favicon-16x16.png',
    // apple: '/apple-touch-icon.png',
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Grand Coptic Benevolent Society",
  "alternateName": "الجمعية القبطية الخيرية الكبرى",
  "url": VERCEL_URL,
  "logo": `${VERCEL_URL}/assets/gcbs-historic-building.jpg`,
  "foundingDate": "1881",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "175 Ramsis Street",
    "addressLocality": "Cairo",
    "addressCountry": "EG"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-2-591-2234",
    "contactType": "Customer Service"
  },
  "sameAs": []
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
