'use client';
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Heart } from "lucide-react";
import { LanguageSwitcher } from "../language-switcher";

const navLinks = [
  { href: '/', en: 'Home', ar: 'الرئيسية' },
  { href: '/about', en: 'About', ar: 'من نحن' },
  { href: '/programs', en: 'Programs', ar: 'برامجنا' },
  { href: '/governance', en: 'Governance', ar: 'الحوكمة' },
  { href: '/membership', en: 'Membership', ar: 'العضوية' },
  { href: '/bylaws', en: 'Bylaws', ar: 'النظام الأساسي' },
  { href: '/contact', en: 'Contact', ar: 'اتصل بنا' },
];

export function BrandHeader() {
  const { language } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* --- DESKTOP HEADER --- */}
        <div className="hidden md:flex flex-col">
          {/* Top Branding Section */}
          <div className="flex justify-center items-center py-4">
            <Link href="/" className="flex flex-col items-center text-center">
              <h1 className={cn("text-3xl font-bold text-primary font-headline")} lang={language}>
                  {language === 'ar' ? 'الجمعية القبطية الخيرية الكبرى' : 'The Grand Coptic Benevolent Society'}
              </h1>
              <p className="mt-1 font-montserrat text-xs font-light uppercase tracking-widest text-muted-foreground">
                  FOUNDED BY THE LATE BOUTROS PASHA GHALI
              </p>
            </Link>
          </div>

          {/* Bottom Navigation Section */}
          <div className="relative flex h-16 items-center justify-center border-t border-black/10">
            <nav className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-base font-medium transition-colors hover:text-accent',
                      pathname === link.href ? 'text-primary font-semibold' : 'text-muted-foreground'
                    )}
                  >
                    {language === 'ar' ? link.ar : link.en}
                  </Link>
                ))}
            </nav>
            <div className="absolute right-0 flex items-center gap-3">
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold">
                  <Link href="/donate" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {language === 'ar' ? 'تبرع' : 'Donate'}
                  </Link>
                </Button>
                <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* --- MOBILE HEADER --- */}
        <div className="flex h-20 items-center justify-between md:hidden">
            <Link href="/" className="flex flex-col items-start text-left">
                <h1 className={cn("text-lg font-bold text-primary font-headline")} lang={language}>
                    {language === 'ar' ? 'الجمعية القبطية' : 'The Coptic Society'}
                </h1>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold">
                <Link href="/donate" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {language === 'ar' ? 'تبرع' : 'Donate'}
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-full max-w-sm p-0 bg-secondary">
                  <div className="flex h-full flex-col">
                    <div className="border-b p-4">
                      <span className="font-bold text-lg">{language === 'ar' ? 'القائمة' : 'Menu'}</span>
                    </div>
                    <nav className="flex flex-col gap-4 p-4 rtl:text-right">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-accent',
                            pathname === link.href
                              ? 'text-primary font-semibold'
                              : 'text-muted-foreground'
                          )}
                        >
                          {language === 'ar' ? link.ar : link.en}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-4 border-t p-4">
                      <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold">
                        <Link href="/donate" className="flex items-center justify-center gap-2">
                          <Heart className="h-4 w-4" />
                          {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                        </Link>
                      </Button>
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
