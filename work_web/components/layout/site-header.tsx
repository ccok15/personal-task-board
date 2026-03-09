import Link from "next/link";
import { cookies } from "next/headers";
import { Shield } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth, isAdminSession } from "@/lib/auth";
import { publicNavigation } from "@/lib/constants";
import { THEME_COOKIE_NAME, isThemeValue } from "@/lib/theme";

export async function SiteHeader() {
  const session = await auth();
  const cookieStore = await cookies();
  const isAdmin = isAdminSession(session);
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const navigation = isAdmin
    ? [
        { href: "/", label: "首页" },
        { href: "/admin/tasks", label: "任务管理" },
      ]
    : publicNavigation;

  const initialTheme = isThemeValue(themeCookie) ? themeCookie : "dark";

  return (
    <header className="app-header sticky top-0 z-30">
      <div className="mx-auto grid h-32 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-3 px-4 py-4 md:h-24 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-y-0 md:px-6 md:py-0">
        <Link href="/" className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <div className="brand-chip rounded-2xl px-3 py-2 text-xs font-bold tracking-[0.2em]">
            TEST OPS
          </div>
          <div className="min-w-0">
            <p className="text-heading text-sm font-semibold">个人测试任务看板</p>
            <p className="text-xs text-[var(--muted)]">当前任务 / 任务管理 / 后台入口</p>
          </div>
        </Link>

        <nav className="col-span-2 col-start-1 row-start-2 flex items-center justify-center gap-2 md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center">
          {navigation.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 md:col-start-3">
          <ThemeToggle initialTheme={initialTheme} />
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
