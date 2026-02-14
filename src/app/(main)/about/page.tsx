'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


const staticTranslations = {
  en: {
    title: 'About Us',
    description: 'Learn about the history, mission, and vision of the Grand Coptic Benevolent Society, founded in 1881.',
    pageTitle: 'Our Story of Service',
    pageSubtitle: 'Founded in 1881, the Grand Coptic Benevolent Society has a long and proud history of compassionate service and community building.',
    mission: 'Our Mission',
    missionText: 'To serve needy families of all backgrounds, enhance social justice and dignity, and promote cultural, scientific, and religious awareness. We are a charitable, non-profit organisation committed to making a tangible difference in the lives of the most vulnerable.',
    vision: 'Our Vision',
    visionText: 'We envision a society where every individual has the opportunity to live a life of dignity, health, and purpose. We strive to be a leading force in combating poverty and illiteracy, working hand-in-hand with communities to build a brighter, more equitable future for all Egyptians.',
    registration: 'Official Registration',
    registrationText: 'The Grand Coptic Benevolent Society (الجمعية القبطية الخيرية الكبرى) is officially registered in Cairo under registration number 1080 on April 29, 1967. Our headquarters are located at 175 Ramsis Street, Cairo, with branches across Egypt.',
  },
  ar: {
    title: 'من نحن',
    description: 'تعرف على تاريخ ورسالة ورؤية الجمعية القبطية الخيرية الكبرى التي تأسست عام 1881.',
    pageTitle: 'قصتنا في الخدمة',
    pageSubtitle: 'تأسست الجمعية القبطية الخيرية الكبرى عام 1881، ولها تاريخ طويل ومشرف من الخدمة الرحيمة وبناء المجتمع.',
    mission: 'رسالتنا',
    missionText: 'خدمة الأسر المحتاجة من جميع الخلفيات، وتعزيز العدالة الاجتماعية والكرامة، ونشر الوعي الثقافي والعلمي والديني. نحن منظمة خيرية غير ربحية ملتزمة بإحداث فرق ملموس في حياة الفئات الأكثر ضعفًا.',
    vision: 'رؤيتنا',
    visionText: 'نتطلع إلى مجتمع يتمتع فيه كل فرد بفرصة العيش بكرامة وصحة وهدف. نسعى جاهدين لنكون قوة رائدة في مكافحة الفقر والأمية، ونعمل جنبًا إلى جنب مع المجتمعات لبناء مستقبل أكثر إشراقًا وإنصافًا لجميع المصريين.',
    registration: 'التسجيل الرسمي',
    registrationText: 'الجمعية القبطية الخيرية الكبرى مسجلة رسميًا في القاهرة برقم 1080 بتاريخ 29 أبريل 1967. يقع مقرنا الرئيسي في 175 شارع رمسيس، القاهرة، ولدينا فروع في جميع أنحاء مصر.',
  }
};


export default function AboutPage() {
  const { language, direction } = useLanguage();
  const firestore = useFirestore();
  
  const contentRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'page_content', 'about');
  }, [firestore]);

  const { data: dynamicContent, isLoading } = useDoc(contentRef);
  
  const t = useMemo(() => {
    const content = dynamicContent?.contentEn ? (language === 'ar' ? dynamicContent.contentAr : dynamicContent.contentEn) : null;
    return content || staticTranslations[language];
  }, [dynamicContent, language]);

  const heritageImage = PlaceHolderImages.find(img => img.id === 'about-heritage');
  
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

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
           <div className="prose prose-lg max-w-none text-foreground" dir={direction}>
            {isLoading ? (
                <div className="space-y-8">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (
                <>
                    <h2 className="font-headline text-primary">{t.mission}</h2>
                    <p>{t.missionText}</p>
                    <h2 className="font-headline text-primary">{t.vision}</h2>
                    <p>{t.visionText}</p>
                </>
            )}
           </div>
          {heritageImage && (
            <div className="relative h-96 w-full rounded-lg shadow-lg overflow-hidden">
               <Image
                src={heritageImage.imageUrl}
                alt={heritageImage.description}
                fill
                className="object-cover"
                data-ai-hint={heritageImage.imageHint}
              />
            </div>
          )}
        </div>

        <div className="mt-20">
            <Card className="bg-secondary">
                <CardHeader>
                    {isLoading ? <Skeleton className="h-8 w-1/2" /> : <CardTitle className="font-headline text-2xl text-primary">{t.registration}</CardTitle>}
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-10 w-full" /> : <p className="text-muted-foreground">{t.registrationText}</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    