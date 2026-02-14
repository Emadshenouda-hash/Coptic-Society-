'use client';

import { DonateForm } from "@/components/donate-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { DollarSign, Heart, Utensils } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const staticTranslations = {
  en: {
    title: 'Donate',
    description: 'Support the Grand Coptic Benevolent Society with your donation and help us continue our mission of serving the community.',
    pageTitle: 'Your Support, Their Future',
    pageSubtitle: 'Every donation, no matter the size, contributes directly to our programs and brings hope to those in need. Join us in making a lasting impact.',
    impactTitle: 'See Your Impact',
    impactAmount1: '$25',
    impactDescription1: 'can provide a food basket for a family for a week.',
    impactAmount2: '$50',
    impactDescription2: 'can cover the cost of a medical check-up and essential medicines.',
    impactAmount3: '$100',
    impactDescription3: 'can support a student with school supplies for a year.',
  },
  ar: {
    title: 'تبرع',
    description: 'ادعم الجمعية القبطية الخيرية الكبرى بتبرعك وساعدنا على مواصلة مهمتنا في خدمة المجتمع.',
    pageTitle: 'دعمكم هو مستقبلهم',
    pageSubtitle: 'كل تبرع، مهما كان حجمه، يساهم بشكل مباشر في برامجنا ويجلب الأمل للمحتاجين. انضم إلينا في إحداث تأثير دائم.',
    impactTitle: 'شاهد تأثيرك',
    impactAmount1: '٢٥ دولار',
    impactDescription1: 'يمكن أن توفر سلة غذائية لأسرة لمدة أسبوع.',
    impactAmount2: '٥٠ دولار',
    impactDescription2: 'يمكن أن تغطي تكلفة فحص طبي وأدوية أساسية.',
    impactAmount3: '١٠٠ دولار',
    impactDescription3: 'يمكن أن تدعم طالبًا باللوازم المدرسية لمدة عام.',
  }
};

export default function DonatePage() {
  const { language, direction } = useLanguage();
  const firestore = useFirestore();
  
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'page_content', 'donate') : null, [firestore]);
  const { data: dynamicContent, isLoading } = useDoc(contentRef);

  const t = useMemo(() => {
    const content = dynamicContent ? (language === 'ar' ? dynamicContent.contentAr : dynamicContent.contentEn) : null;
    return content || staticTranslations[language];
  }, [dynamicContent, language]);

  const impactItems = useMemo(() => [
      { icon: Utensils, amount: t.impactAmount1, description: t.impactDescription1 },
      { icon: Heart, amount: t.impactAmount2, description: t.impactDescription2 },
      { icon: DollarSign, amount: t.impactAmount3, description: t.impactDescription3 },
  ], [t]);


  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-secondary" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                  </div>
              ) : (
                <>
                  <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
                  <p className="text-lg text-muted-foreground">
                    {t.pageSubtitle}
                  </p>
                </>
              )}
            </div>
            <Card className="bg-card">
              <CardHeader>
                {isLoading ? <Skeleton className="h-8 w-1/2"/> : <CardTitle className="font-headline text-2xl text-primary">{t.impactTitle}</CardTitle>}
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                  impactItems.map(item => (
                      <div key={item.amount} className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                              <item.icon className="h-6 w-6" />
                          </div>
                          <div>
                              <p className="text-foreground"><strong className="font-semibold">{item.amount}</strong> {item.description}</p>
                          </div>
                      </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <DonateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
