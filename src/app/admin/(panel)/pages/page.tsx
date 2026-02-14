'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Edit, Trash2, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FirestorePermissionError } from '@/firebase/errors';

const staticPageContent = {
    home: {
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
    },
    about: {
        en: {
            title: 'About Us',
            description: 'Learn about the history, mission, and vision of the Grand Coptic Benevolent Society, founded in 1881.',
            pageTitle: 'Our Story of Service',
            pageSubtitle: 'Founded in 1881, the Grand Coptic Benevolent Society has a long and proud history of compassionate service and community building.',
            mission: 'Our Mission',
            missionText: 'To serve needy families of all backgrounds, enhance social justice and dignity, and promote cultural, scientific, and religious awareness. We are a charitable, non-profit organisation committed to making a tangible difference in the lives of the most vulnerable.',
            vision: 'Our Vision',
            visionText: 'We envision a society where every individual has the opportunity to live a life of dignity, health, and purpose. We strive to be a leading force in combating poverty and illiteracy, working hand-in-hand with communities to build a brighter, more equitable future for all Egyptians.',
            registration: 'Official Registration',
            registrationText: 'The Grand Coptic Benevolent Society (الجمعية القبطية الخيرية الكبرى) is officially registered in Cairo under registration number 1080 on April 29, 1967. Our headquarters are located at 175 Ramsis Street, Cairo, with branches across Egypt.',
        },
        ar: {
            title: 'من نحن',
            description: 'تعرف على تاريخ ورسالة ورؤية الجمعية القبطية الخيرية الكبرى التي تأسست عام 1881.',
            pageTitle: 'قصتنا في الخدمة',
            pageSubtitle: 'تأسست الجمعية القبطية الخيرية الكبرى عام 1881، ولها تاريخ طويل ومشرف من الخدمة الرحيمة وبناء المجتمع.',
            mission: 'رسالتنا',
            missionText: 'خدمة الأسر المحتاجة من جميع الخلفيات، وتعزيز العدالة الاجتماعية والكرامة، ونشر الوعي الثقافي والعلمي والديني. نحن منظمة خيرية غير ربحية ملتزمة بإحداث فرق ملموس في حياة الفئات الأكثر ضعفًا.',
            vision: 'رؤيتنا',
            visionText: 'نتطلع إلى مجتمع يتمتع فيه كل فرد بفرصة العيش بكرامة وصحة وهدف. نسعى جاهدين لنكون قوة رائدة في مكافحة الفقر والأمية، ونعمل جنبًا إلى جنب مع المجتمعات لبناء مستقبل أكثر إشراقًا وإنصافًا لجميع المصريين.',
            registration: 'التسجيل الرسمي',
            registrationText: 'الجمعية القبطية الخيرية الكبرى مسجلة رسميًا في القاهرة برقم 1080 بتاريخ 29 أبريل 1967. يقع مقرنا الرئيسي في 175 شارع رمسيس، القاهرة، ولدينا فروع في جميع أنحاء مصر.',
        }
    },
    programs: {
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
    },
    governance: {
        en: {
            title: 'Governance',
            description: 'Understand the governance structure of the Grand Coptic Benevolent Society, including the roles of the General Assembly and the Board of Directors.',
            pageTitle: 'Our Governance',
            pageSubtitle: 'Our society is built on a foundation of transparency, accountability, and volunteer leadership.',
            generalAssembly: 'The General Assembly',
            generalAssemblyDesc: 'The General Assembly is the supreme authority of the society and is composed of all active members who have fulfilled their obligations. It convenes annually to ensure the society remains true to its mission.',
            keyDuties: 'Key Duties:',
            generalAssemblyDuties: 'Electing the Board of Directors every four years.\nApproving the annual budget and final accounts.\nSetting the society\'s general policies and strategic direction.\nOverseeing the work of the Board and various committees.\nAmending the society\'s bylaws when necessary.',
            boardOfDirectors: 'The Board of Directors',
            boardOfDirectorsDesc: 'The Board of Directors is elected by the General Assembly and is responsible for managing the society\'s day-to-day affairs and implementing its policies. The board consists of dedicated members who serve on a voluntary basis.',
            boardOfDirectorsDuties: 'Managing assets and properties of the society.\nForming committees to oversee specific programs.\nPreparing budgets and activity reports for the General Assembly.\nRepresenting the society in all administrative and legal matters.\nAppointing and supervising staff.',
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
            generalAssemblyDuties: 'انتخاب مجلس الإدارة كل أربع سنوات.\nالموافقة على الميزانية السنوية والحسابات الختامية.\nوضع السياسات العامة للجمعية وتوجهها الاستراتيجي.\nالإشراف على عمل المجلس واللجان المختلفة.\nتعديل النظام الأساسي للجمعية عند الضرورة.',
            boardOfDirectors: 'مجلس الإدارة',
            boardOfDirectorsDesc: 'ينتخب مجلس الإدارة من قبل الجمعية العمومية وهو مسؤول عن إدارة الشؤون اليومية للجمعية وتنفيذ سياساتها. يتكون المجلس من أعضاء متفانين يخدمون على أساس طوعي.',
            boardOfDirectorsDuties: 'إدارة أصول وممتلكات الجمعية.\nتشكيل لجان للإشراف على برامج محددة.\nإعداد الميزانيات وتقارير النشاط للجمعية العمومية.\nتمثيل الجمعية في جميع المسائل الإدارية والقانونية.\nتعيين الموظفين والإشراف عليهم.',
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
    },
    membership: {
        en: {
            title: 'Membership',
            description: 'Learn how to become a member of the Grand Coptic Benevolent Society and join our mission to serve the community.',
            pageTitle: 'Join Our Mission',
            pageSubtitle: 'Become a member of the Grand Coptic Benevolent Society and be part of a legacy of compassion and service that spans over a century.',
            eligibility: 'Eligibility Criteria',
            eligibilityIntro: 'To become a member, an individual must meet the following criteria:',
            eligibilityCriteria: 'Be of Egyptian nationality.\nHave full legal capacity to make decisions.\nPossess a good reputation and be of good conduct.\nHave no criminal record or convictions for crimes affecting honor or integrity.\nCommit to upholding the society\'s bylaws and regulations.\nCommit to paying the prescribed membership fees.',
            rightsObligations: 'Member Rights & Obligations',
            rightsObligationsIntro: 'Members are the backbone of our society and enjoy certain rights while being expected to fulfill key obligations.',
            rights: 'Rights:',
            rightsList: 'Attend General Assembly meetings.\nVote on decisions and in elections.\nRun for a position on the Board of Directors.\nParticipate in the society\'s activities and programs.',
            obligations: 'Obligations:',
            obligationsList: 'Pay annual membership fees on time.\nActively participate in achieving the society\'s goals.\nAdhere to the bylaws and decisions made by the General Assembly and Board.',
            termination: 'Termination of Membership',
            terminationIntro: 'Membership may be terminated under the following circumstances:',
            terminationReasons: 'Formal resignation submitted to the Board of Directors.\nDeath of the member.\nFailure to pay membership fees for a full year after being notified.\nConduct that causes serious material or moral damage to the society.',
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
            eligibilityCriteria: 'أن يكون مصري الجنسية.\nأن يتمتع بالأهلية القانونية الكاملة لاتخاذ القرارات.\nأن يتمتع بسمعة طيبة وسلوك حسن.\nألا يكون لديه سجل جنائي أو إدانات في جرائم مخلة بالشرف أو الأمانة.\nالالتزام بدعم النظام الأساسي للجمعية ولوائحها.\nالالتزام بسداد رسوم العضوية المقررة.',
            rightsObligations: 'حقوق والتزامات العضو',
            rightsObligationsIntro: 'الأعضاء هم العمود الفقري لجمعيتنا ويتمتعون بحقوق معينة بينما يُتوقع منهم الوفاء بالالتزامات الرئيسية.',
            rights: 'الحقوق:',
            rightsList: 'حضور اجتماعات الجمعية العمومية.\nالتصويت على القرارات وفي الانتخابات.\nالترشح لمنصب في مجلس الإدارة.\nالمشاركة في أنشطة وبرامج الجمعية.',
            obligations: 'الالتزامات:',
            obligationsList: 'دفع رسوم العضوية السنوية في الوقت المحدد.\nالمشاركة الفعالة في تحقيق أهداف الجمعية.\nالالتزام بالنظام الأساسي والقرارات الصادرة عن الجمعية العمومية والمجلس.',
            termination: 'إنهاء العضوية',
            terminationIntro: 'يجوز إنهاء العضوية في الظروف التالية:',
            terminationReasons: 'استقالة رسمية مقدمة إلى مجلس الإدارة.\nوفاة العضو.\nعدم سداد رسوم العضوية لمدة عام كامل بعد إخطاره.\nسلوك يسبب ضررا ماديا أو معنويا جسيما للجمعية.',
            applyTitle: 'هل أنت مستعد للتقديم؟',
            applyDescription: 'عملية التقديم بسيطة. يمكن للأفراد المهتمين تنزيل نموذج العضوية وتعبئته وتقديمه في مقرنا.',
            applyButton: 'اتصل بنا للحصول على تفاصيل الطلب',
          }
    },
    bylaws: {
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
    },
    news: {
        en: {
            title: 'News & Updates',
            description: 'Stay up-to-date with the latest news, events, and announcements from the Grand Coptic Benevolent Society.',
            pageTitle: 'News & Updates',
            pageSubtitle: 'Follow our journey and see the impact of your support through our latest news, events, and announcements.',
            readFullStory: 'Read Full Story',
          },
          ar: {
            title: 'الأخبار والمستجدات',
            description: 'ابق على اطلاع بآخر الأخبار والفعاليات والإعلانات من الجمعية القبطية الخيرية الكبرى.',
            pageTitle: 'الأخبار والمستجدات',
            pageSubtitle: 'تابع رحلتنا وشاهد تأثير دعمكم من خلال آخر أخبارنا وفعالياتنا وإعلاناتنا.',
            readFullStory: 'اقرأ القصة كاملة',
          }
    },
    contact: {
        en: {
            title: 'Contact Us',
            description: 'Get in touch with the Grand Coptic Benevolent Society. Find our address, phone number, and email, or use the contact form to send us a message.',
            pageTitle: 'Get In Touch',
            pageSubtitle: 'We welcome your questions, feedback, and collaboration proposals. Reach out to us through any of the channels below.',
            contactInfo: 'Contact Information',
            headquarters: 'Our Headquarters',
            addressLine1: '175 Ramsis Street, Cairo, Egypt',
            addressLine2: 'P.O. Box 47, Fagalah, Cairo, Egypt',
            phone: 'Phone',
            phone1: '+20 2 591 2234',
            phone2: '+20 2 591 4047',
            email: 'Email',
            emailAddress: 'info@coptic-society.org',
            formTitle: 'Send Us a Message',
          },
          ar: {
            title: 'اتصل بنا',
            description: 'تواصل مع الجمعية القبطية الخيرية الكبرى. ابحث عن عنواننا ورقم هاتفنا وبريدنا الإلكتروني، أو استخدم نموذج الاتصال لإرسال رسالة إلينا.',
            pageTitle: 'تواصل معنا',
            pageSubtitle: 'نرحب بأسئلتكم وملاحظاتكم ومقترحات التعاون. تواصلوا معنا عبر أي من القنوات أدناه.',
            contactInfo: 'معلومات الاتصال',
            headquarters: 'مقرنا الرئيسي',
            addressLine1: '175 شارع رمسيس، القاهرة، مصر',
            addressLine2: 'ص.ب 47، الفجالة، القاهرة، مصر',
            phone: 'الهاتف',
            phone1: '+20 2 591 2234',
            phone2: '+20 2 591 4047',
            email: 'البريد الإلكتروني',
            emailAddress: 'info@coptic-society.org',
            formTitle: 'أرسل لنا رسالة',
          }
    }
};


interface PageContent {
  id: string;
  pageIdentifier: string;
  contentEn: { title: string; [key: string]: string };
  contentAr: { title: string; [key: string]: string };
  lastUpdated?: { seconds: number; nanoseconds: number; } | Date;
}

// These are the static pages we know about and want to make editable.
const KNOWN_PAGES = [
    { id: 'home', title: 'Home Page' },
    { id: 'about', title: 'About Us Page' },
    { id: 'programs', title: 'Programs Page' },
    { id: 'governance', title: 'Governance Page' },
    { id: 'membership', title: 'Membership Page' },
    { id: 'bylaws', title: 'Bylaws Page' },
    { id: 'news', title: 'News Page' },
    { id: 'contact', title: 'Contact Page' },
];

export default function AdminPagesPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [pageToDelete, setPageToDelete] = useState<Partial<PageContent> | null>(null);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const pagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'page_content');
  }, [firestore]);

  const { data: pages, isLoading, error } = useCollection<PageContent>(pagesCollectionRef);

  // Merge known static pages with what's in Firestore
  const displayPages = useMemo(() => {
    return KNOWN_PAGES.map(knownPage => {
        const firestorePage = pages?.find(p => p.id === knownPage.id);
        return {
            ...knownPage,
            existsInDb: !!firestorePage,
            contentEn: firestorePage?.contentEn,
            contentAr: firestorePage?.contentAr,
            lastUpdated: firestorePage?.lastUpdated
        };
    });
  }, [pages]);

  const handleEdit = (id: string) => {
    router.push(`/admin/pages/edit/${id}`);
  };

  const handleCreate = async (pageId: string) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Database not available." });
      return;
    }
    
    // @ts-ignore
    const seedContent = staticPageContent[pageId];
    if (!seedContent) {
        toast({ variant: "destructive", title: `No static content found to seed page "${pageId}".` });
        return;
    }

    setIsCreating(pageId);
    try {
        const docRef = doc(firestore, 'page_content', pageId);
        const dataToSet = {
            pageIdentifier: pageId,
            contentEn: seedContent.en,
            contentAr: seedContent.ar,
            lastUpdated: serverTimestamp(),
        };

        await setDoc(docRef, dataToSet);

        toast({
            title: "Page Content Created",
            description: `The content for "${pageId}" has been created. You can now edit it.`,
        });
        // The useCollection hook will automatically refresh the list
    } catch (e: any) {
        console.error("Create failed:", e);
        const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: `page_content/${pageId}`,
            requestResourceData: { pageIdentifier: pageId }
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({
            variant: 'destructive',
            title: "Creation Failed",
            description: e.message || "Could not create page content.",
        });
    } finally {
        setIsCreating(null);
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete || !firestore || !pageToDelete.id) return;
    const docRef = doc(firestore, 'page_content', pageToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Page Deleted",
        description: `The page "${pageToDelete.id}" has been deleted.`,
      });
    } catch (e) {
      console.error("Delete failed:", e);
      const contextualError = new FirestorePermissionError({
        operation: 'delete',
        path: docRef.path
      });
      errorEmitter.emit('permission-error', contextualError);
      toast({
        variant: 'destructive',
        title: "Delete Failed",
        description: "Could not delete the page. You may not have the required permissions.",
      });
    } finally {
      setPageToDelete(null);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : timestamp;
    try {
        return format(date, 'PPP p');
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Page Content</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Website Pages</CardTitle>
          <CardDescription>
            Edit the content for the static pages on your website like 'About Us' or 'Governance'.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading pages: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Identifier</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayPages && displayPages.length > 0 ? (
                  displayPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Badge variant="outline">{page.id}</Badge>
                      </TableCell>
                      <TableCell>{page.contentEn?.title || page.title}</TableCell>
                      <TableCell>{page.existsInDb ? formatDate(page.lastUpdated) : <Badge variant="secondary">Not Created</Badge>}</TableCell>
                      <TableCell className="text-right">
                        {page.existsInDb ? (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(page.id)} aria-label="Edit">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setPageToDelete(page)} aria-label="Delete">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isCreating === page.id}
                                onClick={() => handleCreate(page.id)}
                            >
                                {isCreating === page.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Create Content
                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No configurable pages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!pageToDelete} onOpenChange={(isOpen) => !isOpen && setPageToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this page content?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the content for the "{pageToDelete?.id}" page.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
