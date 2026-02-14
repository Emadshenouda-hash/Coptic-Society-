'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ProgramForm, ProgramFormData } from '@/components/admin/program-form';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EditProgramPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const programRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'programs', id as string);
  }, [firestore, id]);

  const { data: program, isLoading } = useDoc<ProgramFormData>(programRef);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!program) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Program Not Found</CardTitle>
                <CardDescription>
                    The requested program could not be found. It may have been deleted.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Program</h1>
            <p className="text-muted-foreground">Modify the details for "{program.nameEn}".</p>
        </div>
        <ProgramForm initialData={program} docId={id as string} />
    </div>
  );
}
