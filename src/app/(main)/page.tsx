'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { programs, newsArticles } from '@/lib/content';
import { useLanguage } from '@/context/language-context';

const translations = {
  en: {
    heroTitle: 'Serving Egypt since 1881',
    heroSubtitle: 'Enhancing social justice and dignity for needy families of all backgrounds across Egypt.',
    donateNow: 'Donate Now',
    learnMore: 'Learn More',
    corePrograms: 'Our Core Programs',
    programsSubtitle: 'From healthcare to education, we run diverse programs to uplift communities and empower individuals.',
    readMore: 'Read More',
    latestNews: 'Latest News & Updates',
    newsSubtitle: 'Stay informed about our latest activities, events, and success stories.',
    readFullStory: 'Read Full Story',
    viewAllNews: 'View All News',
  },
  ar: {
    heroTitle: 'نخدم مصر منذ ۱۸۸۱',
    heroSubtitle: 'تعزيز العدالة الاجتماعية والكرامة للأسر المحتاجة من جميع الخلفيات في جميع أنحاء مصر.',
    donateNow: 'تبرع الآن',
    learnMore: 'اعرف المزيد',
    corePrograms: 'برامجنا الأساسية',
    programsSubtitle: 'من الرعاية الصحية إلى التعليم، ندير برامج متنوعة للنهوض بالمجتمعات وتمكين الأفراد.',
    readMore: 'اقرأ المزيد',
    latestNews: 'آخر الأخبار والمستجدات',
    newsSubtitle: 'ابق على اطلاع بآخر أنشطتنا وفعالياتنا وقصص نجاحنا.',
    readFullStory: 'اقرأ القصة كاملة',
    viewAllNews: 'عرض كل الأخبار',
  }
};


export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');
  const programIcons = programs.slice(0, 6);
  const recentNews = newsArticles.slice(0, 3);
  const { language, direction } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex-1" dir={direction}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-105 contrast-125"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl">
              {t.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/donate">{t.donateNow}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary">
                <Link href="/about">{t.learnMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl text-primary">{t.corePrograms}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
              {t.programsSubtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programIcons.map((program) => (
              <Card key={program.id} className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <program.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">{language === 'ar' ? program.titleAr : program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{(language === 'ar' ? program.descriptionAr : program.description).substring(0, 100)}...</p>
                  <Button variant="link" asChild className="mt-4 text-accent hover:text-accent/80">
                    <Link href={`/programs#${program.id}`}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl text-primary">{t.latestNews}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
              {t.newsSubtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentNews.map((article) => {
              const articleImage = PlaceHolderImages.find(p => p.id === article.image);
              return (
                <Card key={article.id} className="overflow-hidden flex flex-col">
                  {articleImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={articleImage.imageUrl}
                        alt={articleImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={articleImage.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <span className="text-xs text-muted-foreground">{new Date(article.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <CardTitle className="font-headline text-lg">{language === 'ar' ? article.titleAr : article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? article.excerptAr : article.excerpt}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                      <Link href={`/news#${article.slug}`}>{t.readFullStory} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/news">{t.viewAllNews}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
