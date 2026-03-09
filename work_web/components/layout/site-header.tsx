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
      <div className="mx-auto grid min-h-[5.5rem] w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] auto-rows-auto items-center gap-x-3 gap-y-2 px-4 py-3 md:h-24 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-x-4 md:gap-y-0 md:px-6 md:py-0">
        <Link
          href="/"
          className="col-start-1 row-start-1 flex min-w-0 items-center gap-2 md:gap-3"
        >
          <div className="brand-chip rounded-2xl px-3 py-2 text-xs font-bold tracking-[0.2em]">
            TEST OPS
          </div>
          <div className="min-w-0">
            <p className="text-heading text-sm font-semibold leading-tight">个人测试任务看板</p>
            <p className="hidden text-xs text-[var(--muted)] sm:block">
              当前任务 / 任务管理 / 后台入口
            </p>
          </div>
        </Link>

        <nav className="col-span-2 col-start-1 row-start-2 flex w-full items-center justify-start gap-2 overflow-x-auto pb-1 md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
