
'use client';

import { AdminLoginForm } from '@/components/auth/admin-login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
       <div className="mb-8 text-center">
        <h1 className="font-amiri text-5xl font-bold text-primary" lang="ar">الجمعية القبطية الخيرية الكبرى</h1>
        <p className="font-montserrat text-xl font-bold uppercase tracking-wider text-primary">The Grand Coptic Benevolent Society</p>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Panel Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
