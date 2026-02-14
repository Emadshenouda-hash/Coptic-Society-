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

// This is the static content that we will use to seed the database.
// In a real app, this might come from a more centralized content file.
const staticPageContent = {
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
    { id: 'about', title: 'About Us' },
    // { id: 'governance', title: 'Governance' }, // Can add more later
    // { id: 'membership', title: 'Membership' },
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
                  <TableHead>Title (English)</TableHead>
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
