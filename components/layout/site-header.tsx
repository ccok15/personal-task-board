import Link from "next/link";
import { Shield } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { auth, isAdminSession } from "@/lib/auth";
import { publicNavigation } from "@/lib/constants";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = isAdminSession(session);
  const navigation = isAdmin
    ? [
        { href: "/", label: "首页" },
        { href: "/admin/tasks", label: "任务管理" },
      ]
    : publicNavigation;

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(5,8,22,0.82)] backdrop-blur-xl">
      <div className="mx-auto grid h-32 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-3 px-4 py-4 md:h-24 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-y-0 md:px-6 md:py-0">
        <Link href="/" className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold tracking-[0.2em] text-cyan-100">
            TEST OPS
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">个人测试任务看板</p>
            <p className="text-xs text-[var(--muted)]">当前任务 / 任务管理 / 后台入口</p>
          </div>
        </Link>

        <nav className="col-span-2 col-start-1 row-start-2 flex items-center justify-center gap-2 md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center">
          {navigation.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="col-start-2 row-start-1 flex justify-end md:col-start-3">
          {isAdmin ? (
            <SignOutButton callbackUrl="/" size="sm" variant="secondary" />
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin">
                <Shield className="size-4" />
                后台
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
