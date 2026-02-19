import { Footer } from "@/components/layout/footer";
import { BrandHeader } from "@/components/layout/brand-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <BrandHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
