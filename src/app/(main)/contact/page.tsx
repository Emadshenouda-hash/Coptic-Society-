'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { ContactForm } from '@/components/contact-form';
import { useLanguage } from '@/context/language-context';
import { useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const staticTranslations = {
  en: {
    title: 'Contact Us',
    description: 'Get in touch with the Grand Coptic Benevolent Society. Find our address, phone number, and email, or use the contact form to send us a message.',
    pageTitle: 'Get In Touch',
    pageSubtitle: 'We welcome your questions, feedback, and collaboration proposals. Reach out to us through any of the channels below.',
    contactInfo: 'Contact Information',
    headquarters: 'Our Headquarters',
    addressLine1: '175 Ramsis Street, Cairo, Egypt',
    addressLine2: 'P.O. Box 47, Fagalah, Cairo, Egypt',
    phone: 'Phone',
    phone1: '+20 2 591 2234',
    phone2: '+20 2 591 4047',
    email: 'Email',
    emailAddress: 'info@coptic-society.org',
    formTitle: 'Send Us a Message',
  },
  ar: {
    title: 'اتصل بنا',
    description: 'تواصل مع الجمعية القبطية الخيرية الكبرى. ابحث عن عنواننا ورقم هاتفنا وبريدنا الإلكتروني، أو استخدم نموذج الاتصال لإرسال رسالة إلينا.',
    pageTitle: 'تواصل معنا',
    pageSubtitle: 'نرحب بأسئلتكم وملاحظاتكم ومقترحات التعاون. تواصلوا معنا عبر أي من القنوات أدناه.',
    contactInfo: 'معلومات الاتصال',
    headquarters: 'مقرنا الرئيسي',
    addressLine1: '175 شارع رمسيس، القاهرة، مصر',
    addressLine2: 'ص.ب 47، الفجالة، القاهرة، مصر',
    phone: 'الهاتف',
    phone1: '+20 2 591 2234',
    phone2: '+20 2 591 4047',
    email: 'البريد الإلكتروني',
    emailAddress: 'info@coptic-society.org',
    formTitle: 'أرسل لنا رسالة',
  }
};

export default function ContactPage() {
  const { language, direction } = useLanguage();
  const contactImage = PlaceHolderImages.find(p => p.id === 'contact-us');
  
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'page_content', 'contact') : null, [firestore]);
  const { data: dynamicContent, isLoading } = useDoc(contentRef);

  const t = useMemo(() => {
    const content = dynamicContent ? (language === 'ar' ? dynamicContent.contentAr : dynamicContent.contentEn) : {};
    return { ...staticTranslations[language], ...content };
  }, [dynamicContent, language]);

  useEffect(() => {
    const pageTitle = t.title || staticTranslations[language].title;
    document.title = `${pageTitle} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t, language]);

  return (
    <div className="bg-background" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
            {isLoading ? (
                <>
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-full max-w-3xl mx-auto mt-4" />
                </>
            ) : (
                <>
                    <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        {t.pageSubtitle}
                    </p>
                </>
            )}
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-8">
                {isLoading ? <Skeleton className="h-10 w-1/2" /> : <h2 className="font-headline text-3xl text-primary">{t.contactInfo}</h2>}
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            {isLoading ? <Skeleton className="h-6 w-32 mb-2" /> : <h3 className="font-semibold text-lg">{t.headquarters}</h3>}
                            {isLoading ? <Skeleton className="h-5 w-48" /> : <p className="text-muted-foreground">{t.addressLine1}</p>}
                            {isLoading ? <Skeleton className="h-5 w-56 mt-1" /> : <p className="text-muted-foreground">{t.addressLine2}</p>}
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            {isLoading ? <Skeleton className="h-6 w-24 mb-2" /> : <h3 className="font-semibold text-lg">{t.phone}</h3>}
                            {isLoading ? <Skeleton className="h-5 w-32" /> : <a href={`tel:${t.phone1}`} className="text-muted-foreground hover:text-primary transition-colors block">{t.phone1}</a>}
                            {isLoading ? <Skeleton className="h-5 w-32 mt-1" /> : <a href={`tel:${t.phone2}`} className="text-muted-foreground hover:text-primary transition-colors block">{t.phone2}</a>}
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            {isLoading ? <Skeleton className="h-6 w-20 mb-2" /> : <h3 className="font-semibold text-lg">{t.email}</h3>}
                            {isLoading ? <Skeleton className="h-5 w-40" /> : <a href={`mailto:${t.emailAddress}`} className="text-muted-foreground hover:text-primary transition-colors">{t.emailAddress}</a>}
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
                {isLoading ? <Skeleton className="h-10 w-1/2 mb-6" /> : <h2 className="font-headline text-3xl text-primary mb-6">{t.formTitle}</h2>}
                <ContactForm />
           </Card>
        </div>
      </div>
    </div>
  );
}
