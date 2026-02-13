'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { useEffect } from 'react';

const translations = {
  en: {
    title: 'Membership',
    description: 'Learn how to become a member of the Grand Coptic Benevolent Society and join our mission to serve the community.',
    pageTitle: 'Join Our Mission',
    pageSubtitle: 'Become a member of the Grand Coptic Benevolent Society and be part of a legacy of compassion and service that spans over a century.',
    eligibility: 'Eligibility Criteria',
    eligibilityIntro: 'To become a member, an individual must meet the following criteria:',
    eligibilityCriteria: [
      'Be of Egyptian nationality.',
      'Have full legal capacity to make decisions.',
      'Possess a good reputation and be of good conduct.',
      'Have no criminal record or convictions for crimes affecting honor or integrity.',
      'Commit to upholding the society\'s bylaws and regulations.',
      'Commit to paying the prescribed membership fees.',
    ],
    rightsObligations: 'Member Rights & Obligations',
    rightsObligationsIntro: 'Members are the backbone of our society and enjoy certain rights while being expected to fulfill key obligations.',
    rights: 'Rights:',
    rightsList: [
      'Attend General Assembly meetings.',
      'Vote on decisions and in elections.',
      'Run for a position on the Board of Directors.',
      'Participate in the society\'s activities and programs.',
    ],
    obligations: 'Obligations:',
    obligationsList: [
      'Pay annual membership fees on time.',
      'Actively participate in achieving the society\'s goals.',
      'Adhere to the bylaws and decisions made by the General Assembly and Board.',
    ],
    termination: 'Termination of Membership',
    terminationIntro: 'Membership may be terminated under the following circumstances:',
    terminationReasons: [
      'Formal resignation submitted to the Board of Directors.',
      'Death of the member.',
      'Failure to pay membership fees for a full year after being notified.',
      'Conduct that causes serious material or moral damage to the society.',
    ],
    applyTitle: 'Ready to Apply?',
    applyDescription: 'The application process is simple. Interested individuals can download the membership form, fill it out, and submit it at our headquarters.',
    applyButton: 'Contact Us for Application Details',
  },
  ar: {
    title: 'العضوية',
    description: 'تعرف على كيفية أن تصبح عضوًا في الجمعية القبطية الخيرية الكبرى والانضمام إلى مهمتنا في خدمة المجتمع.',
    pageTitle: 'انضم إلى رسالتنا',
    pageSubtitle: 'كن عضوا في الجمعية القبطية الخيرية الكبرى وكن جزءا من إرث من الرحمة والخدمة يمتد لأكثر من قرن.',
    eligibility: 'شروط الأهلية',
    eligibilityIntro: 'لكي يصبح الفرد عضوا، يجب أن يستوفي المعايير التالية:',
    eligibilityCriteria: [
      'أن يكون مصري الجنسية.',
      'أن يتمتع بالأهلية القانونية الكاملة لاتخاذ القرارات.',
      'أن يتمتع بسمعة طيبة وسلوك حسن.',
      'ألا يكون لديه سجل جنائي أو إدانات في جرائم مخلة بالشرف أو الأمانة.',
      'الالتزام بدعم النظام الأساسي للجمعية ولوائحها.',
      'الالتزام بسداد رسوم العضوية المقررة.',
    ],
    rightsObligations: 'حقوق والتزامات العضو',
    rightsObligationsIntro: 'الأعضاء هم العمود الفقري لجمعيتنا ويتمتعون بحقوق معينة بينما يُتوقع منهم الوفاء بالالتزامات الرئيسية.',
    rights: 'الحقوق:',
    rightsList: [
      'حضور اجتماعات الجمعية العمومية.',
      'التصويت على القرارات وفي الانتخابات.',
      'الترشح لمنصب في مجلس الإدارة.',
      'المشاركة في أنشطة وبرامج الجمعية.',
    ],
    obligations: 'الالتزامات:',
    obligationsList: [
      'دفع رسوم العضوية السنوية في الوقت المحدد.',
      'المشاركة الفعالة في تحقيق أهداف الجمعية.',
      'الالتزام بالنظام الأساسي والقرارات الصادرة عن الجمعية العمومية والمجلس.',
    ],
    termination: 'إنهاء العضوية',
    terminationIntro: 'يجوز إنهاء العضوية في الظروف التالية:',
    terminationReasons: [
      'استقالة رسمية مقدمة إلى مجلس الإدارة.',
      'وفاة العضو.',
      'عدم سداد رسوم العضوية لمدة عام كامل بعد إخطاره.',
      'سلوك يسبب ضررا ماديا أو معنويا جسيما للجمعية.',
    ],
    applyTitle: 'هل أنت مستعد للتقديم؟',
    applyDescription: 'عملية التقديم بسيطة. يمكن للأفراد المهتمين تنزيل نموذج العضوية وتعبئته وتقديمه في مقرنا.',
    applyButton: 'اتصل بنا للحصول على تفاصيل الطلب',
  }
};

export default function MembershipPage() {
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

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
             <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-xl">{t.eligibility}</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>{t.eligibilityIntro}</p>
                  <ul>
                    {t.eligibilityCriteria.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-headline text-xl">{t.rightsObligations}</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>{t.rightsObligationsIntro}</p>
                  <strong>{t.rights}</strong>
                   <ul>
                    {t.rightsList.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <strong>{t.obligations}</strong>
                   <ul>
                    {t.obligationsList.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-headline text-xl">{t.termination}</AccordionTrigger>
                <AccordionContent className="prose max-w-none text-muted-foreground">
                  <p>{t.terminationIntro}</p>
                   <ul>
                    {t.terminationReasons.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="md:col-span-2">
            <Card className="bg-secondary sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{t.applyTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {t.applyDescription}
                </p>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/contact">{t.applyButton}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
