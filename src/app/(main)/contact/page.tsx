'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { ContactForm } from '@/components/contact-form';
import { useLanguage } from '@/context/language-context';
import { useEffect } from 'react';

const translations = {
  en: {
    title: 'Contact Us',
    description: 'Get in touch with the Grand Coptic Benevolent Society. Find our address, phone number, and email, or use the contact form to send us a message.',
    pageTitle: 'Get In Touch',
    pageSubtitle: 'We welcome your questions, feedback, and collaboration proposals. Reach out to us through any of the channels below.',
    contactInfo: 'Contact Information',
    headquarters: 'Our Headquarters',
    phone: 'Phone',
    email: 'Email',
    formTitle: 'Send Us a Message',
  },
  ar: {
    title: 'اتصل بنا',
    description: 'تواصل مع الجمعية القبطية الخيرية الكبرى. ابحث عن عنواننا ورقم هاتفنا وبريدنا الإلكتروني، أو استخدم نموذج الاتصال لإرسال رسالة إلينا.',
    pageTitle: 'تواصل معنا',
    pageSubtitle: 'نرحب بأسئلتكم وملاحظاتكم ومقترحات التعاون. تواصلوا معنا عبر أي من القنوات أدناه.',
    contactInfo: 'معلومات الاتصال',
    headquarters: 'مقرنا الرئيسي',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    formTitle: 'أرسل لنا رسالة',
  }
};

export default function ContactPage() {
  const { language, direction } = useLanguage();
  const t = translations[language];
  const contactImage = PlaceHolderImages.find(p => p.id === 'contact-us');

  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-background" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-8">
                <h2 className="font-headline text-3xl text-primary">{t.contactInfo}</h2>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{t.headquarters}</h3>
                            <p className="text-muted-foreground">175 Ramsis Street, Cairo, Egypt</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{t.phone}</h3>
                            <a href="tel:+20212345678" className="text-muted-foreground hover:text-primary transition-colors">+20 2 1234 5678</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{t.email}</h3>
                            <a href="mailto:info@coptic-society.org" className="text-muted-foreground hover:text-primary transition-colors">info@coptic-society.org</a>
                        </div>
                    </div>
                </div>
                {contactImage && (
                    <div className="relative h-64 w-full rounded-lg shadow-md overflow-hidden">
                        <Image
                            src={contactImage.imageUrl}
                            alt={contactImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={contactImage.imageHint}
                        />
                    </div>
                )}
           </div>
           
           <Card className="p-6 md:p-8 shadow-lg">
                <h2 className="font-headline text-3xl text-primary mb-6">{t.formTitle}</h2>
                <ContactForm />
           </Card>
        </div>
      </div>
    </div>
  );
}
