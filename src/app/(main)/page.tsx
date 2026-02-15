'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, HandHeart, HelpCircle, UserPlus } from 'lucide-react';
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
    learnMore: 'Learn More',
    getInvolved: 'Get Involved',
    getInvolvedSubtitle: 'Your support empowers us to continue our mission. Here’s how you can make a difference.',
    donateNow: 'Donate',
    donateDesc: 'Your financial gift provides immediate relief and long-term support to those who need it most.',
    becomeMember: 'Become a Member',
    becomeMemberDesc: 'Join our society to be part of a legacy of service and community leadership.',
    volunteer: 'Volunteer',
    volunteerDesc: 'Lend your time and skills to make a direct impact on the ground.',
    requestAssistance: 'Request Assistance',
    requestAssistanceDesc: 'If you or someone you know is in need, learn how our programs can help.',
    corePrograms: 'Our Core Programs',
    programsSubtitle: 'From healthcare to education, we run diverse programs to uplift communities and empower individuals.',
    readMore: 'Read More',
    viewAllPrograms: 'View All Programs'
  },
  ar: {
    heroTitle: 'نخدم مصر منذ ۱۸۸۱',
    heroSubtitle: 'تعزيز العدالة الاجتماعية والكرامة للأسر المحتاجة من جميع الخلفيات في جميع أنحاء مصر.',
    learnMore: 'اعرف المزيد',
    getInvolved: 'شارك معنا',
    getInvolvedSubtitle: 'دعمكم يمكننا من مواصلة مهمتنا. إليك كيف يمكنك إحداث فرق.',
    donateNow: 'تبرع الآن',
    donateDesc: 'هديتك المالية توفر إغاثة فورية ودعمًا طويل الأمد لمن هم في أمس الحاجة إليها.',
    becomeMember: 'كن عضوا',
    becomeMemberDesc: 'انضم إلى جمعيتنا لتكون جزءًا من إرث الخدمة والقيادة المجتمعية.',
    volunteer: 'تطوع',
    volunteerDesc: 'قدم وقتك ومهاراتك لإحداث تأثير مباشر على أرض الواقع.',
    requestAssistance: 'اطلب مساعدة',
    requestAssistanceDesc: 'إذا كنت أنت أو أي شخص تعرفه في حاجة، فتعرف على كيف يمكن لبرامجنا المساعدة.',
    corePrograms: 'برامجنا الأساسية',
    programsSubtitle: 'من الرعاية الصحية إلى التعليم، ندير برامج متنوعة للنهوض بالمجتمعات وتمكين الأفراد.',
    readMore: 'اقرأ المزيد',
    viewAllPrograms: 'عرض كل البرامج'
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
    // Merge database content with fallback, ensuring no empty strings if DB is missing keys
    const content = language === 'ar' 
        ? { ...fallback, ...dbContent.contentAr }
        : { ...fallback, ...dbContent.contentEn };
    return content;
  }, [dynamicContent, language]);
  
  useEffect(() => {
    document.title = `${language === 'en' ? 'Home' : 'الرئيسية'} | Grand Coptic Benevolent Society`;
  }, [language]);


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
            {isContentLoading ? (
                <div className='space-y-4'>
                    <Skeleton className="h-16 w-full max-w-4xl mx-auto bg-primary-foreground/20" />
                    <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-primary-foreground/20" />
                </div>
            ) : (
                <>
                    <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl">
                        {t.heroTitle}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl font-body">
                        {t.heroSubtitle}
                    </p>
                </>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary">
                <Link href="/about">{t.learnMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Involved Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="font-headline text-3xl md:text-4xl text-primary">{t.getInvolved}</h2>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">{t.getInvolvedSubtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: t.donateNow, desc: t.donateDesc, href: '/donate', icon: Gift },
                  { title: t.becomeMember, desc: t.becomeMemberDesc, href: '/membership', icon: UserPlus },
                  { title: t.volunteer, desc: t.volunteerDesc, href: '/contact', icon: HandHeart },
                  { title: t.requestAssistance, desc: t.requestAssistanceDesc, href: '/programs', icon: HelpCircle },
                ].filter(item => item.href !== '/donate').map(item => (
                  <Card key={item.href} className="text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
                      <CardHeader>
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                              <item.icon className="h-8 w-8" />
                          </div>
                          <CardTitle className="font-headline pt-4">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                          <p className="text-muted-foreground text-sm flex-grow">{item.desc}</p>
                          <Button variant="link" asChild className="mt-auto pt-4 text-accent hover:text-accent/80">
                            <Link href={item.href}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                          </Button>
                      </CardContent>
                  </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
             {isContentLoading ? <Skeleton className="h-10 w-1/2 mx-auto" /> : <h2 className="font-headline text-3xl md:text-4xl text-primary">{t.corePrograms}</h2>}
             {isContentLoading ? <Skeleton className="h-6 w-3/4 mx-auto mt-4" /> : <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">{t.programsSubtitle}</p>}
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programIcons.map((program) => (
              <Card key={program.id} className="text-center transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <program.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">{language === 'ar' ? program.titleAr : program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-sm flex-grow">{(language === 'ar' ? program.descriptionAr : program.description).substring(0, 100)}...</p>
                  <Button variant="link" asChild className="mt-auto pt-4 text-accent hover:text-accent/80">
                    <Link href={`/programs#${program.id}`}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/programs">{t.viewAllPrograms}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
