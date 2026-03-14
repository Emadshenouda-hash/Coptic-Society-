'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, HandHeart, Heart, HelpCircle, UserPlus, Banknote } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { programs } from '@/lib/content';
import { useLanguage } from '@/context/language-context';
import { useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionBadge } from '@/components/ui/section-badge';
import { FadeIn } from '@/components/fade-in';

const staticTranslations = {
  en: {
    heroBadge: 'Est. 1881 · Cairo, Egypt',
    heroTitle: 'Serving the Community with Faith and Action',
    heroSubtitle: 'A charitable, non-profit organisation enhancing social justice and dignity for needy families of all backgrounds across Egypt.',
    donateNow: 'Donate Now',
    learnMore: 'Learn Our Story',
    getInvolved: 'Get Involved',
    getInvolvedHeading: 'Make a Difference',
    getInvolvedSubtitle: 'Your support empowers us to continue our mission. Here\'s how you can make a difference.',
    becomeMember: 'Become a Member',
    becomeMemberDesc: 'Join our society to be part of a legacy of service and community leadership.',
    volunteer: 'Volunteer',
    volunteerDesc: 'Lend your time and skills to make a direct impact on the ground.',
    requestAssistance: 'Request Assistance',
    requestAssistanceDesc: 'If you or someone you know is in need, learn how our programs can help.',
    corePrograms: 'Our Programs',
    coreProgramsHeading: 'What We Do',
    programsSubtitle: 'From healthcare to education, we run diverse programs to uplift communities and empower individuals.',
    readMore: 'Read More',
    viewAllPrograms: 'View All Programs',
    statsYears: 'Years of Service',
    statsPrograms: 'Core Programs',
    statsFamilies: 'Families Served',
    statsBranches: 'Branches Across Egypt',
    ctaBannerTitle: 'Together, We Can Make a Lasting Difference',
    ctaBannerButton: 'Contribute to Our Mission',
  },
  ar: {
    heroBadge: 'تأسست ١٨٨١ · القاهرة، مصر',
    heroTitle: 'نخدم المجتمع بالإيمان والعمل',
    heroSubtitle: 'جمعية خيرية غير هادفة للربح، تعزز العدالة الاجتماعية والكرامة للأسر المحتاجة من جميع الخلفيات في جميع أنحاء مصر.',
    donateNow: 'تبرع الآن',
    learnMore: 'اعرف قصتنا',
    getInvolved: 'شارك معنا',
    getInvolvedHeading: 'أحدث فرقاً',
    getInvolvedSubtitle: 'دعمكم يمكننا من مواصلة مهمتنا. إليك كيف يمكنك إحداث فرق.',
    becomeMember: 'كن عضوا',
    becomeMemberDesc: 'انضم إلى جمعيتنا لتكون جزءًا من إرث الخدمة والقيادة المجتمعية.',
    volunteer: 'تطوع',
    volunteerDesc: 'قدم وقتك ومهاراتك لإحداث تأثير مباشر على أرض الواقع.',
    requestAssistance: 'اطلب مساعدة',
    requestAssistanceDesc: 'إذا كنت أنت أو أي شخص تعرفه في حاجة، فتعرف على كيف يمكن لبرامجنا المساعدة.',
    corePrograms: 'برامجنا',
    coreProgramsHeading: 'ما نقدمه',
    programsSubtitle: 'من الرعاية الصحية إلى التعليم، ندير برامج متنوعة للنهوض بالمجتمعات وتمكين الأفراد.',
    readMore: 'اقرأ المزيد',
    viewAllPrograms: 'عرض كل البرامج',
    statsYears: 'سنوات من الخدمة',
    statsPrograms: 'برامج أساسية',
    statsFamilies: 'أسر مستفيدة',
    statsBranches: 'فروع في مصر',
    ctaBannerTitle: 'معاً يمكننا إحداث فرق دائم',
    ctaBannerButton: 'ساهم في رسالتنا',
  }
};

