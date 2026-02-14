'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminNewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage News</h1>
      <Card>
        <CardHeader>
          <CardTitle>News & Updates</CardTitle>
          <CardDescription>
            Create, edit, and manage news articles and announcements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to manage all news posts here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
