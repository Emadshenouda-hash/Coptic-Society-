bash apply-fixes.sh
#!/bin/bash
# ============================================================
# COPTIC SOCIETY — CRITICAL FIXES SCRIPT
# Run this in Firebase Studio terminal: bash apply-fixes.sh
# ============================================================

set -e
echo "🔧 Applying critical fixes to coptic-society..."

# ============================================================
# FIX 1: Fix metadataBase URL in layout.tsx
# ============================================================
echo "📝 Fix 1: Updating metadataBase URL..."

cat > src/app/layout.tsx << 'LAYOUT_EOF'
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

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
    icon: '/favicon.ico',
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
LAYOUT_EOF

echo "✅ Fix 1 done: metadataBase now points to www.coptic-society.org"


# ============================================================
# FIX 2: Add Donate button + link to header
# ============================================================
echo "📝 Fix 2: Adding Donate button to header..."

cat > src/components/layout/brand-header.tsx << 'HEADER_EOF'
'use client';
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Heart } from "lucide-react";
import { LanguageSwitcher } from "../language-switcher";

const navLinks = [
  { href: '/', en: 'Home', ar: 'الرئيسية' },
  { href: '/about', en: 'About', ar: 'من نحن' },
  { href: '/programs', en: 'Programs', ar: 'برامجنا' },
  { href: '/governance', en: 'Governance', ar: 'الحوكمة' },
  { href: '/membership', en: 'Membership', ar: 'العضوية' },
  { href: '/bylaws', en: 'Bylaws', ar: 'النظام الأساسي' },
  { href: '/contact', en: 'Contact', ar: 'اتصل بنا' },
];


export function BrandHeader() {
  const { language } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* --- DESKTOP HEADER --- */}
        <div className="hidden md:flex flex-col">
          {/* Top Branding Section */}
          <div className="flex justify-center py-6">
            <Link href="/" className="flex flex-col items-center text-center">
              <h1 className={cn("text-2xl lg:text-3xl font-bold text-primary", language === 'ar' ? 'font-amiri' : 'font-cinzel')} lang={language}>
                  {language === 'ar' ? 'الجمعية القبطية الخيرية الكبرى' : 'The Grand Coptic Benevolent Society'}
              </h1>
              <p className="mt-1 font-montserrat text-xs font-light uppercase tracking-widest text-muted-foreground">
                  FOUNDED BY THE LATE BOUTROS PASHA GHALI
              </p>
            </Link>
          </div>

          {/* Bottom Navigation Section */}
          <div className="relative flex h-16 items-center justify-center border-t">
            <nav className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-base font-medium transition-colors hover:text-primary',
                      pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {language === 'ar' ? link.ar : link.en}
                  </Link>
                ))}
            </nav>
            <div className="absolute right-0 flex items-center gap-3">
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/donate" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {language === 'ar' ? 'تبرع' : 'Donate'}
                  </Link>
                </Button>
                <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* --- MOBILE HEADER --- */}
        <div className="flex h-20 items-center justify-between md:hidden">
            <Link href="/" className="flex flex-col items-start text-left">
                <h1 className={cn("text-lg font-bold text-primary", language === 'ar' ? 'font-amiri' : 'font-cinzel')} lang={language}>
                    {language === 'ar' ? 'الجمعية القبطية' : 'The Coptic Society'}
                </h1>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/donate" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {language === 'ar' ? 'تبرع' : 'Donate'}
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-full max-w-sm p-0">
                  <div className="flex h-full flex-col">
                    <div className="border-b p-4">
                      <span className="font-bold text-lg">{language === 'ar' ? 'القائمة' : 'Menu'}</span>
                    </div>
                    <nav className="flex flex-col gap-4 p-4 rtl:text-right">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-primary',
                            pathname === link.href
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        >
                          {language === 'ar' ? link.ar : link.en}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-4 border-t p-4">
                      <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/donate" className="flex items-center justify-center gap-2">
                          <Heart className="h-4 w-4" />
                          {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                        </Link>
                      </Button>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>

      </div>
    </header>
  );
}
HEADER_EOF

