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

interface Program {
  id: string;
  nameEn: string;
  nameAr: string;
  iconName: string;
}

export default function AdminProgramsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const programsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'programs');
  }, [firestore]);

  const { data: programs, isLoading, error } = useCollection<Program>(programsCollectionRef);

  const handleEdit = (id: string) => {
    alert(`Edit program with ID: ${id}`);
  };

  const handleDelete = async () => {
    if (!programToDelete || !firestore) return;
    const docRef = doc(firestore, 'programs', programToDelete.id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Program Deleted",
        description: `The program "${programToDelete.nameEn}" has been deleted.`,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Delete Failed",
        description: "Could not delete the program. Please try again.",
      });
    } finally {
      setProgramToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Programs</h1>
        <Button onClick={() => alert('New program functionality coming soon!')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Program
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Charitable Programs</CardTitle>
          <CardDescription>
            Add, edit, and manage the society's programs and initiatives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">Error loading programs: {error.message}</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (English)</TableHead>
                  <TableHead>Name (Arabic)</TableHead>
                  <TableHead>Icon Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs && programs.length > 0 ? (
                  programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>{program.nameEn}</TableCell>
                      <TableCell>{program.nameAr}</TableCell>
                      <TableCell><Badge variant="secondary">{program.iconName}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(program.id)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setProgramToDelete(program)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No programs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!programToDelete} onOpenChange={(isOpen) => !isOpen && setProgramToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this program?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the program titled "{programToDelete?.nameEn}".
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
