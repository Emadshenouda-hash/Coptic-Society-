'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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


interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submissionDate: {
    seconds: number;
    nanoseconds: number;
  } | Date | string;
  isRead: boolean;
}

export default function AdminSubmissionsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [submissionToView, setSubmissionToView] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);

  const submissionsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'contact_submissions');
  }, [firestore]);

  const { data: submissions, isLoading, error } = useCollection<ContactSubmission>(submissionsCollectionRef);

  const handleDelete = async () => {
    if (!submissionToDelete || !firestore) return;
    const docRef = doc(firestore, 'contact_submissions', submissionToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Submission Deleted",
        description: `The message from ${submissionToDelete.fullName} has been deleted.`,
      });
    } catch (e) {
       toast({
        variant: 'destructive',
        title: "Delete Failed",
        description: "Could not delete the submission. Please try again."
      });
    } finally {
        setSubmissionToDelete(null);
    }
  };

  const toggleReadStatus = async (submission: ContactSubmission) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'contact_submissions', submission.id);
    try {
      await updateDoc(docRef, { isRead: !submission.isRead });
      toast({
        title: "Status Updated",
        description: `Submission from ${submission.fullName} marked as ${!submission.isRead ? 'read' : 'unread'}.`
      })
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Update Failed",
        description: "Could not update the submission status."
      })
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    try {
        return format(date, 'PPP p');
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">View Submissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            View messages and inquiries submitted through the website's contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading submissions: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions && submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission.id} className={!submission.isRead ? 'font-bold' : ''}>
                      <TableCell>{formatDate(submission.submissionDate)}</TableCell>
                      <TableCell>{submission.fullName}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell>
                        <Badge variant={submission.isRead ? 'secondary' : 'default'}>
                            {submission.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => toggleReadStatus(submission)} aria-label="Toggle read status">
                          {submission.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSubmissionToView(submission)} aria-label="View message">
                           <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSubmissionToDelete(submission)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No submissions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!submissionToView} onOpenChange={(isOpen) => !isOpen && setSubmissionToView(null)}>
        <DialogContent>
            {submissionToView && (
                <>
                    <DialogHeader>
                        <DialogTitle>{submissionToView.subject}</DialogTitle>
                        <DialogDescription>From: {submissionToView.fullName} ({submissionToView.email})</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 whitespace-pre-wrap text-sm text-muted-foreground">{submissionToView.message}</div>
                </>
            )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!submissionToDelete} onOpenChange={(isOpen) => !isOpen && setSubmissionToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the submission from {submissionToDelete?.fullName}.
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
