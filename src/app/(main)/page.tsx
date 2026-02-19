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
    learnMore: 'Learn More About Our Story',
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
    learnMore: 'اعرف المزيد عن قصتنا',
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
    const content = language === 'ar' 
        ? { ...fallback, ...(dbContent.contentAr || {}) }
        : { ...fallback, ...(dbContent.contentEn || {}) };
    return content;
  }, [dynamicContent, language]);
  
  useEffect(() => {
    document.title = `${language === 'en' ? 'Home' : 'الرئيسية'} | Grand Coptic Benevolent Society`;
  }, [language]);


  return (
    <div className="flex-1" dir={direction}>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-75"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            {isContentLoading ? (
                <div className='space-y-4'>
                    <Skeleton className="h-20 w-full max-w-4xl mx-auto bg-primary-foreground/20" />
                    <Skeleton className="h-8 w-full max-w-2xl mx-auto bg-primary-foreground/20" />
                </div>
            ) : (
                <>
                    <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-white shadow-lg">
                        {t.heroTitle}
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-white/90">
                        {t.heroSubtitle}
                    </p>
                </>
            )}
            <div className="mt-10">
              <Button size="lg" asChild className="text-lg px-10 py-6 bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-white">
                <Link href="/about">{t.learnMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Involved Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.getInvolved}</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.getInvolvedSubtitle}</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  { title: t.becomeMember, desc: t.becomeMemberDesc, href: '/membership', icon: UserPlus },
                  { title: t.volunteer, desc: t.volunteerDesc, href: '/contact', icon: HandHeart },
                  { title: t.requestAssistance, desc: t.requestAssistanceDesc, href: '/programs', icon: HelpCircle },
                ].map(item => (
                  <Card key={item.href} className="text-center transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col p-4">
                      <CardHeader className="pt-8">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                              <item.icon className="h-10 w-10" />
                          </div>
                          <CardTitle className="font-headline pt-6 text-2xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                          <p className="text-muted-foreground text-base flex-grow">{item.desc}</p>
                           <div className="mt-6">
                             <Button variant="outline" asChild className="text-base">
                                <Link href={item.href}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                            </Button>
                           </div>
                      </CardContent>
                  </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
             {isContentLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : <h2 className="font-headline text-4xl md:text-5xl text-primary">{t.corePrograms}</h2>}
             {isContentLoading ? <Skeleton className="h-7 w-3/4 mx-auto mt-4" /> : <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t.programsSubtitle}</p>}
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {programIcons.map((program) => (
              <Card key={program.id} className="text-center transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col p-4">
                <CardHeader className="pt-8">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <program.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="font-headline pt-6 text-2xl">{language === 'ar' ? program.titleAr : program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-base flex-grow">{(language === 'ar' ? program.descriptionAr : program.description).substring(0, 120)}...</p>
                  <div className="mt-6">
                    <Button variant="outline" asChild className="text-base">
                        <Link href={`/programs#${program.id}`}>{t.readMore} <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-10 py-6">
              <Link href="/programs">{t.viewAllPrograms}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
