import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, SearchParamValue>>;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/admin");
  }

  const params = (await searchParams) ?? {};
  const callbackUrl = firstValue(params.callbackUrl) ?? "/admin";

  return (
    <PublicShell>
      <section className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="tech-panel rounded-[28px] p-7">
          <div className="icon-chip mb-6 flex size-14 items-center justify-center rounded-2xl">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-heading text-3xl font-semibold">进入后台控制台</h1>
          <p className="mt-4 text-sm/7 text-[var(--muted)]">
            后台用于维护任务状态、补充管理员备注，以及控制哪些任务对外公开。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>管理员登录</CardTitle>
            <CardDescription>使用预置的管理员账号进入系统。</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm callbackUrl={callbackUrl} />
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  );
}
