'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { BoardMemberForm, BoardMemberFormData } from '@/components/admin/board-member-form';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EditBoardMemberPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const memberRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'board_members', id as string);
  }, [firestore, id]);

  const { data: member, isLoading } = useDoc<BoardMemberFormData>(memberRef);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!member) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Board Member Not Found</CardTitle>
                <CardDescription>
                    The requested board member could not be found. It may have been deleted.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Board Member</h1>
            <p className="text-muted-foreground">Modify the details for {member.nameEn}.</p>
        </div>
        <BoardMemberForm initialData={member} docId={id as string} />
    </div>
  );
}
