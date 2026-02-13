'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is complete before making a decision.
    if (!isLoading) {
      // If we are done loading and there is no user, or the user is not an admin, redirect to login.
      if (!user || !isAdmin) {
        router.replace('/admin/login');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  // While loading, show a spinner.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is finished and we still don't have an admin user,
  // render nothing while the redirect initiated by the useEffect takes place.
  if (!user || !isAdmin) {
    return null;
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