export function HomeClient() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');
  const programIcons = programs.slice(0, 3);
  const { language, direction } = useLanguage();

  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'page_content', 'home') : null, [firestore]);
  const { data: dynamicContent, isLoading: isContentLoading } = useDoc(contentRef);

  const t = useMemo(() => {
    const dbContent = dynamicContent || {};
    const fallback = staticTranslations[language];
    return language === 'ar'
        ? { ...fallback, ...(dbContent.contentAr || {}) }
        : { ...fallback, ...(dbContent.contentEn || {}) };
  }, [dynamicContent, language]);

  useEffect(() => {
    document.title = `${language === 'en' ? 'Home' : 'الرئيسية'} | Grand Coptic Benevolent Society`;
  }, [language]);

  return (
    <div className="flex-1" dir={direction}>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-50"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              {isContentLoading ? <Skeleton className="h-6 w-72 mx-auto mb-4 bg-white/20" /> : (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className="text-sm font-semibold uppercase tracking-widest text-accent">{t.heroBadge}</span>
                  <div className="h-px w-16 bg-accent/50"></div>
                </div>
              )}
              {isContentLoading ? (
                  <div className='space-y-4'>
                      <Skeleton className="h-24 w-full max-w-5xl mx-auto bg-white/20" />
                      <Skeleton className="h-8 w-full max-w-3xl mx-auto bg-white/20" />
                  </div>
              ) : (
                  <>
                      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider text-white shadow-lg leading-tight">
                          {t.heroTitle}
                      </h1>
                      <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-white/90">
                          {t.heroSubtitle}
                      </p>
                  </>
              )}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-white rounded-full font-semibold">
                  <Link href="/donate" className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {t.donateNow}
                  </Link>
                </Button>
                <Button size="lg" asChild variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white/10 focus-visible:ring-white bg-transparent rounded-full font-semibold">
                  <Link href="/about">{t.learnMore}</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          <div className="absolute bottom-10 animate-bounce-slow">
            <ChevronDown className="h-8 w-8 text-white/50"/>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <FadeIn className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">140+</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsYears}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">6</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsPrograms}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">10,000+</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsFamilies}</p>
            </div>
            <div>
              <p className="font-headline text-4xl md:text-5xl font-bold">12+</p>
              <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{t.statsBranches}</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <FadeIn className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
                <SectionBadge>{t.getInvolved}</SectionBadge>
                <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.getInvolvedHeading}</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.getInvolvedSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  { title: t.becomeMember, desc: t.becomeMemberDesc, href: '/membership', icon: UserPlus },
                  { title: t.volunteer, desc: t.volunteerDesc, href: '/contact', icon: HandHeart },
                  { title: t.requestAssistance, desc: t.requestAssistanceDesc, href: '/programs', icon: HelpCircle },
                ].map(item => (
                  <Card key={item.href} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col p-4 bg-card">
                      <CardHeader className="pt-8">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                              <item.icon className="h-10 w-10" />
                          </div>
                          <CardTitle className="font-headline pt-6 text-2xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                          <p className="text-muted-foreground text-base flex-grow">{item.desc}</p>
                           <div className="mt-6">
                             <Button variant="outline" asChild className="text-base rounded-full font-semibold">
                                <Link href={item.href}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                            </Button>
                           </div>
                      </CardContent>
                  </Card>
                ))}
            </div>
        </FadeIn>
      </section>

      {/* Programs Section */}
      <section className="py-20 lg:py-28 bg-background">
        <FadeIn className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
             <SectionBadge>{t.corePrograms}</SectionBadge>
             {isContentLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.coreProgramsHeading}</h2>}
             {isContentLoading ? <Skeleton className="h-7 w-3/4 mx-auto mt-4" /> : <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.programsSubtitle}</p>}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {programIcons.map((program) => (
              <Card key={program.id} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col p-4">
                <CardHeader className="pt-8">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <program.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="font-headline pt-6 text-2xl">{language === 'ar' ? program.titleAr : program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-base flex-grow">{(language === 'ar' ? program.descriptionAr : program.description).substring(0, 120)}...</p>
                  <div className="mt-6">
                    <Button variant="outline" asChild className="text-base rounded-full font-semibold">
                        <Link href={`/programs#${program.id}`}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full font-semibold">
              <Link href="/programs">{t.viewAllPrograms}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Donation CTA Banner */}
      <section className="bg-primary text-primary-foreground py-20">
        <FadeIn className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl text-white">{t.ctaBannerTitle}</h2>
            <div className="mt-8">
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-white rounded-full font-semibold">
                  <Link href="/donate" className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    {t.ctaBannerButton}
                  </Link>
                </Button>
            </div>
        </FadeIn>
      </section>
    </div>
  );
}
