'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminProgramsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Programs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Charitable Programs</CardTitle>
          <CardDescription>
            Add, edit, and manage the society's programs and initiatives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to manage all programs here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
