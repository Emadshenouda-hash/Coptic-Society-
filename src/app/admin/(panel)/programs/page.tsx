'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, Wand2 } from 'lucide-react';
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
import { FirestorePermissionError } from '@/firebase/errors';
import { programs as staticPrograms } from '@/lib/content';
import { Program as StaticProgramType } from '@/lib/definitions';


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
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const programsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'programs');
  }, [firestore]);

  const { data: firestorePrograms, isLoading, error } = useCollection<Program>(programsCollectionRef);

  const displayPrograms = useMemo(() => {
    return staticPrograms.map(staticProgram => {
        const firestoreProgram = firestorePrograms?.find(p => p.id === staticProgram.id);
        return {
            ...staticProgram,
            existsInDb: !!firestoreProgram,
        };
    });
  }, [firestorePrograms]);

  const handleEdit = (id: string) => {
    alert(`Edit program with ID: ${id}`);
  };

  const handleCreate = async (program: StaticProgramType) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Database not available." });
      return;
    }
    
    setIsCreating(program.id);
    try {
        const docRef = doc(firestore, 'programs', program.id);
        const dataToSet = {
            nameEn: program.title,
            nameAr: program.titleAr,
            shortDescriptionEn: program.description,
            shortDescriptionAr: program.descriptionAr,
            fullDescriptionEn: program.description,
            fullDescriptionAr: program.descriptionAr,
            iconName: program.iconName,
            imageUrl: `https://picsum.photos/seed/${program.id}/800/600`,
            galleryImageUrls: [],
        };

        await setDoc(docRef, dataToSet);

        toast({
            title: "Program Created",
            description: `The program "${program.title}" has been created. You can now edit it.`,
        });
    } catch (e: any) {
        console.error("Create failed:", e);
        const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: `programs/${program.id}`,
            requestResourceData: { programId: program.id }
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({
            variant: 'destructive',
            title: "Creation Failed",
            description: e.message || "Could not create program.",
        });
    } finally {
        setIsCreating(null);
    }
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
      console.error("Delete failed:", e);
      const contextualError = new FirestorePermissionError({
        operation: 'delete',
        path: docRef.path
      });
      errorEmitter.emit('permission-error', contextualError);
      toast({
        variant: 'destructive',
        title: "Delete Failed",
        description: "Could not delete the program. You may not have the required permissions.",
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
                  <TableHead>Icon Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayPrograms && displayPrograms.length > 0 ? (
                  displayPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>{program.title}</TableCell>
                      <TableCell><Badge variant="secondary">{program.iconName}</Badge></TableCell>
                      <TableCell className="text-right">
                        {program.existsInDb ? (
                            <>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(program.id)} aria-label="Edit">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setProgramToDelete({ id: program.id, nameEn: program.title, nameAr: program.titleAr, iconName: program.iconName })} aria-label="Delete">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isCreating === program.id}
                                onClick={() => handleCreate(program)}
                            >
                                {isCreating === program.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Create in DB
                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No static programs found to manage.
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