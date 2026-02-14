'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminSubmissionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">View Submissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            View messages and inquiries submitted through the website's contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section is under construction. Soon you'll be able to view all contact submissions here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
