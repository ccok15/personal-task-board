import type { ReactNode } from "react";

import { AdminShell } from "@/components/layout/admin-shell";
import { auth, isAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || !isAdminSession(session)) {
    return children;
  }

  return <AdminShell username={session.user?.name ?? "admin"}>{children}</AdminShell>;
}
