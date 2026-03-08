"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 min-w-[6.5rem] items-center justify-center rounded-full border px-4 text-sm whitespace-nowrap transition",
        active
          ? "border-cyan-300/40 bg-cyan-300/10 text-white"
          : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}
