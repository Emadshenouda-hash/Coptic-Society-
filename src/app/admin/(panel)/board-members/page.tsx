'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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

  const boardMembersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'board_members');
  }, [firestore]);

  const { data: boardMembers, isLoading, error } = useCollection<BoardMember>(boardMembersCollectionRef);

  const handleEdit = (id: string) => {
    alert(`Edit board member with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Delete board member with ID: ${id}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'PPP');
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Board Members</h1>
        <Button onClick={() => alert('New member functionality coming soon!')}>
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
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} aria-label="Delete">
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
    </div>
  );
}