echo "✅ Fix 2 done: Donate button added to desktop + mobile header"


# ============================================================
# FIX 3: Complete footer navigation
# ============================================================
echo "📝 Fix 3: Completing footer quick links..."

cat > src/components/layout/footer.tsx << 'FOOTER_EOF'
'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const translations = {
  en: {
    quickLinks: 'Quick Links',
    about: 'About Us',
    programs: 'Our Programs',
    governance: 'Governance',
    membership: 'Membership',
    donate: 'Donate',
    contact: 'Contact',
    contactUs: 'Contact Us',
    addressLine1: '175 Ramsis Street, Cairo, Egypt',
    addressLine2: 'P.O. Box 47, Fagalah, Cairo, Egypt',
    phone1: '+20 2 591 2234',
    phone2: '+20 2 591 4047',
    emailAddress: 'info@coptic-society.org',
    copyright: 'Grand Coptic Benevolent Society. All rights reserved.',
    description: 'A charitable, non-profit organisation founded in 1881 to serve needy families, enhance social justice, and promote cultural awareness.',
  },
  ar: {
    quickLinks: 'روابط سريعة',
    about: 'من نحن',
    programs: 'برامجنا',
    governance: 'الحوكمة',
    membership: 'العضوية',
    donate: 'تبرع',
    contact: 'اتصل بنا',
    contactUs: 'اتصل بنا',
    addressLine1: '١٧٥ شارع رمسيس، القاهرة، مصر',
    addressLine2: 'ص.ب ٤٧، الفجالة، القاهرة، مصر',
    phone1: '+٢٠ ٢ ٥٩١ ٢٢٣٤',
    phone2: '+٢٠ ٢ ٥٩١ ٤٠٤٧',
    emailAddress: 'info@coptic-society.org',
    copyright: 'الجمعية القبطية الخيرية الكبرى. جميع الحقوق محفوظة.',
    description: 'جمعية خيرية غير هادفة للربح تأسست عام 1881 لخدمة الأسر المحتاجة وتعزيز العدالة الاجتماعية والوعي الثقافي.',
  }
}

