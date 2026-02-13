'use client';

import { DonateForm } from "@/components/donate-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { DollarSign, Heart, Utensils } from "lucide-react";
import { useEffect } from "react";

const translations = {
  en: {
    title: 'Donate',
    description: 'Support the Grand Coptic Benevolent Society with your donation and help us continue our mission of serving the community.',
    pageTitle: 'Your Support, Their Future',
    pageSubtitle: 'Every donation, no matter the size, contributes directly to our programs and brings hope to those in need. Join us in making a lasting impact.',
    impactTitle: 'See Your Impact',
    impactItems: [
      {
          icon: Utensils,
          amount: '$25',
          description: 'can provide a food basket for a family for a week.'
      },
      {
          icon: Heart,
          amount: '$50',
          description: 'can cover the cost of a medical check-up and essential medicines.'
      },
      {
          icon: DollarSign,
          amount: '$100',
          description: 'can support a student with school supplies for a year.'
      }
    ]
  },
  ar: {
    title: 'تبرع',
    description: 'ادعم الجمعية القبطية الخيرية الكبرى بتبرعك وساعدنا على مواصلة مهمتنا في خدمة المجتمع.',
    pageTitle: 'دعمكم هو مستقبلهم',
    pageSubtitle: 'كل تبرع، مهما كان حجمه، يساهم بشكل مباشر في برامجنا ويجلب الأمل للمحتاجين. انضم إلينا في إحداث تأثير دائم.',
    impactTitle: 'شاهد تأثيرك',
    impactItems: [
      {
          icon: Utensils,
          amount: '٢٥ دولار',
          description: 'يمكن أن توفر سلة غذائية لأسرة لمدة أسبوع.'
      },
      {
          icon: Heart,
          amount: '٥٠ دولار',
          description: 'يمكن أن تغطي تكلفة فحص طبي وأدوية أساسية.'
      },
      {
          icon: DollarSign,
          amount: '١٠٠ دولار',
          description: 'يمكن أن تدعم طالبًا باللوازم المدرسية لمدة عام.'
      }
    ]
  }
}

export default function DonatePage() {
  const { language, direction } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-secondary" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
              <p className="text-lg text-muted-foreground">
                {t.pageSubtitle}
              </p>
            </div>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{t.impactTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.impactItems.map(item => (
                    <div key={item.amount} className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-foreground"><strong className="font-semibold">{item.amount}</strong> {item.description}</p>
                        </div>
                    </div>
                ))}
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
