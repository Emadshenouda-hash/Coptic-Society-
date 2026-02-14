'use client';

import { BoardMemberForm } from '@/components/admin/board-member-form';

export default function NewBoardMemberPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Add New Board Member</h1>
            <p className="text-muted-foreground">Fill out the form to add a new member to the board.</p>
        </div>
        <BoardMemberForm />
    </div>
  );
}
