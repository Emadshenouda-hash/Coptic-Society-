import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const SITE_URL = 'https://www.coptic-society.org';
const GA_ID = 'G-LCBKQFQ88F';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Grand Coptic Benevolent Society | الجمعية القبطية الخيرية الكبرى',
    template: `%s | Grand Coptic Benevolent Society`,
  },
  description:
    'The Grand Coptic Benevolent Society is a charitable, non-profit organisation founded in 1881 to serve needy families and promote social justice and dignity.',
  openGraph: {
    title: 'Grand Coptic Benevolent Society',
    description: 'Serving Egypt since 1881. A charitable, non-profit organisation dedicated to social justice.',
    url: SITE_URL,
    siteName: 'Grand Coptic Benevolent Society',
    // TODO: Update /public/og-image.jpg with new branding
    images: [
      {
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
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
    icon: '/favicon.svg',
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Grand Coptic Benevolent Society",
  "alternateName": "الجمعية القبطية الخيرية الكبرى",
  "url": SITE_URL,
  "logo": `${SITE_URL}/assets/gcbs-historic-building.jpg`,
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
    <html lang="en" className="scroll-smooth">
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Google tag (gtag.js) - raw script tags ensure presence in server-rendered HTML */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
