'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Render nothing while redirecting
  }

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
