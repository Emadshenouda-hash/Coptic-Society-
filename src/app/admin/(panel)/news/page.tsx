'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

interface Post {
  id: string;
  titleEn: string;
  titleAr: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  } | Date | string;
}

export default function AdminNewsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const postsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'posts');
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsCollectionRef);

  const handleEdit = (id: string) => {
    router.push(`/admin/news/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!postToDelete || !firestore) return;
    const docRef = doc(firestore, 'posts', postToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Post Deleted",
        description: `The post "${postToDelete.titleEn}" has been deleted.`,
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
        description: "Could not delete the post. You may not have the required permissions.",
      });
    } finally {
      setPostToDelete(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    try {
        return format(date, 'PPP');
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage News</h1>
        <Button onClick={() => router.push('/admin/news/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Post
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>News & Updates</CardTitle>
          <CardDescription>
            Create, edit, and manage news articles and announcements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading posts: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (English)</TableHead>
                  <TableHead>Title (Arabic)</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.titleEn}</TableCell>
                      <TableCell>{post.titleAr}</TableCell>
                      <TableCell>{formatDate(post.publishDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(post.id)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setPostToDelete(post)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!postToDelete} onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the post titled "{postToDelete?.titleEn}".
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
