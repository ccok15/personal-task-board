import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Radar } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { adminNavigation } from "@/lib/constants";
import { THEME_COOKIE_NAME, isThemeValue } from "@/lib/theme";

type AdminShellProps = {
  username: string;
  children: ReactNode;
};

export async function AdminShell({ username, children }: AdminShellProps) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const initialTheme = isThemeValue(themeCookie) ? themeCookie : "dark";

  return (
    <div className="min-h-screen">
      <header className="app-header sticky top-0 z-30">
        <div className="mx-auto grid min-h-[5.5rem] w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] auto-rows-auto items-center gap-x-3 gap-y-2 px-4 py-3 md:h-24 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-x-4 md:gap-y-0 md:px-6 md:py-0">
          <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2 md:gap-3">
            <div className="icon-chip rounded-2xl p-3">
              <Radar className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-heading text-sm font-semibold leading-tight">后台控制台</p>
              <p className="text-xs text-[var(--muted)]">管理员：{username}</p>
            </div>
          </div>
          <nav className="col-span-2 col-start-1 row-start-2 flex w-full items-center justify-start gap-2 overflow-x-auto pb-1 md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <NavLink href="/" label="首页" />
            {adminNavigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 md:col-start-3">
            <ThemeToggle initialTheme={initialTheme} />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
