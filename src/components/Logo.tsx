import logoUrl from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="SocialHub AI logo"
      width={size}
      height={size}
      className={cn("rounded-lg shadow-[var(--shadow-glow)]", className)}
    />
  );
}
