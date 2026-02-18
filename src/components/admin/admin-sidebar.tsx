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
    Inbox,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '../language-switcher';

const menuItems = [
    { href: '/admin/dashboard', en: 'Dashboard', ar: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/pages', en: 'Page Content', ar: 'محتوى الصفحة', icon: FileText },
    { href: '/admin/media', en: 'Media Library', ar: 'مكتبة الوسائط', icon: ImageIcon },
    { href: '/admin/news', en: 'News', ar: 'الأخبار', icon: Newspaper },
    { href: '/admin/programs', en: 'Programs', ar: 'البرامج', icon: HeartHandshake },
    { href: '/admin/board-members', en: 'Board Members', ar: 'أعضاء مجلس الإدارة', icon: Users },
    { href: '/admin/documents', en: 'Documents', ar: 'المستندات', icon: FileArchive },
    { href: '/admin/donations', en: 'Donations', ar: 'التبرعات', icon: Gift },
    { href: '/admin/submissions', en: 'Submissions', ar: 'الطلبات', icon: Inbox },
];

const translations = {
  en: {
    adminPanel: 'Admin Panel',
    logOut: 'Log Out',
  },
  ar: {
    adminPanel: 'لوحة التحكم',
    logOut: 'تسجيل الخروج',
  }
};


export function AdminSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();

  const t = translations[language];

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
          {t.adminPanel}
        </h2>
        <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => {
            const label = language === 'ar' ? item.ar : item.en;
            return (
             <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                    onClick={() => router.push(item.href)} 
                    isActive={item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href)} 
                    tooltip={label}
                >
                    <item.icon />
                    {label}
                </SidebarMenuButton>
            </SidebarMenuItem>
          )})}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip={t.logOut}>
                <LogOut />
                {t.logOut}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
    