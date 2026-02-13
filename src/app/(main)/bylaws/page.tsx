'use client';

import { BylawsClient } from '@/components/bylaws-client';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { Download } from 'lucide-react';
import { useEffect } from 'react';

const translations = {
  en: {
    title: 'Bylaws',
    description: 'Review the official bylaws of the Grand Coptic Benevolent Society or use our AI tool to summarize the document.',
    pageTitle: 'Society Bylaws',
    pageSubtitle: 'Our operations are guided by a comprehensive set of bylaws. You can download the full official document or use our AI tool for a quick summary.',
    officialDocument: 'Official Document',
    downloadButton: 'Download Full Bylaws (PDF)',
  },
  ar: {
    title: 'النظام الأساسي',
    description: 'راجع النظام الأساسي الرسمي للجمعية القبطية الخيرية الكبرى أو استخدم أداة الذكاء الاصطناعي الخاصة بنا لتلخيص المستند.',
    pageTitle: 'النظام الأساسي للجمعية',
    pageSubtitle: 'تسترشد عملياتنا بمجموعة شاملة من اللوائح. يمكنك تنزيل المستند الرسمي الكامل أو استخدام أداة الذكاء الاصطناعي الخاصة بنا للحصول على ملخص سريع.',
    officialDocument: 'المستند الرسمي',
    downloadButton: 'تنزيل النظام الأساسي الكامل (PDF)',
  }
};

export default function BylawsPage() {
  const { language, direction } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-background" dir={direction}>
      <div className="container py-16 lg:py-24 space-y-16">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
            <h2 className="font-headline text-2xl text-primary">{t.officialDocument}</h2>
            <Button size="lg" asChild>
                {/* The actual bylaws.pdf should be placed in the /public directory */}
                <a href="/bylaws.pdf" download>
                    <Download className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                    {t.downloadButton}
                </a>
            </Button>
        </div>
        
        <BylawsClient />
      </div>
    </div>
  );
}
