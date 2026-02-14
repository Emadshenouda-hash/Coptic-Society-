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

interface BoardMember {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  termStartDate: string;
  termEndDate: string;
}

export default function AdminBoardMembersPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [memberToDelete, setMemberToDelete] = useState<BoardMember | null>(null);

  const boardMembersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'board_members');
  }, [firestore]);

  const { data: boardMembers, isLoading, error } = useCollection<BoardMember>(boardMembersCollectionRef);

  const handleEdit = (id: string) => {
    router.push(`/admin/board-members/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!memberToDelete || !firestore) return;
    const docRef = doc(firestore, 'board_members', memberToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Board Member Deleted",
        description: `The profile for "${memberToDelete.nameEn}" has been deleted.`,
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
        description: "Could not delete the board member. You may not have the required permissions.",
      });
    } finally {
      setMemberToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        // Assuming date is stored as 'YYYY-MM-DD' string, needs to be handled by Date constructor
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return format(date, 'PPP');
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Board Members</h1>
        <Button onClick={() => router.push('/admin/board-members/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Board of Directors</CardTitle>
          <CardDescription>
            Add, edit, and manage the profiles of board members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading board members: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (English)</TableHead>
                  <TableHead>Title (English)</TableHead>
                  <TableHead>Term Start</TableHead>
                  <TableHead>Term End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardMembers && boardMembers.length > 0 ? (
                  boardMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.nameEn}</TableCell>
                      <TableCell>{member.titleEn}</TableCell>
                      <TableCell>{formatDate(member.termStartDate)}</TableCell>
                      <TableCell>{formatDate(member.termEndDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member.id)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setMemberToDelete(member)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No board members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!memberToDelete} onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this member?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the profile for "{memberToDelete?.nameEn}".
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
