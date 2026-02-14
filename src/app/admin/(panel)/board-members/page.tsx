'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminBoardMembersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Board Members</h1>
      <Card>
        <CardHeader>
          <CardTitle>Board of Directors</CardTitle>
          <CardDescription>
            Add, edit, and manage the profiles of board members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to manage all board member profiles here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
