import { cn } from '@/lib/utils';

export function SectionBadge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {children}
        </span>
        <div className="h-px w-16 bg-accent/50"></div>
    </div>
  );
}
