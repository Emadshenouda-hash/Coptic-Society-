'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PostForm, PostFormData } from '@/components/admin/post-form';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EditPostPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const postRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'posts', id as string);
  }, [firestore, id]);

  const { data: post, isLoading } = useDoc<PostFormData>(postRef);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Post Not Found</CardTitle>
                <CardDescription>
                    The requested post could not be found. It may have been deleted.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground">Modify the details for "{post.titleEn}".</p>
        </div>
        <PostForm initialData={post} docId={id as string} />
    </div>
  );
}
