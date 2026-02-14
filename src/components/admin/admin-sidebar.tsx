'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
    LayoutDashboard, 
    LogOut,
    FileText,
    Newspaper,
    HeartHandshake,
    Users,
    FileArchive,
    Gift,
    Inbox
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pages', label: 'Page Content', icon: FileText },
    { href: '/admin/news', label: 'News', icon: Newspaper },
    { href: '/admin/programs', label: 'Programs', icon: HeartHandshake },
    { href: '/admin/board-members', label: 'Board Members', icon: Users },
    { href: '/admin/documents', label: 'Documents', icon: FileArchive },
    { href: '/admin/donations', label: 'Donations', icon: Gift },
    { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
];

export function AdminSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  };

  return (
    <Sidebar className="border-r">
       <SidebarHeader className="flex items-center justify-between">
        <h2 className="p-2 text-lg font-semibold tracking-tight">
          Admin Panel
        </h2>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
             <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                    onClick={() => router.push(item.href)} 
                    isActive={item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href)} 
                    tooltip={item.label}
                >
                    <item.icon />
                    {item.label}
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Log Out">
                <LogOut />
                Log Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
