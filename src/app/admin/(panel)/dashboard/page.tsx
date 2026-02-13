'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/use-admin-auth';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.displayName || user?.email || 'Admin'}!</CardTitle>
            <CardDescription>
              This is your admin dashboard. You can manage all website content from the sidebar menu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Select a section from the navigation to begin editing.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