export function Footer() {
  const { language, direction } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-secondary text-secondary-foreground" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 rtl:text-right">
          <div className="md:col-span-2">
            <div className="space-y-2">
                <p className="font-amiri text-3xl font-bold text-primary" lang="ar">الجمعية القبطية الخيرية الكبرى</p>
                <p className="font-montserrat text-lg font-bold uppercase tracking-wider text-primary">The Grand Coptic Benevolent Society</p>
            </div>
            <p className="mt-4 max-w-md text-sm">
              {t.description}
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">{t.quickLinks}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t.about}</Link></li>
              <li><Link href="/programs" className="hover:text-primary transition-colors">{t.programs}</Link></li>
              <li><Link href="/governance" className="hover:text-primary transition-colors">{t.governance}</Link></li>
              <li><Link href="/membership" className="hover:text-primary transition-colors">{t.membership}</Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors">{t.donate}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">{t.contactUs}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>{t.addressLine1}</p>
                  <p>{t.addressLine2}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 mt-1" />
                 <div>
                    <a href={`tel:${translations.en.phone1}`} className="hover:text-primary transition-colors block">{t.phone1}</a>
                    <a href={`tel:${translations.en.phone2}`} className="hover:text-primary transition-colors block">{t.phone2}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${t.emailAddress}`} className="hover:text-primary transition-colors">{t.emailAddress}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
FOOTER_EOF

echo "✅ Fix 3 done: Footer now has all navigation links including Donate"


# ============================================================
# FIX 4: Homepage — dual hero CTAs + impact stats section
# ============================================================
echo "📝 Fix 4: Upgrading homepage with dual CTAs + impact stats..."

cat > src/app/\(main\)/page.tsx << 'HOME_EOF'
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, HandHeart, Heart, HelpCircle, UserPlus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { programs } from '@/lib/content';
import { useLanguage } from '@/context/language-context';
import { useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const staticTranslations = {
  en: {
    heroTitle: 'Serving Egypt since 1881',
    heroSubtitle: 'Enhancing social justice and dignity for needy families of all backgrounds across Egypt.',
    donateNow: 'Donate Now',
    learnMore: 'Learn Our Story',
    getInvolved: 'Get Involved',
    getInvolvedSubtitle: 'Your support empowers us to continue our mission. Here\u2019s how you can make a difference.',
    becomeMember: 'Become a Member',
    becomeMemberDesc: 'Join our society to be part of a legacy of service and community leadership.',
    volunteer: 'Volunteer',
    volunteerDesc: 'Lend your time and skills to make a direct impact on the ground.',
    requestAssistance: 'Request Assistance',
    requestAssistanceDesc: 'If you or someone you know is in need, learn how our programs can help.',
    corePrograms: 'Our Core Programs',
    programsSubtitle: 'From healthcare to education, we run diverse programs to uplift communities and empower individuals.',
    readMore: 'Read More',
    viewAllPrograms: 'View All Programs',
    statsYears: 'Years of Service',
    statsPrograms: 'Core Programs',
    statsFamilies: 'Families Served',
    statsBranches: 'Branches Across Egypt',
  },
  ar: {
    heroTitle: 'نخدم مصر منذ ۱۸۸۱',
    heroSubtitle: 'تعزيز العدالة الاجتماعية والكرامة للأسر المحتاجة من جميع الخلفيات في جميع أنحاء مصر.',
    donateNow: 'تبرع الآن',
    learnMore: 'اعرف قصتنا',
    getInvolved: 'شارك معنا',
    getInvolvedSubtitle: 'دعمكم يمكننا من مواصلة مهمتنا. إليك كيف يمكنك إحداث فرق.',
    becomeMember: 'كن عضوا',
    becomeMemberDesc: 'انضم إلى جمعيتنا لتكون جزءًا من إرث الخدمة والقيادة المجتمعية.',
    volunteer: 'تطوع',
    volunteerDesc: 'قدم وقتك ومهاراتك لإحداث تأثير مباشر على أرض الواقع.',
    requestAssistance: 'اطلب مساعدة',
    requestAssistanceDesc: 'إذا كنت أنت أو أي شخص تعرفه في حاجة، فتعرف على كيف يمكن لبرامجنا المساعدة.',
    corePrograms: 'برامجنا الأساسية',
    programsSubtitle: 'من الرعاية الصحية إلى التعليم، ندير برامج متنوعة للنهوض بالمجتمعات وتمكين الأفراد.',
    readMore: 'اقرأ المزيد',
    viewAllPrograms: 'عرض كل البرامج',
    statsYears: 'سنوات من الخدمة',
    statsPrograms: 'برامج أساسية',
    statsFamilies: 'أسر مستفيدة',
    statsBranches: 'فروع في مصر',
  }
};

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');
  const programIcons = programs.slice(0, 3);
  const { language, direction } = useLanguage();

  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'page_content', 'home') : null, [firestore]);
  const { data: dynamicContent, isLoading: isContentLoading } = useDoc(contentRef);

  const t = useMemo(() => {
    const dbContent = dynamicContent || {};
    const fallback = staticTranslations[language];
    const content = language === 'ar' 
        ? { ...fallback, ...(dbContent.contentAr || {}) }
        : { ...fallback, ...(dbContent.contentEn || {}) };
    return content;
  }, [dynamicContent, language]);
  
  useEffect(() => {
    document.title = `${language === 'en' ? 'Home' : 'الرئيسية'} | Grand Coptic Benevolent Society`;
  }, [language]);


  return (
    <div className="flex-1" dir={direction}>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-75"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            {isContentLoading ? (
                <div className='space-y-4'>
                    <Skeleton className="h-20 w-full max-w-4xl mx-auto bg-primary-foreground/20" />
                    <Skeleton className="h-8 w-full max-w-2xl mx-auto bg-primary-foreground/20" />
                </div>
            ) : (
                <>
                    <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-white shadow-lg">
                        {t.heroTitle}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-white/90">
                        {t.heroSubtitle}
                    </p>
                </>
            )}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-10 py-6 bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-white">
                <Link href="/donate" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t.donateNow}
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white/10 focus-visible:ring-white bg-transparent">
                <Link href="/about">{t.learnMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">140+</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsYears}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">6</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsPrograms}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">1000s</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsFamilies}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">12+</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsBranches}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Involved Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.getInvolved}</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.getInvolvedSubtitle}</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  { title: t.becomeMember, desc: t.becomeMemberDesc, href: '/membership', icon: UserPlus },
                  { title: t.volunteer, desc: t.volunteerDesc, href: '/contact', icon: HandHeart },
                  { title: t.requestAssistance, desc: t.requestAssistanceDesc, href: '/programs', icon: HelpCircle },
                ].map(item => (
                  <Card key={item.href} className="text-center transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col p-4">
                      <CardHeader className="pt-8">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                              <item.icon className="h-10 w-10" />
                          </div>
                          <CardTitle className="font-headline pt-6 text-2xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                          <p className="text-muted-foreground text-base flex-grow">{item.desc}</p>
                           <div className="mt-6">
                             <Button variant="outline" asChild className="text-base">
                                <Link href={item.href}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                            </Button>
                           </div>
                      </CardContent>
                  </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
             {isContentLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.corePrograms}</h2>}
             {isContentLoading ? <Skeleton className="h-7 w-3/4 mx-auto mt-4" /> : <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.programsSubtitle}</p>}
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {programIcons.map((program) => (
              <Card key={program.id} className="text-center transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col p-4">
                <CardHeader className="pt-8">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <program.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="font-headline pt-6 text-2xl">{language === 'ar' ? program.titleAr : program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-base flex-grow">{(language === 'ar' ? program.descriptionAr : program.description).substring(0, 120)}...</p>
                  <div className="mt-6">
                    <Button variant="outline" asChild className="text-base">
                        <Link href={`/programs#${program.id}`}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-10 py-6">
              <Link href="/programs">{t.viewAllPrograms}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
HOME_EOF

echo "✅ Fix 4 done: Dual hero CTAs (Donate Now + Learn Our Story) + Impact Stats section"


# ============================================================
# FIX 5: Per-page metadata via (main)/layout.tsx
# Since pages are client components, we add metadata via
# the (main) layout which is a server component
# ============================================================
echo "📝 Fix 5: Checking (main)/layout.tsx for metadata support..."

cat src/app/\(main\)/layout.tsx

echo ""
echo "⚠️  Note: Since all page files use 'use client', per-page metadata"
echo "   must be set via generateMetadata in a parent layout or via"
echo "   document.title in each page (which is already done)."
echo "   The title template in root layout.tsx already handles this."
echo ""

# ============================================================
# DONE — Commit and push
# ============================================================
echo ""
echo "============================================"
echo "🎉 All critical fixes applied!"
echo "============================================"
echo ""
echo "Changes made:"
echo "  1. ✅ metadataBase → www.coptic-society.org (SEO fix)"
echo "  2. ✅ Donate button in header (desktop + mobile)"
echo "  3. ✅ Footer: all nav links + Donate"
echo "  4. ✅ Homepage: dual hero CTAs + impact stats"
echo "  5. ✅ JSON-LD & OG URLs fixed"
echo "  6. ✅ Twitter image card enabled"
echo ""
echo "Contact form already works via Firebase ✅"
echo "Donate page already exists ✅"
echo ""
echo "Now run:"
echo "  git add ."
echo '  git commit -m "fix: critical website enhancements (SEO, donate button, stats, footer)"'
echo "  git push"
echo ""
echo "Vercel will auto-deploy after push."
