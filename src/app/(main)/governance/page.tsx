'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { Users, Shield } from 'lucide-react';
import { useEffect } from 'react';

const translations = {
  en: {
    title: 'Governance',
    description: 'Understand the governance structure of the Grand Coptic Benevolent Society, including the roles of the General Assembly and the Board of Directors.',
    pageTitle: 'Our Governance',
    pageSubtitle: 'Our society is built on a foundation of transparency, accountability, and volunteer leadership.',
    generalAssembly: 'The General Assembly',
    generalAssemblyDesc: 'The General Assembly is the supreme authority of the society and is composed of all active members who have fulfilled their obligations. It convenes annually to ensure the society remains true to its mission.',
    keyDuties: 'Key Duties:',
    generalAssemblyDuties: [
      'Electing the Board of Directors every four years.',
      'Approving the annual budget and final accounts.',
      'Setting the society\'s general policies and strategic direction.',
      'Overseeing the work of the Board and various committees.',
      'Amending the society\'s bylaws when necessary.',
    ],
    boardOfDirectors: 'The Board of Directors',
    boardOfDirectorsDesc: 'The Board of Directors is elected by the General Assembly and is responsible for managing the society\'s day-to-day affairs and implementing its policies. The board consists of dedicated members who serve on a voluntary basis.',
    boardOfDirectorsDuties: [
      'Managing assets and properties of the society.',
      'Forming committees to oversee specific programs.',
      'Preparing budgets and activity reports for the General Assembly.',
      'Representing the society in all administrative and legal matters.',
      'Appointing and supervising staff.',
    ],
    orgStructure: 'Organizational Structure',
    orgStructureDesc: 'Our structure ensures democratic oversight and efficient management.',
    gaNode: 'General Assembly',
    gaNodeDesc: '(All Active Members)',
    bodNode: 'Board of Directors',
    bodNodeDesc: '(Elected by General Assembly)',
    committeesNode: 'Executive Committees',
    committeesNodeDesc: '(e.g., Health, Education)',
    staffNode: 'Staff & Volunteers',
    staffNodeDesc: '(Operational Teams)',
  },
  ar: {
    title: 'الحوكمة',
    description: 'تعرف على هيكل حوكمة الجمعية القبطية الخيرية الكبرى، بما في ذلك أدوار الجمعية العمومية ومجلس الإدارة.',
    pageTitle: 'حوكمتنا',
    pageSubtitle: 'تقوم جمعيتنا على أساس الشفافية والمساءلة والقيادة التطوعية.',
    generalAssembly: 'الجمعية العمومية',
    generalAssemblyDesc: 'الجمعية العمومية هي السلطة العليا للجمعية وتتكون من جميع الأعضاء العاملين الذين أوفوا بالتزاماتهم. تجتمع سنوياً لضمان بقاء الجمعية وفية لرسالتها.',
    keyDuties: 'الواجبات الرئيسية:',
    generalAssemblyDuties: [
      'انتخاب مجلس الإدارة كل أربع سنوات.',
      'الموافقة على الميزانية السنوية والحسابات الختامية.',
      'وضع السياسات العامة للجمعية وتوجهها الاستراتيجي.',
      'الإشراف على عمل المجلس واللجان المختلفة.',
      'تعديل النظام الأساسي للجمعية عند الضرورة.',
    ],
    boardOfDirectors: 'مجلس الإدارة',
    boardOfDirectorsDesc: 'ينتخب مجلس الإدارة من قبل الجمعية العمومية وهو مسؤول عن إدارة الشؤون اليومية للجمعية وتنفيذ سياساتها. يتكون المجلس من أعضاء متفانين يخدمون على أساس طوعي.',
    boardOfDirectorsDuties: [
      'إدارة أصول وممتلكات الجمعية.',
      'تشكيل لجان للإشراف على برامج محددة.',
      'إعداد الميزانيات وتقارير النشاط للجمعية العمومية.',
      'تمثيل الجمعية في جميع المسائل الإدارية والقانونية.',
      'تعيين الموظفين والإشراف عليهم.',
    ],
    orgStructure: 'الهيكل التنظيمي',
    orgStructureDesc: 'يضمن هيكلنا الرقابة الديمقراطية والإدارة الفعالة.',
    gaNode: 'الجمعية العمومية',
    gaNodeDesc: '(جميع الأعضاء العاملين)',
    bodNode: 'مجلس الإدارة',
    bodNodeDesc: '(منتخب من الجمعية العمومية)',
    committeesNode: 'اللجان التنفيذية',
    committeesNodeDesc: '(مثل الصحة، التعليم)',
    staffNode: 'الموظفون والمتطوعون',
    staffNodeDesc: '(الفرق التشغيلية)',
  }
};

export default function GovernancePage() {
  const { language, direction } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    document.title = `${t.title} | ${language === 'en' ? 'Grand Coptic Benevolent Society' : 'الجمعية القبطية الخيرية الكبرى'}`;
  }, [t.title, language]);

  return (
    <div className="bg-background" dir={direction}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">{t.pageTitle}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                <Users className="h-6 w-6 text-accent" />
                {t.generalAssembly}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground" dir={direction}>
              <p>{t.generalAssemblyDesc}</p>
              <strong>{t.keyDuties}</strong>
              <ul>
                {t.generalAssemblyDuties.map(duty => <li key={duty}>{duty}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                <Shield className="h-6 w-6 text-accent" />
                {t.boardOfDirectors}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground" dir={direction}>
              <p>{t.boardOfDirectorsDesc}</p>
              <strong>{t.keyDuties}</strong>
              <ul>
                {t.boardOfDirectorsDuties.map(duty => <li key={duty}>{duty}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="font-headline text-3xl md:text-4xl text-primary">{t.orgStructure}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
            {t.orgStructureDesc}
          </p>
          <div className="mt-12 flex flex-col items-center">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-lg w-72">
                <h3 className="font-bold font-headline">{t.gaNode}</h3>
                <p className="text-sm">{t.gaNodeDesc}</p>
            </div>
            <div className="h-12 w-px bg-border my-2"></div>
             <div className="p-4 bg-secondary rounded-lg shadow-md w-72">
                <h3 className="font-bold font-headline">{t.bodNode}</h3>
                <p className="text-sm">{t.bodNodeDesc}</p>
            </div>
            <div className="h-12 w-px bg-border my-2"></div>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="p-3 bg-card border rounded-lg shadow-sm w-56">
                <h3 className="font-bold font-headline">{t.committeesNode}</h3>
                <p className="text-sm">{t.committeesNodeDesc}</p>
              </div>
              <div className="p-3 bg-card border rounded-lg shadow-sm w-56">
                <h3 className="font-bold font-headline">{t.staffNode}</h3>
                <p className="text-sm">{t.staffNodeDesc}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
