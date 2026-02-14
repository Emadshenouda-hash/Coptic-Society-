'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDocumentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Documents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Official Documents</CardTitle>
          <CardDescription>
            Upload and manage official documents like bylaws and annual reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to manage all official documents here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
