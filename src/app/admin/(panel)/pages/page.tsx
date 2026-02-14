'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
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

// Define the type based on your backend.json entity
interface PageContent {
  id: string;
  pageIdentifier: string;
  titleEn: string;
  titleAr: string;
  lastUpdated: {
    seconds: number;
    nanoseconds: number;
  } | Date;
}

export default function AdminPagesPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [pageToDelete, setPageToDelete] = useState<PageContent | null>(null);

  const pagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'page_content');
  }, [firestore]);

  const { data: pages, isLoading, error } = useCollection<PageContent>(pagesCollectionRef);

  const handleEdit = (id: string) => {
    // This will be implemented later
    // router.push(`/admin/pages/edit/${id}`);
    alert(`Edit page with ID: ${id}`);
  };

  const handleDelete = async () => {
    if (!pageToDelete || !firestore) return;
    const docRef = doc(firestore, 'page_content', pageToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Page Deleted",
        description: `The page "${pageToDelete.titleEn}" has been deleted.`,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Delete Failed",
        description: "Could not delete the page. Please try again.",
      });
    } finally {
      setPageToDelete(null);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Firestore timestamp can be a Date object or a { seconds, nanoseconds } object
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
        <Button onClick={() => alert('New page functionality coming soon!')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Page
        </Button>
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
                  <TableHead>Title (Arabic)</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages && pages.length > 0 ? (
                  pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Badge variant="outline">{page.pageIdentifier}</Badge>
                      </TableCell>
                      <TableCell>{page.titleEn}</TableCell>
                      <TableCell>{page.titleAr}</TableCell>
                      <TableCell>{formatDate(page.lastUpdated)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(page.id)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setPageToDelete(page)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No page content found.
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
                      This action cannot be undone. This will permanently delete the content for "{pageToDelete?.titleEn}".
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
