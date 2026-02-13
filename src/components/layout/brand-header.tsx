'use client';
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "700"],
  display: "swap",
});

const translations = {
    en: { alt: "The Grand Coptic Benevolent Society" },
    ar: { alt: "الجمعية القبطية الخيرية الكبرى" }
};

export function BrandHeader() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center mb-4">
            <Image
              src="/assets/logo-arabic.svg"
              alt={t.alt}
              width={720}
              height={100}
              priority
              className="w-full max-w-2xl h-auto"
            />
        </div>

        <div className={cn(montserrat.className, "bg-primary text-primary-foreground rounded-lg p-4")}>
          <h1 className="m-0 font-bold uppercase tracking-wider text-lg md:text-xl lg:text-2xl leading-tight">
            THE GRAND COPTIC BENEVOLENT SOCIETY
          </h1>
          <p className="mt-2 mb-0 font-light uppercase tracking-widest text-xs md:text-sm leading-tight opacity-95">
            FOUNDED BY THE LATE BOUTROS PASHA GHALI
          </p>
        </div>
      </div>
    </header>
  );
}
