'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/context/language-context';

const navLinks = [
  { href: '/', en: 'Home', ar: 'الرئيسية' },
  { href: '/about', en: 'About', ar: 'من نحن' },
  { href: '/programs', en: 'Programs', ar: 'برامجنا' },
  { href: '/governance', en: 'Governance', ar: 'الحوكمة' },
  { href: '/membership', en: 'Membership', ar: 'العضوية' },
  { href: '/bylaws', en: 'Bylaws', ar: 'النظام الأساسي' },
  { href: '/contact', en: 'Contact', ar: 'اتصل بنا' },
];

const donateButtonTranslations = {
  en: 'Donate',
  ar: 'تبرع',
};


export function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {language === 'ar' ? link.ar : link.en}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/donate">{donateButtonTranslations[language]}</Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className="p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b p-4">
                    <span className="font-bold text-lg">Menu</span>
                  </div>
                  <nav className="flex flex-col gap-4 p-4 rtl:text-right">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'font-medium transition-colors hover:text-primary',
                          pathname === link.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        {language === 'ar' ? link.ar : link.en}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4 border-t p-4">
                    <LanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
