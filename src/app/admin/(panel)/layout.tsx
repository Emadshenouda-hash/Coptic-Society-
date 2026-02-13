'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is complete before making a decision.
    if (!isLoading) {
      // If we are done loading and there is no user, redirect to login.
      if (!user) {
        router.replace('/admin/login');
      }
    }
  }, [user, isLoading, router]);

  // While loading, show a spinner.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is finished and we still don't have a user,
  // render nothing while the redirect initiated by the useEffect takes place.
  if (!user) {
    return null;
  }
  
  // If the user is logged in but is NOT an admin, show an "Access Denied" message.
  // This prevents the redirect loop.
  if (!isAdmin) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have the necessary permissions to access this page. Please contact the site administrator if you believe this is an error.
                    </CardDescription>
                </CardHeader>
            </Card>
      </div>
    );
  }

  // If loading is finished and the user is an admin, render the admin panel.
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/50">
        <AdminSidebar />
        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
