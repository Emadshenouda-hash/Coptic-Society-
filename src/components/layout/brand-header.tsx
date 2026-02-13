'use client';
import { useLanguage } from "@/context/language-context";

const translations = {
    en: { alt: "The Grand Coptic Benevolent Society" },
    ar: { alt: "الجمعية القبطية الخيرية الكبرى" }
};

export function BrandHeader() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="bg-secondary py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-4">
            <h2 className="font-amiri text-5xl md:text-6xl font-bold text-primary" lang="ar">
              {t.alt}
            </h2>
        </div>

        <div className="font-montserrat bg-primary text-primary-foreground rounded-lg p-4">
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
