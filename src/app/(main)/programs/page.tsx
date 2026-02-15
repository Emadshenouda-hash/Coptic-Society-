'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { programs } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const staticTranslations = {
  en: {
    title: 'Our Programs',
    description: 'Explore the diverse programs offered by the Grand Coptic Benevolent Society, from social assistance and healthcare to education and community development.',
    pageTitle: 'Our Fields of Action',
    pageSubtitle: 'We are dedicated to holistic community development through a wide range of targeted programs.',
  },
  ar: {
    title: 'برامجنا',
    description: 'استكشف البرامج المتنوعة التي تقدمها الجمعية القبطية الخيرية الكبرى، من المساعدات الاجتماعية والرعاية الصحية إلى التعليم وتنمية المجتمع.',
    pageTitle: 'مجالات عملنا',
    pageSubtitle: 'نحن ملتزمون بالتنمية المجتمعية الشاملة من خلال مجموعة واسعة من البرامج الموجهة.',
  }
};

export default function ProgramsPage() {
  const { language, direction } = useLanguage();
  
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'page_content', 'programs') : null, [firestore]);
  const { data: dynamicContent, isLoading } = useDoc(contentRef);

  const t = useMemo(() => {
    const content = dynamicContent ? (language === 'ar' ? dynamicContent.contentAr : dynamicContent.contentEn) : {};
    return { ...staticTranslations[language], ...content };
  }, [dynamicContent, language]);

  useEffect(() => {
    const pageTitle = t.title || staticTranslations[language].title;
    document.title = `${pageTitle} | Grand Coptic Benevolent Society`;
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

        <div className="mt-16 space-y-12">
            {programs.map((program) => (
              <Card key={program.id} id={program.id} className="overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                  <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
                    <CardHeader className="p-0">
                      <CardTitle className="font-headline text-3xl text-primary flex items-center gap-4">
                        <program.icon className="h-8 w-8 text-accent" />
                        {language === 'ar' ? program.titleAr : program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-4 flex-grow">
                        <p className="text-muted-foreground prose max-w-none">{language === 'ar' ? program.descriptionAr : program.description}</p>
                    </CardContent>
                  </div>
                  <div className="md:col-span-2 relative min-h-[300px] md:min-h-full">
                     {program.gallery.length > 1 ? (
                        <Carousel className="w-full h-full">
                          <CarouselContent className="h-full">
                            {program.gallery.map(imageId => {
                                const image = PlaceHolderImages.find(p => p.id === imageId);
                                if (!image) return null;
                                return (
                                    <CarouselItem key={imageId} className="h-full">
                                        <div className="relative h-full w-full">
                                            <Image 
                                                src={image.imageUrl} 
                                                alt={image.description} 
                                                fill 
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                    </CarouselItem>
                                )
                            })}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                        </Carousel>
                     ) : (
                       program.gallery.length === 1 && (
                         <Image 
                            src={PlaceHolderImages.find(p => p.id === program.gallery[0])?.imageUrl || ''} 
                            alt={PlaceHolderImages.find(p => p.id === program.gallery[0])?.description || ''} 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                            data-ai-hint={PlaceHolderImages.find(p => p.id === program.gallery[0])?.imageHint}
                          />
                       )
                     )}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
