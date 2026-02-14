'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PageContentForm } from '@/components/admin/page-content-form';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EditPageContentPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const pageContentRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'page_content', id as string);
  }, [firestore, id]);

  const { data: pageContent, isLoading } = useDoc(pageContentRef);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!pageContent) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Page Content Not Found</CardTitle>
                <CardDescription>
                    The content for page "{id}" could not be found. You may need to create it first in Firestore.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Page Content: <span className="text-primary">{id}</span></h1>
            <p className="text-muted-foreground">Modify the text content for this page below.</p>
        </div>
        <PageContentForm initialData={pageContent} docId={id as string} />
    </div>
  );
}

    