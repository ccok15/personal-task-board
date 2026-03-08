import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewTaskPage() {
  await requireAdmin();
  redirect("/?create=1");
}
