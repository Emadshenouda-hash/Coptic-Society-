'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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

interface Document {
  id: string;
  titleEn: string;
  titleAr: string;
  category: string;
  documentUrl: string;
  uploadDate: {
    seconds: number;
    nanoseconds: number;
  } | Date | string;
}

export default function AdminDocumentsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  const documentsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'documents');
  }, [firestore]);

  const { data: documents, isLoading, error } = useCollection<Document>(documentsCollectionRef);

  const handleEdit = (id: string) => {
    alert(`Edit document with ID: ${id}`);
  };

  const handleDelete = async () => {
    if (!docToDelete || !firestore) return;
    const docRef = doc(firestore, 'documents', docToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Document Deleted",
        description: `The document "${docToDelete.titleEn}" has been deleted.`,
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
        description: "Could not delete the document. You may not have the required permissions.",
      });
    } finally {
      setDocToDelete(null);
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
        <h1 className="text-3xl font-bold">Manage Documents</h1>
        <Button onClick={() => alert('New document functionality coming soon!')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Official Documents</CardTitle>
          <CardDescription>
            Upload and manage official documents like bylaws and annual reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading documents: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (English)</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents && documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.titleEn}</TableCell>
                      <TableCell><Badge>{doc.category}</Badge></TableCell>
                      <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={doc.documentUrl} target="_blank" rel="noopener noreferrer" aria-label="View document">
                                <LinkIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(doc.id)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDocToDelete(doc)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!docToDelete} onOpenChange={(isOpen) => !isOpen && setDocToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the document titled "{docToDelete?.titleEn}".
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
