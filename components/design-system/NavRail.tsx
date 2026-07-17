"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { SignOutButton } from "@/components/design-system/SignOutButton";

export interface NavItem {
  href: string;
  label: string;
}

const items: NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/documents", label: "Documents" },
  { href: "/course-profile", label: "Course profile" },
  { href: "/packs", label: "Course packs" },
  { href: "/artifacts", label: "Artifacts" },
  { href: "/settings", label: "Settings" },
];

export function NavRail({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "border-rule bg-canvas flex w-56 shrink-0 flex-col gap-1 border-r p-4",
        className,
      )}
    >
      <p className="text-ink mb-2 px-2 text-sm font-semibold tracking-tight">Wildcat Copilot</p>
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-muted rounded-sm px-2 py-2 text-sm font-medium transition-colors",
              "hover:bg-rule/40 hover:text-ink focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none",
              active && "bg-ink text-canvas hover:bg-ink hover:text-canvas",
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto pt-4">
        <SignOutButton />
      </div>
    </nav>
  );
}
