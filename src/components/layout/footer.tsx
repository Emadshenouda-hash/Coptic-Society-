'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const translations = {
  en: {
    quickLinks: 'Quick Links',
    about: 'About Us',
    programs: 'Our Programs',
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
              {/* <li><Link href="/donate" className="hover:text-primary transition-colors">{t.donate}</Link></li> */}
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
