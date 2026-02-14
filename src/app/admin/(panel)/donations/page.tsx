'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDonationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">View Donations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Donation Records</CardTitle>
          <CardDescription>
            View a list of all donations made through the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to view all donation records here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
