import type { Metadata } from 'next';
import { Inter, Playfair_Display, Amiri, Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
  display: 'swap',
  weight: ['400', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const SITE_URL = 'https://www.coptic-society.org';

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
  "logo": `${SITE_URL}/favicon.svg`,
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
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${playfairDisplay.variable} ${amiri.variable} ${montserrat.variable}`}
    >
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
