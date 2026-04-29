import { cn } from "@/lib/utils";

export type Platform = "twitter" | "linkedin";

export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const base = "inline-flex h-7 w-7 items-center justify-center rounded-md text-white text-xs font-bold";
  if (platform === "twitter") {
    return (
      <span className={cn(base, "bg-twitter", className)} aria-label="X">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-6.99L4.6 22H1.34l8.02-9.166L1 2h7.02l4.84 6.39L18.244 2Zm-2.4 18h1.9L7.24 4H5.24l10.604 16Z"/></svg>
      </span>
    );
  }
  return (
    <span className={cn(base, "bg-linkedin", className)} aria-label="LinkedIn">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18V10.5H6V18h2.34ZM7.17 9.43a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72ZM18 18v-4.3c0-2.3-1.23-3.37-2.87-3.37-1.32 0-1.92.72-2.25 1.23V10.5h-2.34c.03.66 0 7.5 0 7.5h2.34v-4.19c0-.21.02-.42.08-.57.16-.42.55-.86 1.2-.86.84 0 1.18.64 1.18 1.58V18H18Z"/></svg>
    </span>
  );
}
