'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { programs } from '@/lib/content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';
import { useEffect } from 'react';

const translations = {
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
  const t = translations[language];

  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-background" dir={direction}>
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue={programs[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 h-auto">
              {programs.map((program) => (
                <TabsTrigger key={program.id} value={program.id} className="flex flex-col md:flex-row gap-2 h-auto py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                   <program.icon className="h-5 w-5" /> 
                   <span className="font-medium">{language === 'ar' ? program.titleAr : program.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {programs.map((program) => (
              <TabsContent key={program.id} value={program.id} className="mt-8 rounded-lg border bg-card p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <h2 className="font-headline text-3xl text-primary">{language === 'ar' ? program.titleAr : program.title}</h2>
                        <p className="mt-4 text-muted-foreground prose max-w-none">{language === 'ar' ? program.descriptionAr : program.description}</p>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {program.gallery.map(imageId => {
                            const image = PlaceHolderImages.find(p => p.id === imageId);
                            if (!image) return null;
                            return (
                                <div key={imageId} className="relative aspect-square w-full overflow-hidden rounded-md shadow-md">
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={image.description} 
                                        fill 
                                        className="object-cover transition-transform hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 15vw"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
